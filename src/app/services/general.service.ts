import {Injectable} from '@angular/core';
import {DataService} from "./data.service";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(
    public dataService: DataService,
    public notif: ToastrService,
  ) {}

  //Variables des versions et dates de mise à jour
  app_version: string = "v1"; //TODO : Setup a versionning
  app_build: string = "0.1";

  date_maj_applicatif: Date = new Date(2025, 2, 27);
  date_maj_applicatif_string: string = this.date_maj_applicatif.toLocaleDateString('fr-FR');

  appName: string = "AppWeb"

  //############### App ###############

  // Function to open a link in new tab if there is a need to customise the way to open a link (example: do not open new windows with eletron / neutralinojs)
  openURL(URL: string, target: string = '_blank') {
    window.open(URL, target)
  }

}
