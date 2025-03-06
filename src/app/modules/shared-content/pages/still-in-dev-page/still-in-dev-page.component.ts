import { Component } from '@angular/core';
import {GeneralService} from "../../../../services/general.service";

@Component({
    selector: 'app-still-in-dev-page',
    templateUrl: './still-in-dev-page.component.html',
    styleUrls: ['./still-in-dev-page.component.css'],
    standalone: false
})
export class StillInDevPageComponent {

  constructor(
    public generalService: GeneralService,
  ) {
  }

}
