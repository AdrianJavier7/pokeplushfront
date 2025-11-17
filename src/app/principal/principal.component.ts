import { Component } from '@angular/core';
import {Navbar} from '../navbar/navbar';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-principal',
  imports: [
    Navbar
  ],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent {

}
