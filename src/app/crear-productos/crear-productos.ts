import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {Navbar} from '../navbar/navbar';
import {Footer} from '../footer/footer';
import {FormsModule} from '@angular/forms';
import {Producto} from '../modelos/Producto';
import {HttpClient} from '@angular/common/http';
import {ProductoService} from '../servicios/ProductoService';

@Component({
  selector: 'app-crear-productos',
  imports: [CommonModule, Navbar, Footer, FormsModule],
  templateUrl: './crear-productos.html',
  styleUrl: './crear-productos.css',
})
export class CrearProductos {
  nuevoProducto: Producto = {
    id: 0,
    nombre: '',
    descripcion: '',
    precio: 0,
    tipo: '',
    tipo2: null,
    foto: "",
    stock: 0,
    habilitado: true

  };
  //Para la foto
  fotoElegida?: File;

  constructor(private productoService:ProductoService) {}

  onFileSelected(event: any): void {
    this.fotoElegida = event.target.files[0];
  }

  crearProducto() {
    this.productoService.crearProducto(this.nuevoProducto, this.fotoElegida).subscribe({
      next: (productoCreado) => {
        console.log('Se ha creado un nuevo producto:', productoCreado);
        alert('¡Pokemon registrado correctamente!');


      },
      error: (error) => {
        console.log('Ha habido un error al crear producto', error);
        alert('Parece que el pokemon ha huido :(');
      }
    });
  }

  resetearForm(): void {
    this.nuevoProducto = {
      id: 0,
      nombre: '',
      descripcion: '',
      precio: 0,
      tipo: '',
      tipo2: null,
      foto: '',
      stock: 0,
      habilitado: true
    };
    this.fotoElegida = undefined;
  }

}
