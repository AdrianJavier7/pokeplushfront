import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {PrincipalComponent} from './principal/principal.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PrincipalComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('untitled');
}
