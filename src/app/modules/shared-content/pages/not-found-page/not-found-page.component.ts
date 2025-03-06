import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {Location} from "@angular/common";
import {DataService} from "../../../../services/data.service";

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.css'],
  standalone: false
})
export class NotFoundPageComponent {

  constructor(
    public router: Router,
    public location: Location,
    public dataService: DataService
  ) {}

}
