import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "./services/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: "app.component.html",
  standalone: false,
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  title = 'ld-main';

  constructor(
  ) {}

}
