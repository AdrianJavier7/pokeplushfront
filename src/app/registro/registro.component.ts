import {Component, ViewChild} from '@angular/core';
import {Registro} from '../modelos/Registro';
import {RegistroService} from '../servicios/registro.service';
import {FormsModule, NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-registro',
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  @ViewChild('registroForm') registroForm?: NgForm;

  registro: Registro = new Registro();
  aceptaTerminos: boolean = false;
  cargando: boolean = false;

  constructor(private registroService: RegistroService, private router: Router) { }

  private resetear() {
    this.registroForm?.resetForm();
    this.registro = new Registro();
    this.aceptaTerminos = false;
    this.router.navigate(['/inicio-sesion']);
  }

  hacerRegistro() {
    if (!this.registro.email || !this.registro.password) {
      alert('Por favor, complete todos los campos');
      return;
    }

    if (!this.aceptaTerminos) {
      alert('Debe aceptar los términos');
      return;
    }

    this.cargando = true;
    const creds = { email: this.registro.email, password: this.registro.password };

    this.registroService.registrarUsuario(this.registro).subscribe({
      next: () => {
        this.registroService.enviarEmail(creds).subscribe({
          next: () => {
            this.cargando = false;
            alert('Registro exitoso.');
            this.resetear();
          },
          error: () => {
            this.cargando = false;
            alert('Registro fallido');
            this.resetear();
          }
        });
      },
      error: (err: any) => {
        this.cargando = false;
        const mensajeServidor = err?.error?.message || err?.error || err?.message;
        if (err?.status === 409 || /registrad/i.test(mensajeServidor)) {
          alert('El correo ya está registrado. Por favor use otro correo o inicie sesión.');
          return;
        }
        if (mensajeServidor) {
          alert(mensajeServidor);
          return;
        }
        alert('Error al registrar el usuario');
      }
    });
  }
}
