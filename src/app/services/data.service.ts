import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

//Class containing the data values for the offline mode
export class DataService {

  appRoutes = {
    Accueil: ['Accueil'],
    Admin: {
      Login: ['Admin', 'Login'],
      TableauDeBord: ['Admin', 'TableauDeBord'],
      Utilisateur: {
        Liste: ['Admin', 'Utilisateur', 'Liste'],
        Ajouter: ['Admin', 'Utilisateur', 'Ajouter'],
        Editer: ['Admin', 'Utilisateur', 'Editer'],
      }
    }
  }

}
