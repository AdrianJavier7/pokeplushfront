import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { PerfilService } from '../servicios/perfil.service';
import { map } from 'rxjs/operators';

export const adminGuard: CanActivateFn = (route, state) => {
  const perfilService = inject(PerfilService);
  const router = inject(Router);

  return perfilService.usuario$.pipe(
    map(usuario => {
      if (usuario?.nivel === 'ADMIN') {
        return true;
      }
      router.navigate(['/principal']);
      return false;
    })
  );
};
