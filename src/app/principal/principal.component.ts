import { Component } from '@angular/core';
import {Navbar} from '../navbar/navbar';
import {Footer} from '../footer/footer';

@Component({
  selector: 'app-principal',
  imports: [
    Navbar,
    Footer,

  ],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent {

}
