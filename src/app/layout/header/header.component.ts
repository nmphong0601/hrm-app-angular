import {Component, Input} from '@angular/core';
import {UserService} from '../../services/user/user.service';
import {User} from '../../services/user/user.model';
import {TranslateService} from '../../services/translation/translate.service';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html'
})
export class HeaderComponent  {

  @Input() appName: string = '';
  @Input() user: User = new User();

  constructor( private userService: UserService, private _translate: TranslateService) {}

  shortAppName() {
    let regExpExecArr = /(\w+)/.exec(this.appName);
    return regExpExecArr != null ? regExpExecArr[1] : null;
  }

  selectLang(lang: string) {
    this._translate.use(lang);
  }
  signOut() {
    this.userService.signOut();
  }
}
