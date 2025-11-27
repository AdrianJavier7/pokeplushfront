import { Component } from '@angular/core';
import {Login} from '../modelos/Login';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {LoginService} from '../servicios/login.service';
import {RegistroService} from '../servicios/registro.service';

@Component({
  selector: 'app-inicio-sesion',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './inicio-sesion.component.html',
  styleUrl: './inicio-sesion.component.css'
})
export class InicioSesionComponent {
  loginForm: FormGroup;
  login: Login = new Login();
  private pendingLogin?: Login;

  constructor(private formBuilder: FormBuilder, private loginService: LoginService, private router: Router) {
    this.loginForm = this.formBuilder.group({
      email: [this.login.email, Validators.required],
      password: [this.login.password, Validators.required],
    });
  }

  hacerLogin() {
    if (this.loginForm.invalid) {
      alert('Por favor complete el formulario correctamente.');
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
          alert('Respuesta inválida. No está registrado.');
          return;
        }

        sessionStorage.setItem('authToken', token);
        this.loginService.setAuthState(true);

        this.router.navigate(['/perfil']).catch(() => {
          alert('Login correcto.');
        });
      },
      error: (err) => {
        const errMsg = (err?.error?.message || err?.message || '').toString().toLowerCase();
        if (errMsg.includes('verif') || err?.status === 403) {
          alert('Tienes que verificar primero tu cuenta, revisa tu correo');
          this.solicitarVerificacion(loginPayload.email, true);
          return;
        }

        alert(`Error: ${err?.error?.message || err?.message || 'Error en el login'}`);
      }
    });
  }

  solicitarVerificacion(email?: string, reintentarDespues = false) {
    let correo = email || this.loginForm.value.email;
    if (!correo) {
      correo = window.prompt('Introduce tu correo electrónico para verificar la cuenta:') || '';
      if (!correo) {
        alert('Se necesita un correo para verificar la cuenta.');
        return;
      }
    }

    const codigo = window.prompt('Introduce el código de verificación que recibiste en el registro:') || '';
    if (!codigo) {
      alert('No introdujiste ningún código.');
      return;
    }

    this.loginService.verificarCodigo({ email: correo, codigo }).subscribe({
      next: () => {
        alert('Cuenta verificada correctamente.');
        if (reintentarDespues && this.pendingLogin) {
          this.loginService.loguearUsuario(this.pendingLogin).subscribe({
            next: (res) => {
              const token = res?.token || res?.accessToken || res?.jwt || res?.data?.token;
              if (!token) {
                alert('Verificado, pero no se recibió token al intentar iniciar sesión.');
                return;
              }
              sessionStorage.setItem('authToken', token);
              this.loginService.setAuthState(true);
              this.router.navigate(['/perfil']).catch(() => {
                alert('Login correcto.');
              });
            },
            error: (err: any) => {
              alert(`Error al iniciar sesión tras verificar: ${err?.error?.message || err?.message || err}`);
            }
          });
        }
      },
      error: (err: any) => {
        if (err.status === 400) {
          alert('El código es incorrecto');
          return;
        }

        const mensaje = err?.error?.message || err?.message || 'Error al verificar el código';
        alert(`Error: ${mensaje}`);
      }
    });
  }

  recuperarContrasena() {
    let correo = this.loginForm.value.email || window.prompt('Introduce tu correo electrónico para recuperar la contraseña:') || '';
    if (!correo) {
      alert('Se necesita un correo para recuperar la contraseña.');
      return;
    }

    this.loginService.enviarCodigoRecuperacion(correo).subscribe({
      next: () => {
        alert('Correo enviado con código de recuperación.');
        const codigo = window.prompt('Introduce el código de recuperación que recibiste:') || '';
        if (!codigo) {
          alert('No introdujiste código.');
          return;
        }
        const nueva = window.prompt('Introduce la nueva contraseña:') || '';
        if (!nueva) {
          alert('No introdujiste la nueva contraseña.');
          return;
        }
        const confirmar = window.prompt('Confirma la nueva contraseña:') || '';
        if (nueva !== confirmar) {
          alert('Las contraseñas no coinciden.');
          return;
        }

        this.loginService.cambiarContrasena({ email: correo, codigo, nuevaPassword: nueva }).subscribe({
          next: () => {
            alert('Contraseña actualizada correctamente. Ya puedes iniciar sesión.');
          },
          error: (err: any) => {
            if (err?.status === 400) {
              alert('Código inválido o petición incorrecta.');
              return;
            }
            const mensaje = err?.error?.message || err?.message || 'Error al cambiar la contraseña';
            alert(`Error: ${mensaje}`);
          }
        });
      },
      error: (err: any) => {
        const mensaje = err?.error?.message || err?.message || 'Error al enviar el código de recuperación';
        alert(`Error: ${mensaje}`);
      }
    });
  }
}
