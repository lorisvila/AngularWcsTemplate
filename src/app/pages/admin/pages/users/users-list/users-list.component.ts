import {Component} from '@angular/core';
import {WcsGridRowData} from "wcs-core/dist/types/components/grid/grid-interface";
import {AdminUsersService} from "../../../services/admin-users.service";
import {Router} from "@angular/router";
import {DataService} from "../../../../../services/data.service";

@Component({
  selector: 'app-users-element',
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css',
  standalone: false
})
export class UsersListComponent {

  constructor(
    public adminUsersService: AdminUsersService,
    public router: Router,
    public dataService: DataService,
  ) {}

  dateFormatter(createElement: any, _: any, rowData: WcsGridRowData) {
    return createElement('span', {}, new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'medium',
      timeZone: 'Europe/Paris',
    }).format(rowData.data.lastConnect));
  }

}
