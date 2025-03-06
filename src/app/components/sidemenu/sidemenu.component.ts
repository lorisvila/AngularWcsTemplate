import { Component } from '@angular/core';
import {GeneralService} from "../../services/general.service";
import {WcsAngularModule} from "wcs-angular";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {DataService} from '../../services/data.service';
@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  standalone: false,
  styleUrls: ['./sidemenu.component.css']
})
export class SidemenuComponent {

  constructor(
    public generalService: GeneralService,
    public dataService: DataService,
  ) {
  }

}
