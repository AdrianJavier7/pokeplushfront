import {Component, ViewChild} from '@angular/core';
import {Registro} from '../modelos/Registro';
import {RegistroService} from '../servicios/registro.service';
import {FormsModule, NgForm} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'app-registro',
  imports: [
    FormsModule,
    NgIf,
    NgClass,
    RouterLink
  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  @ViewChild('registroForm') registroForm?: NgForm;

  registro: Registro = new Registro();
  aceptaTerminos: boolean = false;
  cargando: boolean = false;

  alertaVisible = false;
  alertaMensaje = '';
  alertaTipo: 'success' | 'error' = 'success';

  constructor(private registroService: RegistroService, private router: Router) { }

  private resetear() {
    this.registroForm?.resetForm();
    this.registro = new Registro();
    this.aceptaTerminos = false;
    this.router.navigate(['/inicio-sesion']);
  }

  hacerRegistro() {
    if (!this.registro.email || !this.registro.password) {
      this.mostrarAlerta('Por favor, complete todos los campos', 'error');
      return;
    }

    const formatoEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formatoEmail.test(this.registro.email)) {
      this.mostrarAlerta('El correo no tiene un formato válido.', 'error');
      return;
    }

    if (!this.aceptaTerminos) {
      this.mostrarAlerta('Debe aceptar los términos', 'error');
      return;
    }

    this.cargando = true;
    const creds = { email: this.registro.email, password: this.registro.password };

    this.registroService.registrarUsuario(this.registro).subscribe({
      next: () => {
        this.registroService.enviarEmail(creds).subscribe({
          next: () => {
            this.cargando = false;
            this.mostrarAlerta('Registro exitoso.', 'success');
            this.resetear();
          },
          error: () => {
            this.cargando = false;
            this.mostrarAlerta('Registro fallido.', 'success');
            this.resetear();
          }
        });
      },
      error: (err: any) => {
        this.cargando = false;
        const mensajeServidor = err?.error?.message || err?.error || err?.message;
        if (err?.status === 409 || /registrad/i.test(mensajeServidor)) {
          this.mostrarAlerta('El correo ya está registrado. Por favor use otro correo o inicie sesión.', 'error');
          return;
        }
        if (mensajeServidor) {
          this.mostrarAlerta(mensajeServidor, 'error');
          return;
        }
        this.mostrarAlerta('Error al registrar el usuario', 'error');
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
}
