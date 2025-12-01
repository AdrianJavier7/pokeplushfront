import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Navbar} from '../navbar/navbar';
import {Footer} from '../footer/footer';
import {FormsModule} from '@angular/forms';
import {Producto} from '../modelos/Producto';
import {HttpClient} from '@angular/common/http';
import {ProductoService} from '../servicios/ProductoService';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-crear-productos',
  imports: [CommonModule, Navbar, Footer, FormsModule],
  templateUrl: './crear-productos.html',
  styleUrl: './crear-productos.css',
})
export class CrearProductos implements OnInit {
  nuevoProducto: Producto = {
    id: undefined,
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
  editarMood = false;

  constructor(private productoService:ProductoService,
              private route: ActivatedRoute,
              private router: Router) {}

  onFileSelected(event: any): void {
    this.fotoElegida = event.target.files[0];
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editarMood = true;
      this.productoService.getProductoPorId(+id).subscribe(producto => {
        this.nuevoProducto = producto;
      });
    }
  }

  guardarProducto() {
    if (this.editarMood){
      this.productoService.editarProducto(this.nuevoProducto, this.fotoElegida).subscribe({
        next: () => {
          alert('Producto actualizado correctamente')
          this.router.navigate(['/productos']);
        },
        error: (error) => {
          console.log("Error al guardar producto", error);
          alert('No se pudo curar al pokemon. Parece que sigue igual.');
        }
      });
    } else {
      this.productoService.crearProducto(this.nuevoProducto, this.fotoElegida).subscribe({
        next: () => {
          console.log('Se ha creado un nuevo producto');
          alert('¡Pokemon registrado correctamente!');
          this.router.navigate(['/productos']);
        },
        error: (error) => {
          console.log('Ha habido un error al crear producto', error);
          alert('Parece que el pokemon ha huido :(');
        }
      });
    }
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
