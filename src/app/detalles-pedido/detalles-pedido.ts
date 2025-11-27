import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {CarritoService} from '../servicios/CarritoService';
import {Carrito} from '../modelos/Carrito';
import {ItemCarrito} from '../modelos/ItemCarrito';
import {ProductoService} from '../servicios/ProductoService';
import {Producto} from '../modelos/Producto';
import {Navbar} from '../navbar/navbar';
import {Footer} from '../footer/footer';

@Component({
  selector: 'app-detalles-pedido',
  imports: [
    Navbar,
    Footer,
    RouterLink
  ],
  templateUrl: './detalles-pedido.html'
})
export class DetallesPedido implements OnInit {
  idPedido: number | null = null;
  carrito: Carrito = {};
  items: ItemCarrito[] = [];
  listaIdProductos: number[] = [];
  productosEnCarrito: Producto[] = [];


  constructor(private route: ActivatedRoute, private carritoService: CarritoService, private productoService: ProductoService,) { }

  ngOnInit() {

    // 1. Obtener el idPedido desde state o desde la URL
    this.idPedido = history.state?.idPedido ?? null;

    if (!this.idPedido) {
      const param = this.route.snapshot.paramMap.get('id');
      this.idPedido = param ? Number(param) : null;
    }

    if (!this.idPedido) {
      console.error("No se recibió idPedido");
      return;
    }

    // 2. Cargar datos del pedido
    this.carritoService.obtenerPedidoActual(this.idPedido).subscribe({
      next: (data) => {
        console.log('Detalles del pedido:', data);

        this.carrito = data;
        this.items = data.items ?? [];

        // 3. Obtener IDs de productos
        this.listaIdProductos = this.items
          .map(item => item.idProducto!)
          .filter(id => id != null);

        // 4. Llamar al servicio de productos
        if (this.listaIdProductos.length > 0) {
          this.productoService.getProductosPorVariosIds(this.listaIdProductos)
            .subscribe({
              next: (productos) => {
                this.productosEnCarrito = productos;
                console.log('Productos en carrito:', productos);
              },
              error: (err) => {
                console.error('Error al obtener productos:', err);
              }
            });
        }

      },
      error: (err) => {
        console.error('Error al obtener detalles del pedido:', err);
      }
    });
  }


  obtenerCantidadProducto(idProducto: number): number {
    const item = this.items.find(i => i.idProducto === idProducto);
    return item?.cantidad ?? 0;
  }

  calcularTotal(): number {
    let total = 0;
    for (const producto of this.productosEnCarrito) {
      const cantidad = this.obtenerCantidadProducto(producto.id!);
      total += producto.precio! * cantidad;
    }
    return total;
  }
}
