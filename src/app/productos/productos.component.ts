import {Component, OnInit} from '@angular/core';
import {Producto} from '../modelos/Producto';
import { CommonModule } from '@angular/common';
import {ProductoService} from '../servicios/ProductoService';
import {RouterLink} from '@angular/router';
import {Navbar} from '../navbar/navbar';
import {Footer} from '../footer/footer';
import {FormsModule} from '@angular/forms';
import {OpinionesMostrar} from '../modelos/OpinionesMostrar';
import {Opiniones} from '../modelos/Opiniones';
import {opinionesService} from '../servicios/opinionesService';

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
  mediasProducto: OpinionesMostrar[] = [];
  opiniones: Opiniones[] = [];

  constructor(private productosService: ProductoService, private opinionService: opinionesService) { }

  ngOnInit(): void {
    this.productosService.getProducto().subscribe({
      next: (data: Producto[]) => {
        this.productos = data.filter(p => p.habilitado);
        console.log('Productos recibidos:', data);
        this.calcularMedias();
      },
      error: (err: any) => {
        console.error('Error al cargar productos', err);
      }
    });
  }

  menuVisible = false;
  selectedOption = 'Ordenar por:';

  toggleDropdown() {
    this.menuVisible = !this.menuVisible;
  }


  calcularMedias() {
    console.log("hola soy el metodo de calcular medias");
    // For para calcular la media de todos los productos
    for(let producto of this.productos) {

      this.opinionService.getByProducto(producto.id!).subscribe({
        next: (data: Opiniones[]) => {
          this.opiniones = data;
          console.log("Opiniones: " + data);
          if (this.opiniones.length > 0) {
            // Sumas de opiniones
            const sumaCalificaciones = this.opiniones.reduce((sum, opi) => sum + (opi.opinion ?? 0), 0);

            // Hacemos la media
            const media = sumaCalificaciones / this.opiniones.length;

            // Lo guardo en el objeto nuevo que he hecho
            const mediaProductoAMostrar: OpinionesMostrar = {idProducto: producto.id!, media: media};

            // A la lista
            this.mediasProducto.push(mediaProductoAMostrar);
            console.log("HOla"+this.mediasProducto);

          } else {
            const mediaProductoAMostrar: OpinionesMostrar = {idProducto: producto.id!, media: 0};
            this.mediasProducto.push(mediaProductoAMostrar);

          }
        },
        error: (err: any) => {
          console.error('Error al cargar opiniones para calcular la media', err);
        }
      });
    }
  }

  obtenerMediaPorProducto(productoId: number): number | undefined {
    const mediaProducto = this.mediasProducto.find(mp => mp.idProducto === productoId);
    return mediaProducto ? mediaProducto.media : undefined;
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
