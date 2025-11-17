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
    loadComponent: () => import('./detalles-producto/detalles-producto').then((m)=> m.DetallesProducto),
  },
  {
    path: 'carrito',
    loadComponent: () => import('./carrito/carrito').then((m)=> m.Carrito),
  },
  {
    path: 'productos/:id', component: DetallesProducto
},
{path: '**', redirectTo: 'productos'}

];
