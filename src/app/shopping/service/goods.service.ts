import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {Data} from '../../admin/model/Data';

@Injectable({
  providedIn: 'root'
})
export class GoodsService {
  imageDetailList: AngularFireList<any>;
  dataSet: Data = {
    url: ''
  };
  public API = 'http://localhost:8080/goods';
  constructor(public http: HttpClient,
              @Inject(AngularFireDatabase) private firebase: AngularFireDatabase,
  ) { }
  getAllGoods(): Observable<any> {
    return this.http.get(this.API + '/list');
  }
  search(keySearch): Observable<any> {
    let params = new HttpParams();
    params = params.append('value1', keySearch);
    // params = params.append('value2', roomNameSearch);
    // params = params.append('value3', statusSearch);
    return this.http.get(this.API + '/search', {params});
  }
  getByID(idGoods): Observable<any> {
    return this.http.get(this.API + '/' + idGoods);
  }
  delete(idGood): Observable<any> {
    console.log(idGood);
    return this.http.delete(this.API + '/delete/' + idGood);
  }
  edit(goods, idGood): Observable<any> {
    console.log(idGood);
    return this.http.post(this.API + '/edit/' + idGood, goods);
  }
  create(goods): Observable<any> {
    return this.http.post(this.API + '/create' , goods);
  }
  categoryList(): Observable<any> {
    return this.http.get(this.API + '/listCategory');
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
  updateAccountImage(idGood, image): Observable<any> {
    let params = new HttpParams();
    params = params.append('idGood', idGood);
    params = params.append('image', image);
    return this.http.get(this.API + '/change-image', {params});
  }
}
