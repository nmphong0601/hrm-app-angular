import {Component} from '@angular/core';
import {UserService} from '../../services/user/user.service';
import {User} from '../../services/user/user.model';
import {Helper} from '../../services/helper';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  providers: [UserService]
})
export class MainComponent {


  appName = 'HRM App';
  appVersion = '9.0';
  authenticated  = false;
  public user = new User();

  constructor(private userService: UserService) {
    this.userService.authenticate().subscribe((res: any) =>{
      let user = new User(res);
      this.checkUser(user);
    });
  }

  checkUser(res: User) {
    if (!Helper.isEmpty(res.token)) {
      this.authenticated = true;
      this.user = res;
    }
  }

}
