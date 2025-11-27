import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {LoginService} from '../servicios/login.service';
import {PerfilService} from '../servicios/perfil.service';
import {Subscription} from 'rxjs';
import {Usuario} from '../modelos/Usuario';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit, OnDestroy {
  isAuthenticated = false;
  usuario?: Usuario;
  private subs = new Subscription();

  constructor(private loginService: LoginService, private perfilService: PerfilService, private router: Router) {}

  ngOnInit(): void {
    this.subs.add(
      this.perfilService.usuario$.subscribe(u => {
        this.usuario = u;
      })
    );

    this.subs.add(
      this.loginService.authState$.subscribe(auth => {
        this.isAuthenticated = auth;
        if (auth) {
          this.subs.add(
            this.perfilService.getMiPerfil().subscribe({
              next: () => {},
              error: () => { this.perfilService.setUsuario(undefined); }
            })
          );
        } else {
          this.perfilService.setUsuario(undefined);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  irPerfil(): void {
    this.router.navigate(['/perfil']);
  }
}
