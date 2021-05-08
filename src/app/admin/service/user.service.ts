import {Inject, Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Data} from '../model/Data';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  imageDetailList: AngularFireList<any>;
  dataSet: Data = {
    url: ''
  };
  public API = 'http://localhost:8080/user';
  constructor(public http: HttpClient,
              @Inject(AngularFireDatabase) private firebase: AngularFireDatabase,
  ) { }
  getAllUser(): Observable<any> {
    return this.http.get(this.API + '/list');
  }
  roleList(): Observable<any> {
    return this.http.get(this.API + '/listRole');
  }
  getByID(idUser): Observable<any> {
    return this.http.get(this.API + '/' + idUser);
  }
  create(user): Observable<any> {
    return this.http.post(this.API + '/create', user);
  }
  edit(user, idUser): Observable<any> {
    return this.http.post(this.API + '/edit/' + idUser, user);
  }
  delete(idUser): Observable<any> {
    return this.http.delete(this.API + '/delete/' + idUser);
  }
  getImageDetailList(): void {
    this.imageDetailList = this.firebase.list('imageDetails');
  }
  insertImageDetails( url): void {
    this.dataSet = {
      url
    };
    this.imageDetailList.push(this.dataSet);
  }
  updateAccountImage(idUser, image): Observable<any> {
    let params = new HttpParams();
    params = params.append('idUser', idUser);
    params = params.append('image', image);
    return this.http.get(this.API + '/change-image', {params});
  }
}
