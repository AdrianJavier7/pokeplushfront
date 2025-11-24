import {Component, OnInit} from '@angular/core';
import {Navbar} from '../navbar/navbar';
import {Carrito} from '../modelos/Carrito';
import {CarritoService} from '../servicios/CarritoService';
import {ProductoService} from '../servicios/ProductoService';
import {Producto} from '../modelos/Producto';

@Component({
  selector: 'app-pedidos',
  imports: [
    Navbar
  ],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.css',
})
export class Pedidos implements OnInit {

  pedidos: Carrito[] = [];
  productosPorPedido: { [idCarrito: number]: Producto[] } = {};
  totalesPorPedido: { [idCarrito: number]: number } = {};


  constructor(private carritoService: CarritoService, private productoService: ProductoService) {}


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
      error: err => console.error('Error al obtener pedidos:', err),
      complete: () => console.log('Carga de pedidos completada')
    });
  }





}
