import { Component } from '@angular/core';
import {Login} from '../modelos/Login';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {LoginService} from '../servicios/login.service';
import {RegistroService} from '../servicios/registro.service';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'app-inicio-sesion',
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgClass,
    FormsModule,
    RouterLink
  ],
  templateUrl: './inicio-sesion.component.html',
  styleUrl: './inicio-sesion.component.css'
})
export class InicioSesionComponent {
  loginForm: FormGroup;
  login: Login = new Login();
  private pendingLogin?: Login;

  alertaVisible = false;
  alertaMensaje = '';
  alertaTipo: 'success' | 'error' = 'success';

  promptVisible = false;
  promptTitulo = '';
  promptMensaje = '';
  promptPlaceholder = '';
  promptInputType = 'text';
  promptValor: string = '';
  promptTipo: 'input' | 'confirm' = 'input';
  private promptResolver: ((value: string | null) => void) | null = null;

  constructor(private formBuilder: FormBuilder, private loginService: LoginService, private router: Router) {
    this.loginForm = this.formBuilder.group({
      email: [this.login.email, Validators.required],
      password: [this.login.password, Validators.required],
    });
  }

  hacerLogin() {
    if (this.loginForm.invalid) {
      this.mostrarAlerta('Por favor complete el formulario correctamente.', 'error');
      return;
    }

    const loginPayload: Login = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.pendingLogin = loginPayload;

    this.loginService.loguearUsuario(loginPayload).subscribe({
      next: (res) => {
        const token = res?.token || res?.accessToken || res?.jwt || res?.data?.token;
        if (!token) {
          this.mostrarAlerta('Respuesta inválida. No está registrado.', 'error');
          return;
        }

        sessionStorage.setItem('authToken', token);
        this.loginService.setAuthState(true);

        this.router.navigate(['/perfil']).catch(() => {
          this.mostrarAlerta('Login correcto.', 'success');
        });
      },
      error: (err) => {
        const errMsg = (err?.error?.message || err?.message || '').toString().toLowerCase();
        if (errMsg.includes('verif') || err?.status === 403) {
          this.mostrarAlerta('Tienes que verificar primero tu cuenta, revisa tu correo', 'error');
          this.solicitarVerificacion(loginPayload.email, true);
          return;
        }

        this.mostrarAlerta(`Error: ${err?.error?.message || err?.message || 'Error en el login'}`, 'error');
      }
    });
  }

  async solicitarVerificacion(email?: string, reintentarDespues = false) {
    let correo = email || this.loginForm.value.email;
    if (!correo) {
      correo = await this.mensajePrompt('Verificar Cuenta', 'Introduce tu correo electrónico para verificar tu cuenta:', 'correo@ejemplo.com', 'text') || '';
      if (!correo) {
        this.mostrarAlerta('Se necesita un correo para verificar la cuenta.', 'error');
        return;
      }
    }

    const codigo = await this.mensajePrompt('Código de Verificación', 'Introduce el código que recibiste en tu correo:', 'Ej: 123456', 'text');
    if (!codigo) {
      this.mostrarAlerta('No introdujiste ningún código.', 'error');
      return;
    }

    this.loginService.verificarCodigo({ email: correo, codigo }).subscribe({
      next: () => {
        this.mostrarAlerta('Cuenta verificada correctamente.', 'success');
        if (reintentarDespues && this.pendingLogin) {
          this.loginService.loguearUsuario(this.pendingLogin).subscribe({
            next: (res) => {
              const token = res?.token || res?.accessToken || res?.jwt || res?.data?.token;
              if (!token) {
                this.mostrarAlerta('Verificado, pero no se recibió token al intentar iniciar sesión.', 'error');
                return;
              }
              sessionStorage.setItem('authToken', token);
              this.loginService.setAuthState(true);
              this.router.navigate(['/perfil']).catch(() => {
                this.mostrarAlerta('Login correcto.', 'success');
              });
            },
            error: (err: any) => {
              this.mostrarAlerta(`Error al iniciar sesión tras verificar: ${err?.error?.message || err?.message || err}`, 'error');
            }
          });
        }
      },
      error: (err: any) => {
        if (err.status === 400) {
          this.mostrarAlerta('El código o el correo son incorrecto', 'error');
          return;
        }

        const mensaje = err?.error?.message || err?.message || 'Error al verificar el código';
        this.mostrarAlerta(`Error: ${mensaje}`, 'error');
      }
    });
  }

  async recuperarContrasena(email?: string) {
    let correo = email || this.loginForm.value.email;
    if (!correo) {
      correo = await this.mensajePrompt('Verificar Cuenta', 'Introduce tu correo electrónico para verificar tu cuenta:', 'correo@ejemplo.com', 'text') || '';
      if (!correo) {
        this.mostrarAlerta('Se necesita un correo para verificar la cuenta.', 'error');
        return;
      }
    }

    this.loginService.enviarCodigoRecuperacion(correo).subscribe({
      next: async () => {
        this.mostrarAlerta('Correo enviado con código de recuperación.', 'success');
        const codigo = await this.mensajePrompt('Código de Verificación', 'Introduce el código que recibiste en tu correo:', 'Ej: 123456', 'text');
        if (!codigo) {
          this.mostrarAlerta('No introdujiste código.', 'error');
          return;
        }
        const nueva = await this.mensajePrompt('Nueva contraseña', 'Introduce la nueva contraseña:', '******', 'password');
        if (!nueva) {
          this.mostrarAlerta('No introdujiste la nueva contraseña.', 'error');
          return;
        }
        const confirmar = await this.mensajePrompt('Confirmar contraseña', 'Vuelve a escribir la nueva contraseña:', '******', 'password');
        if (nueva !== confirmar) {
          this.mostrarAlerta('Las contraseñas no coinciden.', 'error');
          return;
        }

        this.loginService.cambiarContrasena({ email: correo, codigo, nuevaPassword: nueva }).subscribe({
          next: () => {
            this.mostrarAlerta('Contraseña actualizada correctamente. Ya puedes iniciar sesión.', 'success');
          },
          error: (err: any) => {
            if (err?.status === 400) {
              this.mostrarAlerta('Código inválido o petición incorrecta.');
              return;
            }
            const mensaje = err?.error?.message || err?.message || 'Error al cambiar la contraseña';
            this.mostrarAlerta(`Error: ${mensaje}`, 'error');
          }
        });
      },
      error: (err: any) => {
        const mensaje = err?.error?.message || err?.message || 'Error al enviar el código de recuperación';
        this.mostrarAlerta(`Error: ${mensaje}`, 'error');
      }
    });
  }

  mostrarAlerta(mensaje: string, tipo: 'success' | 'error' = 'success') {
    this.alertaMensaje = mensaje;
    this.alertaTipo = tipo;
    this.alertaVisible = true;

    setTimeout(() => {
      this.alertaVisible = false;
    }, 3500);
  }

  mensajePrompt(titulo: string, mensaje: string, placeholder = '', inputType: 'text' | 'password' = 'text'): Promise<string | null> {
    this.promptTitulo = titulo;
    this.promptMensaje = mensaje;
    this.promptPlaceholder = placeholder;
    this.promptInputType = inputType;
    this.promptTipo = 'input';
    this.promptValor = '';

    this.promptVisible = true;

    return new Promise((respuesta) => {
      this.promptResolver = respuesta;
    });
  }

  confirmarPrompt() {
    if (this.promptResolver) this.promptResolver(this.promptValor);
    this.promptVisible = false;
  }

  cancelarPrompt() {
    if (this.promptResolver) this.promptResolver(null);
    this.promptVisible = false;
  }
}
