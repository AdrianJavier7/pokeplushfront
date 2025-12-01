import {Component, OnInit} from '@angular/core';
import {Producto} from '../modelos/Producto';
import { CommonModule } from '@angular/common';
import {ProductoService} from '../servicios/ProductoService';
import {RouterLink} from '@angular/router';
import {Navbar} from '../navbar/navbar';
import {Footer} from '../footer/footer';

@Component({
  selector: 'app-productos',
  imports: [
    RouterLink,
    CommonModule,
    Navbar,
    Footer,
  ],

  templateUrl: './productos-admin.html'
})
export class ProductosAdmin implements OnInit {
  productos: Producto[] = [];

  constructor(private productosService: ProductoService) {}

  ngOnInit(): void {
    this.cargarProducto();
  }

  cargarProducto() {
    this.productosService.getProducto().subscribe({
      next: (data: Producto[]) => {
        this.productos = data;
        console.log('Productos recibidos:', data);
      },
      error: (err: any) => {
        console.error('Error al cargar productos', err);
      }
    });
  }



  eliminarProducto(id: number) {
    const confirmar = window.confirm("¿Está totalmente seguro de borrar este producto?");
    if (confirmar) {
      this.productosService.eliminarProducto(id).subscribe({
        next: () => {
          alert("Producto eliminado correctamente");
          this.cargarProducto();
        },
        error: (err: any) => {
          alert("Error al cargar eliminar el productos");
        }
      });
    }
  }

  toggleHabilitado(producto: Producto) {
    if (producto.habilitado) {
      this.productosService.deshabilitarProducto(producto.id!).subscribe({
        next: () => {
          producto.habilitado = false;
          alert("Producto deshabilitado correctamente");
        },
        error: (err) => console.log("Error al deshabilitar producto", err)
      });
    } else {
      this.productosService.habilitarProducto(producto.id!).subscribe({
        next: () => {
          producto.habilitado = true;
          alert("Producto habilitado correctamente");
        },
        error: (err) => console.log("Error al habilitar producto", err)
      });
    }
  }

  anadirProducto(producto: Producto) {
    const cantidad = Number(prompt("Indica el stock que quieres añadir."));
    if (!cantidad || cantidad <= 0) return;

    this.productosService.anadirStock(producto.id!, cantidad).subscribe({
      next: (actualizado) => {
        producto.stock = actualizado.stock;
        alert("Stock actualizado correctamente");
      },
      error: (err) => console.error("Error al actualizar stock", err)
    });
  }
}
