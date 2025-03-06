import { Component } from '@angular/core';
import {GeneralService} from "../../services/general.service";
import {Router} from "@angular/router";
import {DataService} from "../../services/data.service";
import {AuthService} from "../../services/auth.service";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: false,
})
export class NavbarComponent {
  // Import the variables and initialise with constructor
  constructor(
    public generalService: GeneralService,
    public dataService: DataService,
    public authService: AuthService,
    public router: Router,
  ) {
  }

}


