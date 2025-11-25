import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'principal',
    loadComponent: () => import('./principal/principal.component').then((m) => m.PrincipalComponent),
  },
  {
    path: '',
    redirectTo: 'principal',
    pathMatch: 'full',
  },
  {
    path: 'productos',
    loadComponent: () => import('./productos/productos.component').then((m) => m.ProductosComponent),
  },
  {
    path: 'detalles-producto',
    loadComponent: () => import('./detalles-producto/detalles-producto').then((m) => m.DetallesProducto),
  },
  {
    path: 'navbar',
    loadComponent:() => import('./navbar/navbar').then((m) => m.Navbar),
  },
  {
    path: 'productos/:id',
    loadComponent: () => import('./detalles-producto/detalles-producto').then((m) => m.DetallesProducto),
  },
  {
    path: 'registro',
    loadComponent:() => import('./registro/registro.component').then((m) => m.RegistroComponent),
  },
  {
    path: 'inicio-sesion',
    loadComponent:() => import('./inicio-sesion/inicio-sesion.component').then((m) => m.InicioSesionComponent),
  },
  {
    path: 'carrito',
    loadComponent: () => import('./carrito/CarritoComponent').then((m) => m.CarritoComponent),
  },
  {
    path: 'pedidos',
    loadComponent: () => import('./pedidos/pedidos').then((m) => m.Pedidos),
  },
  {
    path: 'detalles-pedido',
    loadComponent: () => import('./detalles-pedido/detalles-pedido').then((m) => m.DetallesPedido),
  },
  { path: '**', redirectTo: 'productos' },
];
