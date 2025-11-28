import {Component, OnInit} from '@angular/core';
import {Producto} from '../modelos/Producto';
import { CommonModule } from '@angular/common';
import {ProductoService} from '../servicios/ProductoService';
import {RouterLink} from '@angular/router';
import {Navbar} from '../navbar/navbar';
import {Footer} from '../footer/footer';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-productos',
  imports: [
    RouterLink,
    CommonModule,
    Navbar,
    Footer,
    FormsModule,
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

  menuVisible = false;
  selectedOption = 'Orden Alfabético';

  toggleDropdown() {
    this.menuVisible = !this.menuVisible;
  }

  selectOption(text: string) {
    this.selectedOption = text;
    this.menuVisible = false;

    switch (text) {
      case 'Orden Alfabético':
        this.productosService.listarAlfabetico().subscribe(data => this.productos = data);
        break;

      case 'Precio: Menor a mayor':
        this.productosService.listarPrecioAsc().subscribe(data => this.productos = data);
        break;

      case 'Precio: Mayor a menor':
        this.productosService.listarPrecioDesc().subscribe(data => this.productos = data);
        break;
    }
  }

  busqueda: string = '';

  buscar(){
    this.productosService.buscarPorNombre(this.busqueda).subscribe(data => {this.productos = data});
  }

}
