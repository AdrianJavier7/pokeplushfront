import {Component, OnInit} from '@angular/core';
import {Footer} from '../footer/footer';
import {Navbar} from '../navbar/navbar';
import {FormsModule} from '@angular/forms';
import {PerfilService} from '../servicios/perfil.service';
import {Usuario} from '../modelos/Usuario';
import {Router} from '@angular/router';
import {LoginService} from '../servicios/login.service';

@Component({
  selector: 'app-perfil',
  imports: [
    Footer,
    Navbar,
    FormsModule,
    FormsModule,
  ],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  usuario: Usuario = { direccion: {} };
  fotoElegida ?: File;
  preevistaImagen: string | ArrayBuffer | null = null;
  telefonoValido = true;

  constructor(private perfilService: PerfilService, private loginService: LoginService, private router: Router) {}

  ngOnInit(): void {
    this.perfilService.getMiPerfil().subscribe({
      next: u => {
        u.direccion = u.direccion || {};
        if (u.fechaNacimiento) {
          u.fechaNacimiento = this.formatoEntrada(u.fechaNacimiento);
        }
        this.usuario = u;
      },
      error: err => console.error('Error cargando perfil:', err)
    });
  }

  onFileSelected(event: any): void {
    const file: File | undefined = event?.target?.files?.[0];
    if (!file) return;
    this.fotoElegida = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.preevistaImagen = reader.result;
    };
    reader.readAsDataURL(file);
  }

  guardarCambios(): void {
    this.telefonoValido = this.validarTelefono();
    if (!this.telefonoValido) {
      alert('El teléfono debe tener exactamente 9 dígitos y deben ser números.');
      return;
    }

    if (!this.validarFechaNacimiento()) {
      alert('La fecha de nacimiento debe ser anterior o igual a la fecha de hoy.');
      return;
    }

    const cargar: Usuario = { ...this.usuario };
    if (cargar.fechaNacimiento) {
      cargar.fechaNacimiento = this.envioBackendFecha(cargar.fechaNacimiento);
    }

    this.perfilService.updatePerfil(cargar, this.fotoElegida).subscribe({
      next: u => {
        if (u.fechaNacimiento) {
          u.fechaNacimiento = this.formatoEntrada(u.fechaNacimiento);
        }
        this.usuario = u;
        this.preevistaImagen = null;
        alert('Perfil actualizado');
      },
      error: err => console.error('Error al actualizar perfil:', err)
    });
  }

  private validarTelefono(): boolean {
    const t = (this.usuario as any).telefono;
    if (t == null) return true;
    const s = String(t).replace(/\s+/g, '');
    return /^\d{9}$/.test(s);
  }

  private validarFechaNacimiento(): boolean {
    const dateStr = (this.usuario as any).fechaNacimiento;
    if (dateStr == null || dateStr === '') return true;

    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return false;

    const hoy = new Date();
    d.setHours(0, 0, 0, 0);
    hoy.setHours(0, 0, 0, 0);
    return d.getTime() <= hoy.getTime();
  }

  // Convierte a yyyy-mm-dd para el date
  private formatoEntrada(date: string): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) return date;
    return d.toISOString().slice(0, 10);
  }

  // Si está en formato "yyyy-MM-dd", convertir con hora UTC para el backend
  private envioBackendFecha(dateStr: string): string {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const d = new Date(dateStr);
      return d.toISOString();
    }
    return dateStr;
  }

  cerrarSesion(): void {
    sessionStorage.removeItem('authToken');
    this.loginService.setAuthState(false);
    this.perfilService.setUsuario(undefined);
    this.router.navigate(['/inicio-sesion']);
  }

  irPedidos(): void {
    this.router.navigate(['/pedidos']);
  }
}
