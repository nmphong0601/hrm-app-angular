import {Injectable, OnDestroy} from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { Employee } from './employee.model';
import {Subject} from 'rxjs';
import {Helper} from '../helper';



@Injectable()
export class EmployeeService implements OnDestroy {

  /**
   * Web api url
   * @type {string}
   */
  private employeeApiUrl = 'api/employees';
  private employeeList = new Subject<any[]>();
  public employeeList$ = this.employeeList.asObservable();
  private headers = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) { }

  /**
   * Returns an Observable of type Employee retrieved via http.get
   *
   */
  getEmployees() {
    return this.http.get(this.employeeApiUrl).pipe(
      map((response:any) => Helper.extractData(response)),
      catchError(Helper.handleError)
    ).subscribe((e:any) => {
      this.employeeList.next(e);
      });
  }

  /**
   * Add an employee by calling http.post
   * @param employee
   * @returns {Observable<Employee>}
   */
  addEmployee(employee: Employee) {
    let options = {headers: this.headers};
    this.http.post(this.employeeApiUrl, employee, options).pipe(
      map((response:any) => Helper.extractData(response)),
      catchError(Helper.handleError)
    ).subscribe(() =>{
      this.getEmployees()
    });
  }

  /**
   * Update an employee by calling http.put
   * @param employee
   */
  updateEmployee(employee: Employee) {
    let url = `${this.employeeApiUrl}/${employee.id}`;
    let options = {headers: this.headers};
    return this.http.put(url, employee, options).pipe(
      catchError(Helper.handleError)
    );
  }

  /**
   * Remove an employee by calling http.delete
   * @param employee
   */
  removeEmployee(employee: Employee) {
    let url = `${this.employeeApiUrl}/${employee.id}`;
    let options = {headers: this.headers};
    return this.http.delete(url, options).pipe(
      catchError(Helper.handleError)
    );
  }

  /**
   * Simulates a search on the server with callback function
   * @param searchKey
   * @param searchValue
   * @returns {Observable<Employee[]>}
   */
  search(searchKey: string, searchValue: any)  {
    (searchKey !== '' && searchValue !== '') ?
       this.http.get(this.employeeApiUrl).pipe(
        map((response:any) => this.searchEmployee(response, searchKey, searchValue)),
        catchError(Helper.handleError)
       ).subscribe((e:any) =>{ 
          this.employeeList.next(e)
        })
     : this.getEmployees();
  }


  /**
   * QuickSort
   * @param array
   * @param key
   * @param descending
   */
  sortObjects (array: any[], key: string, descending: boolean)  {

    for (let i = 0; i < array.length; i++) {
      const currVal = array[i][key];
      const currElem = array[i];
      let j = i - 1;
      while ((j >= 0) && Helper.sortDirection(array[j][key], currVal, descending)) {
        array[j + 1] = array[j];
        j--;
      }
      array[j + 1] = currElem;
    }
    this.employeeList.next(array);
  }


  /**
   * Search employee by giving a key and value (searchKey all iniaties a full scale search on all elements)
   * @param res
   * @param searchKey
   * @param searchValue
   * @returns {Array}
   */
  private searchEmployee(res: any, searchKey: string, searchValue: any): Employee[] {
    const data = Helper.extractData(res);
    const foundValues: any[] = [];
    const regex = new RegExp(searchValue, 'gi');

    data.filter(employee => {
      // search all keys indiscriminately
      if (searchKey === 'all') {
        const keyArr: any[] = Object.keys(employee);
        keyArr.forEach((key: any) => {
          if (employee[key].toString().match(regex) && !Helper.inArray(employee, foundValues)) {
            foundValues.push(employee);
          }
        });
      } else if (employee.hasOwnProperty(searchKey) && employee[searchKey].toLowerCase().match(regex)) {
        foundValues.push(employee);
      }
    });

    return foundValues;
  }

  ngOnDestroy() {
    this.employeeList.subscribe();
  }



}
