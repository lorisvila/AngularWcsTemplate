import { Component } from '@angular/core';
import {AuthService} from "../../../../services/auth.service";
import {Router} from "@angular/router";
import {DataService} from "../../../../services/data.service";

@Component({
  selector: 'app-tableau-bord',
  standalone: false,
  templateUrl: './tableau-bord.component.html',
  styleUrl: './tableau-bord.component.css'
})
export class TableauBordComponent {

  constructor(
    public authService: AuthService,
    public dataService: DataService,
    public router: Router,
  ) {
  }

}
