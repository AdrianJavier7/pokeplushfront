import {Component, OnInit} from '@angular/core';
import {Producto} from '../modelos/Producto';
import { CommonModule } from '@angular/common';
import {ProductoService} from '../servicios/producto';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-productos',
  imports: [
    RouterLink,
    CommonModule,
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
