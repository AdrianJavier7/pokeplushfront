import { Routes } from '@angular/router';
import {adminGuard} from './guard/admin.guard';

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
  {
    path: 'perfil',
    loadComponent: () => import('./perfil/perfil.component').then((m) => m.PerfilComponent),
  },
  {
    path: 'productos-admin',
    loadComponent: () => import('./productos-admin/productos-admin').then((m) => m.ProductosAdmin),
  },
  {
    path: 'crear-producto',
    loadComponent:() => import('./crear-productos/crear-productos').then((m) => m.CrearProductos),
  },
  {
    path: 'editar-producto/:id',
    loadComponent:() => import('./crear-productos/crear-productos').then((m) => m.CrearProductos),
  },
  {
    path: 'administracion',
    loadComponent:() => import('./administracion/administracion.component').then((m) => m.AdministracionComponent),
    canActivate: [adminGuard]
  },
  { path: '**', redirectTo: 'productos' },
];
