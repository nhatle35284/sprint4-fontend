import {Component, OnInit} from '@angular/core';
import {Cart} from '../../model/Cart.class';
import {CartService} from '../../service/cart.service';
import {AuthenticationService} from '../../../app-common/service/auth/authentication.service';
import {TokenStorageService} from '../../../app-common/service/token-storage/token-storage.service';
import {MatDialog} from '@angular/material/dialog';
import {UserDeleteComponent} from '../../../admin/component/user-delete/user-delete.component';
import {DeleteGoodCartComponent} from '../delete-good-cart/delete-good-cart.component';
import {GoodsService} from '../../service/goods.service';
import {Title} from '@angular/platform-browser';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  public carts: Cart[] = [];
  public goodsCart: Cart;
  public listGoodsCart: Cart[] = [];
  public cart: Cart;
  private number: number;
  public len: number;
  public isLoggedIn = false;
  public subTotal = 0;
  public idUser = this.number;
  public message: string;

  constructor(
    private dialog: MatDialog,
    public cartService: CartService,
    public goodService: GoodsService,
    private authenticationService: AuthenticationService,
    private tokenStorageService: TokenStorageService,
    private title: Title,
    private toarst: ToastrService,
  ) {
  }

  ngOnInit(): void {
    this.title.setTitle('Giỏ hàng');
    window.scrollTo(0, 0);
    this.len = 0;
    this.subTotal = 0;
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      this.idUser = this.tokenStorageService.getUser().id;
      console.log(this.idUser);
    }
    if (this.tokenStorageService.getUser() != null) {
      console.log('oke r');
      this.cartService.getAllCartByUser(this.idUser).subscribe(data => {
        this.carts = data;
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.carts.length; i++) {
          this.carts[i].total = String(Number(this.carts[i].quantity) * Number(this.carts[i].price));
          this.subTotal += Number(this.carts[i].total);
        }
      });
    } else {
      //  vãng lai
      this.cartService.getCartSession().subscribe(next => {
        this.carts = next;
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.carts.length; i++) {
          this.carts[i].idCart = this.carts[i].idGood;
          this.carts[i].total = String(Number(this.carts[i].quantity) * Number(this.carts[i].price));
          this.subTotal += Number(this.carts[i].total);
        }
        console.log(this.carts);
        if (this.carts == null) {
          this.carts = [];
        }
      });
    }
  }

  plusQuantity(quantity, idCart): void {
    if (this.tokenStorageService.getUser() != null) {
      this.cartService.getCart(idCart).subscribe(data => {
        console.log(data);
        this.goodService.getByID(data.idGood).subscribe(good => {
          console.log(good.quantity);
          if (Number(data.quantity) + 1 > Number(good.quantity)) {
            this.message = 'Hết hàng';
            setInterval(() => {
              this.message = '';
            }, 5000);
          } else {
            this.message = '';
            this.number = Number(data.quantity) + 1;
            data.quantity = String(this.number);
            this.cart = data;
            this.cartService.update(idCart, this.cart).subscribe(dataPlus => {
              this.cartService.getAllCartByUser(this.idUser).subscribe(dataList => {
                this.carts = dataList;
                this.subTotal = 0;
                // tslint:disable-next-line:prefer-for-of
                for (let i = 0; i < this.carts.length; i++) {
                  this.carts[i].total = String(Number(this.carts[i].quantity) * Number(this.carts[i].price));
                  this.subTotal += Number(this.carts[i].total);
                }
              });
              // tslint:disable-next-line:no-shadowed-variable
            }, error => {
            });
          }
        });
        // tslint:disable-next-line:no-shadowed-variable
      }, error => {
      });
    } else {
      this.goodService.getByID(idCart).subscribe(dataGood => {
        console.log('oke');
        this.goodsCart = new Cart();
        this.goodsCart.idGood = idCart;
        // this.goodsCart.quantity = String(1);
        this.goodsCart.price = dataGood.price;
        this.goodsCart.image = dataGood.image;
        this.goodsCart.idUser = null;
        this.listGoodsCart.push(this.goodsCart);
        console.log(this.listGoodsCart);
        this.cartService.addCartSession(this.goodsCart).subscribe(data => {
          console.log('oke');
          // this.toarst.success('Đã thêm sản phẩm vào giỏ hàng', 'Thành Công');
        }, error => {
        }, () => {
          this.toarst.success('Đã thêm sản phẩm vào giỏ hàng', 'Thành Công');
          //  vãng lai
          this.cartService.getCartSession().subscribe(next => {
            this.carts = next;
            this.subTotal = 0;
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < this.carts.length; i++) {
              this.carts[i].idCart = this.carts[i].idGood;
              this.carts[i].total = String(Number(this.carts[i].quantity) * Number(this.carts[i].price));
              this.subTotal += Number(this.carts[i].total);
            }
            console.log(this.carts);
            if (this.carts == null) {
              this.carts = [];
            }
          });
        });
      });
    }
  }

  openDialogDelete(id): void {
    if (this.tokenStorageService.getUser() != null) {
      this.cartService.getCart(id).subscribe(data => {
        const dialogRef = this.dialog.open(DeleteGoodCartComponent, {
          width: '500px',
          data: {data1: data},
          disableClose: true
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          this.ngOnInit();
        });
      });
    } else {
      console.log('nônnn');
      // this.cartService.getCart(id).subscribe(data => {
      const dialogRef = this.dialog.open(DeleteGoodCartComponent, {
        width: '500px',
        data: {data1: id},
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.ngOnInit();
      });
      // });
    }
  }

  subQuantity(quantity, idCart): void {
    if (this.tokenStorageService.getUser() != null) {
      if (quantity == 1) {
        this.openDialogDelete(idCart);
      } else {
        this.cartService.getCart(idCart).subscribe(data => {
          this.number = Number(data.quantity) - 1;
          data.quantity = String(this.number);
          this.cart = data;
          this.cartService.update(idCart, this.cart).subscribe(dataPlus => {
            this.cartService.getAllCartByUser(this.idUser).subscribe(dataList => {
              this.carts = dataList;
              this.subTotal = 0;
              // tslint:disable-next-line:prefer-for-of
              for (let i = 0; i < this.carts.length; i++) {
                this.carts[i].total = String(Number(this.carts[i].quantity) * Number(this.carts[i].price));
                this.subTotal += Number(this.carts[i].total);
              }
            });
            // tslint:disable-next-line:no-shadowed-variable
          }, error => {
          });
          // tslint:disable-next-line:no-shadowed-variable
        }, error => {
        });
      }
    } else {
      if (quantity == 1) {
        this.openDialogDelete(idCart);
      } else {
        this.goodService.getByID(idCart).subscribe(dataGood => {
          console.log('oke');
          this.goodsCart = new Cart();
          this.goodsCart.idGood = idCart;
          this.goodsCart.quantity = String(Number(quantity) - 1);
          this.goodsCart.price = dataGood.price;
          this.goodsCart.image = dataGood.image;
          this.goodsCart.idUser = null;
          this.listGoodsCart.push(this.goodsCart);
          console.log(this.listGoodsCart);
          this.cartService.updateCartSession(this.goodsCart).subscribe(data => {
            console.log('trừ');
            // this.toarst.success('Đã thêm sản phẩm vào giỏ hàng', 'Thành Công');
          }, error => {
          }, () => {
            this.toarst.success('Đã thêm sản phẩm vào giỏ hàng', 'Thành Công');
            //  vãng lai
            this.cartService.getCartSession().subscribe(next => {
              this.carts = next;
              this.subTotal = 0;
              // tslint:disable-next-line:prefer-for-of
              for (let i = 0; i < this.carts.length; i++) {
                this.carts[i].idCart = this.carts[i].idGood;
                this.carts[i].total = String(Number(this.carts[i].quantity) * Number(this.carts[i].price));
                this.subTotal += Number(this.carts[i].total);
              }
              console.log(this.carts);
              if (this.carts == null) {
                this.carts = [];
              }
            });
          });
        });
      }
    }
  }

  updateQuantity(quantity, idCart): void {
    console.log(quantity);
    if (this.tokenStorageService.getUser() != null) {
      if (quantity < 1) {
        this.openDialogDelete(idCart);
      } else {
        this.cartService.getCart(idCart).subscribe(data => {
          this.goodService.getByID(data.idGood).subscribe(good => {
            if (quantity > Number(good.quantity)) {
              this.message = 'hết hàng';
              setInterval(() => {
                this.message = '';
              }, 5000);
            } else {
              this.message = '';
              data.quantity = quantity;
              this.cart = data;
              this.cartService.update(idCart, this.cart).subscribe(dataPlus => {
                this.cartService.getAllCartByUser(this.idUser).subscribe(dataList => {
                  this.carts = dataList;
                  this.subTotal = 0;
                  // tslint:disable-next-line:prefer-for-of
                  for (let i = 0; i < this.carts.length; i++) {
                    this.carts[i].total = String(Number(this.carts[i].quantity) * Number(this.carts[i].price));
                    this.subTotal += Number(this.carts[i].total);
                  }
                });
                // tslint:disable-next-line:no-shadowed-variable
              }, error => {
              });
            }
          });
          // tslint:disable-next-line:no-shadowed-variable
        }, error => {
        });
      }
    } else {
      if (quantity < 1) {
        this.openDialogDelete(idCart);
      } else {
        this.goodService.getByID(idCart).subscribe(dataGood => {
          console.log('oke');
          this.goodsCart = new Cart();
          this.goodsCart.idGood = idCart;
          this.goodsCart.quantity = quantity;
          this.goodsCart.price = dataGood.price;
          this.goodsCart.image = dataGood.image;
          this.goodsCart.idUser = null;
          this.listGoodsCart.push(this.goodsCart);
          console.log(this.listGoodsCart);
          this.cartService.updateCartSession(this.goodsCart).subscribe(data => {
            console.log('trừ');
            // this.toarst.success('Đã thêm sản phẩm vào giỏ hàng', 'Thành Công');
          }, error => {
          }, () => {
            this.toarst.success('Đã thêm sản phẩm vào giỏ hàng', 'Thành Công');
            //  vãng lai
            this.cartService.getCartSession().subscribe(next => {
              this.carts = next;
              this.subTotal = 0;
              // tslint:disable-next-line:prefer-for-of
              for (let i = 0; i < this.carts.length; i++) {
                this.carts[i].idCart = this.carts[i].idGood;
                this.carts[i].total = String(Number(this.carts[i].quantity) * Number(this.carts[i].price));
                this.subTotal += Number(this.carts[i].total);
              }
              console.log(this.carts);
              if (this.carts == null) {
                this.carts = [];
              }
            });
          });
        });
      }
    }
  }
}
