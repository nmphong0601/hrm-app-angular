import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user/user.service';
import {User} from '../../services/user/user.model';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import {FormValidator} from '../../services/form/form-validator';
import {Router} from '@angular/router';
import {TranslateService} from '../../services/translation/translate.service';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  // providers: [UserService]
})
export class SigninComponent implements OnInit {

  public submitted: boolean = false;
  public loading: boolean = false;
  public showWarning: boolean = false;
  public form: FormGroup = this.fb.group( {
    'username': new FormControl(),
    'password': new FormControl()
  });
  username: FormControl = new FormControl();
  password: FormControl = new FormControl();

  constructor(private userService: UserService, private fb: FormBuilder, private router: Router, private _translate: TranslateService) {
    this.createForm();
  }

  ngOnInit() {
    this.userService.userInfo$.subscribe();
  }

  /**
   * Creates the form for the signin screen
   */
  private createForm(): void {
    this.username =  new FormControl('', Validators.compose([Validators.required, FormValidator.mailFormat]));
    this.password = new FormControl('', Validators.required);
    this.form = this.fb.group( {
      'username': this.username,
      'password': this.password
    });
  }

  /**
   * Form validation
   * @param inputField
   * @returns {boolean}
   */
  validateInput(inputField: string): boolean {
    return this.form.controls[inputField].valid || (this.form.controls[inputField].pristine && !this.submitted);
  }

  signIn(account: User, isValid: boolean) {
    this.submitted = true;
    if (isValid) {
      this.userService.findUser(account).subscribe(
        res => {
          this.authenticate(res);
        },
        error => this.authenticate({ authenticated: false}));
    } else {
      FormValidator.clearFormValues(this.form);
    }

  }

  /**
   * Authentication action response
   */
  private authenticate(res: any): void {
    this.userService.saveUser(res.user);

    if (res.authenticated) {
      this.router.navigate(['/secure']);
    } else {
      this.showWarning = true;
      setTimeout(() => {
        this.createForm();
        this.submitted = false;
        this.showWarning = false;
      }, 2500);
    }
  }

  selectLang(lang: string) {
    this._translate.use(lang);
  }


}
