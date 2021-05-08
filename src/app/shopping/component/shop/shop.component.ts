import {Component, OnInit} from '@angular/core';
import {Goods} from '../../model/Goods.class';
import {GoodsService} from '../../service/goods.service';
import {error} from '@angular/compiler/src/util';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CartService} from '../../service/cart.service';
import {Cart} from '../../model/Cart.class';
import {AuthenticationService} from '../../../app-common/service/auth/authentication.service';
import {TokenStorageService} from '../../../app-common/service/token-storage/token-storage.service';
import {ToastrService} from 'ngx-toastr';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  public goods: Goods[] = [];
  public goodsCart: Cart;
  formSearch: FormGroup;
  // tslint:disable-next-line:new-parens
  public cart = new Cart;
  public number: number;
  public idUser: number;
  public carts: Cart[] = [];
  public isLoggedIn = false;
  public name: string;
  public listGoodsCart: Cart[] = [];
  public role: string;

  constructor(
    private goodsService: GoodsService,
    private toarst: ToastrService,
    private cartService: CartService,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private tokenStorageService: TokenStorageService,
    private title: Title,
  ) {
  }

  ngOnInit(): void {
    this.title.setTitle('Cửa hàng');
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
        if (data == null) {
          this.carts = [];
        }
        console.log(this.carts);
        // tslint:disable-next-line:no-shadowed-variable
      }, error => {
      });
    } else {
      this.cartService.getCartSession().subscribe(next => {
        this.carts = next;
        // tslint:disable-next-line:prefer-for-of
        console.log(this.carts);
        if (this.carts == null) {
          this.carts = [];
        }
      });
    }
    this.goodsService.getAllGoods().subscribe(data => {
      this.goods = data;
      console.log(this.goods);
      // tslint:disable-next-line:no-shadowed-variable
    }, error => {
    });
    this.formSearch = this.formBuilder.group({
      keySearch: [''],
      // roomNameSearch: [''],
      // statusSearch: ['']
    });
  }

  // shakingEffect(): void {
  //   const element = document.querySelector('.animatebutton');
  //   element.classList.add('animated', 'shake');
  //   setTimeout(() => {
  //     element.classList.remove('shake');
  //   }, 1500);
  // }
  onSearch(): void {
    console.log(this.formSearch.value.keySearch);
    this.name = this.formSearch.value.keySearch;
    // tslint:disable-next-line:max-line-length
    this.goodsService.search(this.name).subscribe(data => {
      this.goods = data;
      // tslint:disable-next-line:no-shadowed-variable
    }, error => console.log(error));
  }

  addGoods(idGood) {
    // this.shakingEffect();
    console.log(this.checkDuplicate(idGood));
    // tslint:disable-next-line:prefer-for-of
    if (this.checkDuplicate(idGood)) {
      if (this.idUser != null) {
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
        }, () => {
          this.toarst.success('Đã thêm sản phẩm vào giỏ hàng', 'Thành Công');
          this.carts.push(this.cart);
        });
        // this.ngOnInit();
      } else {
//  vãng lai
//         this.shakingEffect();
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
      }
    } else {
      if (this.tokenStorageService.getUser() != null) {
        this.cartService.getCartByGoods(idGood, this.idUser).subscribe(data => {
          this.goodsService.getByID(data.idGood).subscribe(good => {
            if (Number(good.quantity) < Number(data.quantity) + 1) {
              this.toarst.error('Không đủ hàng', 'Thất bại');
            } else {
              this.number = Number(data.quantity) + 1;
              console.log(this.number);
              data.quantity = String(this.number);
              console.log(data.quantity);
              this.cartService.update(data.idCart, data).subscribe(dataPlus => {
                // tslint:disable-next-line:no-shadowed-variable
              }, error => {
              }, () => {
                this.toarst.success('Đã thêm sản phẩm vào giỏ hàng', 'Thành Công');
              });
            }
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
    }
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

}
