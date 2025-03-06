import {Component, Input} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {WcsAngularModule} from "wcs-angular";

@Component({
  selector: 'app-flat-card',
  templateUrl: './flat-card.component.html',
  styleUrl: './flat-card.component.css',
  standalone: false,
  animations: [
    trigger('slideInOut', [
      state('expanded', style({
        height: '*',
        opacity: 1,
        visibility: 'visible'
      })),
      state('collapsed', style({
        height: '0px',
        opacity: 0,
        visibility: 'hidden'
      })),
      transition('expanded <=> collapsed', animate('300ms ease-in-out'))
    ])
  ]
})
export class FlatCardComponent {

  @Input() title!: string
  @Input() icon?: string
  @Input() showToggleButton?: boolean = true;
  @Input() showCard: boolean = true;
  @Input() allowToggle: boolean = true;

  toggleShowCard() {
    this.showCard = this.allowToggle ? !this.showCard : this.showCard;
  }

}
