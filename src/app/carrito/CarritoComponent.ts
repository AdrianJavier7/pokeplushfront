// src/app/carrito/CarritoComponent.ts
import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../servicios/CarritoService';
import { ProductoService } from '../servicios/ProductoService';
import { Carrito } from '../modelos/Carrito';
import { Producto } from '../modelos/Producto';
import {ItemCarrito} from '../modelos/ItemCarrito';
import {Item} from '../modelos/Item';

@Component({
  selector: 'app-carrito',
  imports: [],
  templateUrl: './carrito.html',
  styleUrls: ['./carrito.css'],
})
export class CarritoComponent implements OnInit {

  private carrito: Carrito | null = null;
  private listaIdProductos: number[] = [];
  productosEnCarrito: Producto[] = [];
  itemsEnCarrito: ItemCarrito[] = [];
  item : Item | null = null;

  constructor(private carritoService: CarritoService, private productoService: ProductoService) {}

  ngOnInit() {
    this.carritoService.getCarrito().subscribe({
      next: (data) => {
        this.carrito = data;

        // Reconstruir la lista de ids y solicitar productos solo cuando haya datos
        this.listaIdProductos = [];

        // Comprobar que carrito existe y que tiene items
        if (this.carrito?.items && this.carrito.items.length > 0) {
          this.carrito.items.forEach((item: { idProducto?: number }) => {
            if (item.idProducto != null) {
              this.listaIdProductos.push(item.idProducto);
            }
          });

          this.itemsEnCarrito = this.carrito.items;
        }

        if (this.listaIdProductos.length > 0) {
          this.productoService.getProductosPorVariosIds(this.listaIdProductos).subscribe({
            next: (productos) => {
              this.productosEnCarrito = productos;
              console.log('Productos en carrito:', productos);
            },
            error: (err) => {
              console.error('Error al obtener productos:', err);
            },
            complete: () => {
              console.log('Carga de productos completada');
            }
          });
        }
      },
      error: (err) => {
        console.error('Error al obtener carrito:', err);
      },
      complete: () => {
        console.log('Carga de carrito completada');
      }
    });
  }


  obtenerCantidadProducto(idProducto: number): number {
    const item = this.itemsEnCarrito.find(i => i.idProducto === idProducto);
    return item?.cantidad ?? 0;
  }

  finalizarCompra() {
    this.carritoService.finalizarCarrito().subscribe({
      next: (data) => {
        console.log('Compra finalizada:', data);
        // Aquí podrías redirigir al usuario o mostrar un mensaje de éxito
      },
      error: (err) => {
        console.error('Error al finalizar compra:', err);
      }
    });
  }

  calcularTotal(): number {
    let total = 0;
    for (const producto of this.productosEnCarrito) {
      const cantidad = this.obtenerCantidadProducto(producto.id!);
      total += producto.precio! * cantidad;
    }
    return total;
  }

  quitarItem(idProducto: number) {


    this.item = {idCarrito: this.carrito?.id, idProducto: idProducto};

    if (this.item) {
      this.carritoService.quitarItem(this.item).subscribe({
        next: (data) => {
          console.log('Item eliminado:', data);
          this.ngOnInit(); // Recargar el carrito después de eliminar el item
        },
        error: (err) => {
          console.error('Error al eliminar item:', err);
        }
      });
    }
  }

}
