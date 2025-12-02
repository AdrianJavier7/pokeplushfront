
import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../servicios/CarritoService';
import { ProductoService } from '../servicios/ProductoService';
import { Carrito } from '../modelos/Carrito';
import { Producto } from '../modelos/Producto';
import {ItemCarrito} from '../modelos/ItemCarrito';
import {Item} from '../modelos/Item';
import {Navbar} from '../navbar/navbar';
import {Footer} from '../footer/footer';
// Importar SweetAlert2 que sirve para mostrar alertas bonitas
import Swal from 'sweetalert2';
import {ComunService} from '../servicios/comun.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-carrito',
  imports: [
    Navbar,
    Footer,
    FormsModule,

  ],
  templateUrl: './carrito.html',
  styleUrls: ['./carrito.css'],
})
export class CarritoComponent implements OnInit {

  // Definimos las variables necesarias
  private carrito: Carrito | null = null;
  private listaIdProductos: number[] = [];
  productosEnCarrito: Producto[] = [];
  itemsEnCarrito: ItemCarrito[] = [];
  item: Item | null = null;
  vistaActual: 'carta' | 'lista' = 'carta';
  window = window;
  mostrarModalPago: boolean = false;
  pasoActual: number = 1; // 1: Datos, 2: Meodo pago, 3: Procesando
  pagoEnProceso: boolean = false;
  datosFacturacion = {
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    pais: 'España'
  };
  datosTarjeta = {
    numero: '',
    titular: '',
    expiracion: '',
    cvv: ''
  };

  // Constructor con los servicios necesarios
  constructor(private carritoService: CarritoService,
              private productoService: ProductoService,
              private comunService: ComunService) {
  }

  // AL cargar la página, obtenemos el carrito y los productos asociados
  ngOnInit() {
    console.log(this.comunService.getUsuarioAutorizado());

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

  // Metdo para obtener la cantidad de cada producto haciendo un filtro
  obtenerCantidadProducto(idProducto: number): number {
    const item = this.itemsEnCarrito.find(i => i.idProducto === idProducto);
    return item?.cantidad ?? 0;
  }

  // funcion para obtener el precio total por la cantidad de un producto
  obtenerPrecioTotalPorCantidadProducto(idProducto: number): number {
    const producto = this.productosEnCarrito.find(p => p.id === idProducto);
    const cantidad = this.obtenerCantidadProducto(idProducto);
    return producto ? producto.precio! * cantidad : 0;
  }

  // Metodo para finalizar la compra
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

  cambiarVista(tipo: 'carta' | 'lista') {
    this.vistaActual = tipo;
  }

  // Sumar un producto al carrito
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
        });
      }
    });
  }

  // Funcion para hacer la cuenta total
  calcularTotal(): number {
    let total = 0;
    for (const producto of this.productosEnCarrito) {
      const cantidad = this.obtenerCantidadProducto(producto.id!);
      total += producto.precio! * cantidad;
    }
    return total;
  }

  // metodo para eliminar un item del carrito
  quitarItem(idProducto: number) {


    this.item = {idCarrito: this.carrito?.id, idProducto: idProducto};

    if (this.item) {
      this.carritoService.quitarItem(this.item).subscribe({
        next: (data) => {
          console.log('Item eliminado:', data);
          this.ngOnInit();
          this.window.location.reload();
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

  // Confirmaciones para el usuario con Swal antes de eliminar o comprar
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
    this.mostrarModalPago = true;
    this.pasoActual = 1;
  }

  siguientePaso() {
    if (this.pasoActual < 3) {
      this.pasoActual++;
    }
  }

  pasoAnterior() {
    if (this.pasoActual > 1) {
      this.pasoActual--;
    }
  }

  procesarPago(metodoPago: string) {
    this.pasoActual = 3;
    this.pagoEnProceso = true;

    setTimeout(() => {
      this.pagoEnProceso = false;
      this.mostrarModalPago = false;
      this.pasoActual = 1;

      Swal.fire({
        title: '¡Pago procesado con éxito!',
        text: `Pago realizado con ${metodoPago}. Gracias por su compra.`,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#16a34a'
      }).then(() => {
        this.finalizarCompra();
      });
    }, 3000);
  }

  cerrarModalPago() {
    this.mostrarModalPago = false;
    this.pasoActual = 1;
    this.limpiarDatos();
  }

  limpiarDatos() {
    this.datosFacturacion = {
      nombre: '',
      apellidos: '',
      email: '',
      telefono: '',
      direccion: '',
      ciudad: '',
      codigoPostal: '',
      pais: 'España'
    };
    this.datosTarjeta = {
      numero: '',
      titular: '',
      expiracion: '',
      cvv: ''
    };
  }

}
