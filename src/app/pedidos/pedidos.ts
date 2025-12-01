import {Component, OnInit} from '@angular/core';
import {Navbar} from '../navbar/navbar';
import {Carrito} from '../modelos/Carrito';
import {CarritoService} from '../servicios/CarritoService';
import {ProductoService} from '../servicios/ProductoService';
import {Producto} from '../modelos/Producto';
import {Router, RouterLink} from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pedidos',
  imports: [
    Navbar,
  ],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.css',
})
export class Pedidos implements OnInit {

  pedidos: Carrito[] = [];
  productosPorPedido: { [idCarrito: number]: Producto[] } = {};
  totalesPorPedido: { [idCarrito: number]: number } = {};


  constructor(private carritoService: CarritoService, private productoService: ProductoService, private router: Router) {}


  ngOnInit() {
    this.obtenerPedidos();
  }




  obtenerPedidos() {

    this.carritoService.obtenerPedidos().subscribe({
      next: (data: Carrito[]) => {
        this.pedidos = data;
        console.log('Pedidos obtenidos:', this.pedidos);


        const todosIds: number[] = [];
        this.pedidos.forEach(pedido => {
          pedido.items?.forEach(item => {
            if (item.idProducto != null) {
              todosIds.push(item.idProducto);
            }
          });
        });

        if (todosIds.length === 0) return;


        this.productoService.getProductosPorVariosIds(todosIds).subscribe({
          next: (productos: Producto[]) => {
            console.log('Productos obtenidos:', productos);

            this.pedidos.forEach(pedido => {
              this.productosPorPedido[pedido.id!] = [];
              let total = 0; // <--- inicializa total por pedido

              pedido.items?.forEach(item => {
                const producto = productos.find(p => p.id === item.idProducto);
                if (producto) {
                  this.productosPorPedido[pedido.id!].push(producto);


                  total += (producto.precio || 0) * (item.cantidad || 1);
                }
              });

              this.totalesPorPedido[pedido.id!] = total;
            });


            console.log('Productos por pedido:', this.productosPorPedido);
          },
          error: err => console.error('Error al obtener productos:', err)
        });

      },
      error: err => Swal.fire({
        icon: 'error',
        title: 'Error al cargar los pedidos',
        text: err.message || 'Ha ocurrido un error inesperado',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#dc2626'
      }),
      complete: () => console.log('Carga de pedidos completada')
    });
  }

  cancelarPedido(idPedido: number) {
    this.carritoService.cancelarPedido(idPedido).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Pedido cancelado!',
          text: 'El pedido ha sido cancelado exitosamente.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#16a34a'
        });
        this.obtenerPedidos();
      },
      error: err => Swal.fire({
        icon: 'error',
        title: 'Error al cancelar el pedido',
        text: err.message || 'Ha ocurrido un error inesperado',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#dc2626'
      })
    });
  }

  confirmarCancelarPedido(idPedido: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar pedido',
      cancelButtonText: 'No, mantener pedido',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cancelarPedido(idPedido);
      }
    });
  }

  detallesPedido(idPedido: number) {
    this.router.navigate(['/detalles-pedido'], { state: { idPedido } });
  }




}
