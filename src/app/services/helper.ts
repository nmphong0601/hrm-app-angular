import { Observable, throwError  } from 'rxjs';
import {  HttpErrorResponse, HttpResponse } from '@angular/common/http';

/**
 * Helper class with some static methods that can be used throughout the project
 */
export class Helper {

  /**
   * Empty check
   * @param val
   * @returns {boolean}
   */
  public static isEmpty(val:any) {
    return (val === undefined || val == null  || val.length <= 0) ? true : false;
  }

  /**
   * Catches errors on http Response and logs to console
   * @param error
   * @returns {any}
   */
  public static handleError(httpError: HttpErrorResponse | any): Observable<any> {
    let errorMessage: string;
    if (httpError instanceof HttpErrorResponse) {
      const body = httpError.error.json() || '';
      const err = body.error || JSON.stringify(body);
      errorMessage = `${httpError.status} - ${httpError.statusText || ''} ${err}`;
    } else {
      errorMessage = httpError.message ? httpError.message : httpError.toString();
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  /**
   * Convenience function to search inArray by object
   * @param object
   * @param array
   * @returns {boolean}
   */
  public static inArray(object: any, array: any[]) {
    return array.indexOf(object) > -1;
  }


  /**
   * Extracts data found by http call
   * @param res
   * @returns {}
   */
  public static extractData(res: HttpResponse<any>): any [] {
    const body = res.body.json();
    return body.data || {};
  }

  /**
   * Generates a unique id
   * @returns {string}
   */
  public static generateUUID (): string {
    let d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      d += performance.now();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  /**
   * Set sort Direction
   * @param a
   * @param b
   * @param descending
   * @returns {boolean}
   */
  public static sortDirection(a: any, b: any, descending: boolean) {
    return (descending) ? a < b : a > b;
  }

}
