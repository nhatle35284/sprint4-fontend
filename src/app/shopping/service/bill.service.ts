import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  public API = 'http://localhost:8080/bill';
  constructor(public http: HttpClient) { }
  createBill(idUser): Observable<any> {
    return this.http.get(this.API + '/create/' + idUser);
  }
  getAllBill(): Observable<any> {
    return this.http.get(this.API + '/list');
  }
}
