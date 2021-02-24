import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {TranslateService} from './services/translation/translate.service';
import { UserService } from './services/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ TranslateService ]
})
export class AppComponent implements OnInit, OnDestroy {
  public translatedText: string = '';
  public supportedLanguages: any[] = [];

  constructor(private _translate: TranslateService) {
  }

  ngOnInit() {
    this.supportedLanguages = [
      { display: 'English', value: 'en'},
      { display: 'Nederlands', value: 'nl'},
    ];

    // Default language setting on initial load
    this.selectLang('en');
  }

  ngOnDestroy(){
    
  }

  isCurrentLang(lang: string) {
    return lang === this._translate.currentLang;
  }

  selectLang(lang: string) {
    this._translate.use(lang);
    // this.refreshText();
  }

  refreshText() {
    this.translatedText = this._translate.instant('hello world');
  }
}
