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

  templateUrl: './productos.component.html'
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];

  constructor(private productosService: ProductoService) {}

  ngOnInit(): void {
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


}
