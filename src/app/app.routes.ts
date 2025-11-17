import { Routes } from '@angular/router';
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
    loadComponent: () => import('./productos/productos.component').then((m) => m.ProductosComponent),
  },
  {
    path: 'detalles-producto',
    loadComponent: () => import('./detalles-producto/detalles-producto').then((m)=> m.DetallesProducto),
  },
  {
    path: 'navbar',
    loadComponent:() => import('./navbar/navbar').then((m) => m.Navbar),
  },
  {
    path: 'registro',
    loadComponent:() => import('./registro/registro.component').then((m) => m.RegistroComponent),
  },
  {
    path: 'inicio-sesion',
    loadComponent:() => import('./inicio-sesion/inicio-sesion.component').then((m) => m.InicioSesionComponent),
  },
  {path: 'productos/:id', component: DetallesProducto}
];
