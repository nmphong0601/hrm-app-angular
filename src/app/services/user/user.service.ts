import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpParamsOptions, HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {User} from './user.model';
import {Helper} from '../helper';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import { retry, catchError, map, mergeMap } from 'rxjs/operators';


@Injectable()//https://stackoverflow.com/questions/53571546/angular-7-shared-service-is-not-shared
export class UserService implements OnDestroy {

  private userApiUrl = 'api/users';
  private headers = new HttpHeaders({'Content-Type': 'application/json'});

  // Subjects
  private userInfo = new BehaviorSubject<User>(new User());

  // Announced
  userInfo$ = this.userInfo.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  /**
   * Find a user
   * @param user
   * @returns {Observable<User>}
   */
  findUser(user: User): Observable<any> {
    return this.http.get<any>(this.userApiUrl).pipe(
      map(
        (response: HttpResponse<any>) => {
          let result = this.searchUser(response, user);
          return result;
        }),
      mergeMap((result) => {
        if(result.authenticated == true){
          return this.setToken(result.userInfo);
        }
        return null as any;
      }),
      catchError(Helper.handleError)
    );
  }

  /**
   * Authenticate user
   * @returns {Observable<User>}
   */
  authenticate(): Observable<any> {
    return this.http.get<any>(this.userApiUrl).pipe(
      map(
        (response: HttpResponse<any>) => {
            return this.searchForToken(Helper.extractData(response));
          })
      );
  }

  /**
   * Sign out (clears session storage)
   */
  signOut(): void {
    sessionStorage.clear();
    this.router.navigate(['']);
  }


  /**
   * Search for user token
   * @param data
   * @returns {User}
   */
  private searchForToken(data: any): {} {
    const storedToken = sessionStorage.getItem('hrm-token');
    let user: User = new User();
    if (!Helper.isEmpty(storedToken)) {
      const foundUser: any[]  = data.filter((user: User) => user.token === storedToken);
      user = (!Helper.isEmpty(foundUser[0])) ? foundUser[0] : new User();
    }
    if (Helper.isEmpty(user.token)) {
      this.router.navigate(['']);
    }
    return user;
  }

  /**
   * Set user token in db and localSession
   * @param user
   */
  private setToken(user: User): Observable<any> {
    const token: string  = Helper.generateUUID();
    sessionStorage.setItem('hrm-token', token);
    user.token = token;

    //sessionStorage.setItem('user-info', JSON.stringify(user));

    let url = `${this.userApiUrl}/${user.id}`;
    let options = {headers: this.headers};

    return this.http.put<any>(url, user, options).pipe(
      map((response: HttpResponse<any>)=> {
        return {authenticated: true, userInfo: user}
      }),
      catchError(Helper.handleError)
    );
  }

  /**
   * Search for a user in db
   * @param res
   * @param user
   * @returns {{authenticated: boolean}}
   */
  private searchUser(res: any, user: User): any {
    const userData = Helper.extractData(res);
    const result = {authenticated: false, userInfo: null};
    const foundPersons: any[] = userData.filter(res => res.username === user.username);
    if (user.password === foundPersons[0].password) {
      result.authenticated = true;
      result.userInfo = foundPersons[0];
    }
    return result;
  }

  /**
   * Send object to save to subscribers
   * @param object
   */
  saveUser(object: any) {
    this.userInfo.next(object);
  }

  /**
   * Get object from subcribers
   */
  getUser() {
    // let user = sessionStorage.getItem('user-info');
    // this.saveUser(user?JSON.parse(user):null);
    debugger;
    return this.userInfo.asObservable();
  }

  ngOnDestroy() {
    this.userInfo.unsubscribe();
  }
}
