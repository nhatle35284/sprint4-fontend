import {Component, OnInit} from '@angular/core';
import {Goods} from '../../../shopping/model/Goods.class';
import {Cart} from '../../../shopping/model/Cart.class';
import {GoodsService} from '../../../shopping/service/goods.service';
import {ToastrService} from 'ngx-toastr';
import {CartService} from '../../../shopping/service/cart.service';
import {FormBuilder} from '@angular/forms';
import {AuthenticationService} from '../../service/auth/authentication.service';
import {TokenStorageService} from '../../service/token-storage/token-storage.service';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  public goods: Goods[] = [];
  public carts: Cart[] = [];
  public listGoodsCart: Cart[] = [];
  public goodsCart: Cart;
  // tslint:disable-next-line:new-parens
  public cart = new Cart;
  public idUser: number;
  public number: number;
  public key = 0;
  public isLoggedIn = false;
  p: any;
  role: string;
  public products = JSON.parse(localStorage.getItem('products'));

  constructor(
    private goodsService: GoodsService,
    private toarst: ToastrService,
    private cartService: CartService,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private tokenStorageService: TokenStorageService,
    private title: Title
  ) {
  }

  ngOnInit(): void {
    this.title.setTitle('Trang chủ');
    localStorage.setItem(String(this.key), 'fjgbf');
    this.key++;
    window.scrollTo(0, 0);
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      this.idUser = this.tokenStorageService.getUser().id;
      this.role = this.tokenStorageService.getUser().role[0];
      console.log(this.idUser);
    }
    if (this.tokenStorageService.getUser() != null) {
      this.cartService.getAllCartByUser(this.idUser).subscribe(data => {
        this.carts = data;
        console.log(this.carts);
        // tslint:disable-next-line:no-shadowed-variable
      }, error => {
      });
    } else {
      this.cartService.getCartSession().subscribe(data => {
        this.carts = data;
        console.log(this.carts);
        // tslint:disable-next-line:no-shadowed-variable
      }, error => {
      });
    }
    this.goodsService.getAllGoods().subscribe(data => {
      this.goods = data;
      console.log(this.goods);
      if (this.carts == null) {
        this.carts = [];
      }
      // tslint:disable-next-line:no-shadowed-variable
    }, error => {
    });
    console.log(localStorage.getItem('products'));
  }

  checkDuplicate(idGood): boolean {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.carts.length; i++) {
      if (this.carts[i].idGood == idGood) {
        return false;
      }
    }
    return true;
  }

  addGoods(idGood) {
    if (this.tokenStorageService.getUser() == null) {
      if (this.checkDuplicate(idGood)) {
        this.goodsService.getByID(idGood).subscribe(dataGood => {
          console.log('oke');
          this.goodsCart = new Cart();
          this.goodsCart.idGood = idGood;
          this.goodsCart.quantity = String(1);
          this.goodsCart.goodsName = dataGood.goodsName;
          this.goodsCart.price = dataGood.price;
          this.goodsCart.image = dataGood.image;
          this.goodsCart.idUser = null;
          this.listGoodsCart.push(this.goodsCart);
          console.log(this.listGoodsCart);
          this.cartService.addCartSession(this.goodsCart).subscribe(data => {
            console.log('oke');
            this.carts.push(this.goodsCart);
            this.toarst.success('Đã thêm sản phẩm vào giỏ hàng', 'Thành Công');
          });
        });
      } else {
        this.goodsService.getByID(idGood).subscribe(dataGood => {
          console.log('oke');
          this.goodsCart = new Cart();
          this.goodsCart.idGood = idGood;
          // this.goodsCart.quantity = String(1);
          this.goodsCart.price = dataGood.price;
          this.goodsCart.image = dataGood.image;
          this.goodsCart.idUser = null;
          this.listGoodsCart.push(this.goodsCart);
          console.log(this.listGoodsCart);
          this.cartService.addCartSession(this.goodsCart).subscribe(data => {
            console.log('oke');
            this.toarst.success('Đã thêm sản phẩm vào giỏ hàng', 'Thành Công');
          });
        });
      }
    } else {
      console.log(idGood);
      // tslint:disable-next-line:prefer-for-of
      if (this.checkDuplicate(idGood)) {
        console.log('this.cart.idGood');
        console.log(this.cart.idGood);
        // console.log(this.cart.goods.idGood);
        this.cart.idGood = idGood;
        console.log(this.cart.idGood);
        this.cart.idUser = this.idUser;
        // console.log(this.cart.goods.idGood);
        this.cartService.save(this.cart).subscribe(dataPlus => {
          // tslint:disable-next-line:no-shadowed-variable
        }, error => {
        });
        this.toarst.success('Đã thêm sản phẩm vào giỏ hàng', 'Thành Công');
        this.cartService.getAllCartByUser(this.idUser).subscribe(data => {
          this.carts = data;
          console.log(this.carts);
          // tslint:disable-next-line:no-shadowed-variable
        }, error => {
        });

      } else {
        this.cartService.getCartByGoods(idGood, this.idUser).subscribe(data => {
          // this.cart = data;
          // console.log(this.cart.idCart);
          // console.log(this.cart);
          this.number = Number(data.quantity) + 1;
          data.quantity = String(this.number);
          // this.cart.quantity = String(Number(this.cart.quantity) + 1);
          this.cartService.update(data.idCart, data).subscribe(dataPlus => {
            // tslint:disable-next-line:no-shadowed-variable
          }, error => {
          });
        });
        this.toarst.success('Đã thêm sản phẩm vào giỏ hàng', 'Thành Công');
        this.cartService.getAllCartByUser(this.idUser).subscribe(data => {
          this.carts = data;
          console.log(this.carts);
          // tslint:disable-next-line:no-shadowed-variable
        }, error => {
        });
      }
    }
  }
}
