import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Cart} from '../model/Cart.class';
import {Data} from '../../admin/model/Data';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  imageDetailList: AngularFireList<any>;
  dataSet: Data = {
    url: ''
  };
  public API = 'http://localhost:8080/cart';
  public API_SESSION = 'http://localhost:8080/session';
  constructor(public http: HttpClient,
              @Inject(AngularFireDatabase) private firebase: AngularFireDatabase,
              ) { }
  getAllCart(): Observable<any> {
    return this.http.get(this.API + '/list');
  }
  getAllCartByUser(idUser): Observable<any> {
    return this.http.get(this.API + '/list/' + idUser);
  }
  getCart(idCart): Observable<any> {
    return this.http.get(this.API + '/' + idCart);
  }
  anonymous(products): Observable<any> {
    return this.http.get(this.API + '/anonymous/' + products);
  }
  delete(idCart): Observable<any> {
    return this.http.delete(this.API + '/delete/' + idCart);
  }
  getCartByGoods(idGoods, idUser): Observable<any> {
    return this.http.get(this.API + '/idGood/' + idGoods + '&&' + idUser);
  }
  update(idCart, cart): Observable<any> {
    return this.http.post(this.API + '/update/' + idCart, cart);
  }
  updateBill(idUser): Observable<any> {
    return this.http.get(this.API + '/updateBill/' + idUser);
  }
  save(cart): Observable<any> {
    return this.http.post(this.API + '/create/', cart);
  }
  sendMail(): Observable<any> {
    return this.http.get(this.API + '/send');
  }
  addCartSession(goodsCart): Observable<any>{
    return this.http.post(this.API_SESSION + '/add', goodsCart);
  }
  updateCartSession(goodsCart): Observable<any>{
    return this.http.post(this.API_SESSION + '/update', goodsCart);
  }
  deleteSession(idGood): Observable<any>{
    return this.http.get(this.API_SESSION + '/delete/' + idGood);
  }
  getCartSession(): Observable<any>{
    return this.http.get<any>(this.API_SESSION);
  }
}
