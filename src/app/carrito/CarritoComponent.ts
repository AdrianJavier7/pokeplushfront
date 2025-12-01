// src/app/carrito/CarritoComponent.ts
import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../servicios/CarritoService';
import { ProductoService } from '../servicios/ProductoService';
import { Carrito } from '../modelos/Carrito';
import { Producto } from '../modelos/Producto';
import {ItemCarrito} from '../modelos/ItemCarrito';
import {Item} from '../modelos/Item';
import {Navbar} from '../navbar/navbar';
import {Footer} from '../footer/footer';
import Swal from 'sweetalert2';
import {DecimalPipe} from '@angular/common';

@Component({
  selector: 'app-carrito',
  imports: [
    Navbar,
    Footer,

  ],
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
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar el carrito',
          text: err.message || 'Ha ocurrido un error inesperado',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#dc2626'
        });
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

  obtenerPrecioTotalPorCantidadProducto(idProducto: number): number {
    const producto = this.productosEnCarrito.find(p => p.id === idProducto);
    const cantidad = this.obtenerCantidadProducto(idProducto);
    return producto ? producto.precio! * cantidad : 0;
  }

  finalizarCompra() {
    this.carritoService.finalizarCarrito().subscribe({
      next: (data) => {
        Swal.fire({
          icon: 'success',
          title: '¡Compra finalizada!',
          text: 'Gracias por su compra.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#16a34a'
        });
        this.ngOnInit(); // Recargar el carrito después de finalizar la compra
      },
      error: (err) => {
        console.error('Error al finalizar compra:', err);
      }
    });
  }

  anyadirProducto(idProducto: number) {
      this.carritoService.anyadirProductoCarrito(idProducto).subscribe({
        next: (data) => {
          this.ngOnInit(); // Recargar el carrito después de añadir el producto
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al añadir producto',
            text: err.message || 'Ha ocurrido un error inesperado',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#dc2626'
          })
        }
      })
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
          this.ngOnInit();
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al eliminar el producto',
            text: err.message || 'Ha ocurrido un error inesperado',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#dc2626'
          });
        }
      });
    }
  }

  confirmarQuitarItem(idProducto: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se eliminará el producto del carrito',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.quitarItem(idProducto);
        Swal.fire({
          title: '¡Eliminado!',
          text: 'El producto ha sido eliminado del carrito',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }

  confirmarCompra() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se procederá a finalizar la compra',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, comprar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.finalizarCompra();
        Swal.fire({
          title: '¡Comprado!',
          text: '¡Gracias Por su compra!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }

}
