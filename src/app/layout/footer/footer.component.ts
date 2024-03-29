import {Component, Input} from '@angular/core';


@Component({
  selector: 'app-footer',
  templateUrl: 'footer.component.html'
})
export class FooterComponent  {
  currentYear = new Date().getFullYear();

  @Input() appVersion: string = '1.0';

}
