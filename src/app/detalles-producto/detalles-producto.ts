import {Component, OnInit} from '@angular/core';
import {Producto} from '../modelos/Producto';
import {ProductoService} from '../servicios/ProductoService';
import {ActivatedRoute, RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-detalles-producto',
  templateUrl: './detalles-producto.html',
  imports: [CommonModule,
  ]
})
export class DetallesProducto implements OnInit {
  producto!: Producto;

  constructor(private route: ActivatedRoute,
              private productoService: ProductoService) {}


  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.productoService.getProductoPorId(id).subscribe(data => {this.producto = data});
  }
}
