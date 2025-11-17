import { Routes } from '@angular/router';
import {ProductosComponent} from './productos/productos.component';
import {DetallesProducto} from './detalles-producto/detalles-producto';

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
    component: ProductosComponent},
  {
    path: 'productos/:id', component: DetallesProducto
  },
  {
    path: 'productos',
    loadComponent: () => import('./productos/productos.component').then((m)=> m.ProductosComponent),
  },
  {
    path: 'registro',
    loadComponent: () => import('./registro/registro.component').then((m)=> m.RegistroComponent),
  },
  {
    path: 'inicio-sesion',
    loadComponent: () => import('./inicio-sesion/inicio-sesion.component').then((m)=> m.InicioSesionComponent),
  }
];
