import { Component } from '@angular/core';
import {GeneralService} from "../../services/general.service";
import {DataService} from "../../services/data.service";

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(
    public generalService: GeneralService,
    public dataService: DataService,
  ) {}

}
