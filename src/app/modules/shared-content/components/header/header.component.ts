import {Component, Input} from '@angular/core';
import {Location} from "@angular/common";

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  @Input() title!: string;
  @Input() icon?: string;
  @Input() backIcon: boolean = true;

  constructor(
    public location: Location
  ) {
  }

}
