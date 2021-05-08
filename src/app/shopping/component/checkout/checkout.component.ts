import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {CartService} from '../../service/cart.service';
import {AuthenticationService} from '../../../app-common/service/auth/authentication.service';
import {TokenStorageService} from '../../../app-common/service/token-storage/token-storage.service';
import {Cart} from '../../model/Cart.class';
import {BillService} from '../../service/bill.service';
import {ToastrService} from 'ngx-toastr';
import {UserDeleteComponent} from '../../../admin/component/user-delete/user-delete.component';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ConfirmComponent} from '../confirm/confirm.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  public isLoggedIn = false;
  public idUser: number;
  public carts: Cart[] = [];
  public subTotal: number;
  public formCheckout: FormGroup;
  public check = false;


  constructor(
    public cartService: CartService,
    public billService: BillService,
    private dialog: MatDialog,
    private authenticationService: AuthenticationService,
    private tokenStorageService: TokenStorageService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    public router: Router,
    public title: Title,
  ) {
  }

  @ViewChild('paypalRef', {static: true}) private paypalRef: ElementRef;

  ngOnInit(): void {
    this.title.setTitle('Thanh toán');
    window.scrollTo(0, 0);
    this.subTotal = 0;
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      this.idUser = this.tokenStorageService.getUser().id;
      console.log(this.idUser);
    }
    if (this.tokenStorageService.getUser() != null) {
      this.cartService.getAllCartByUser(this.idUser).subscribe(data => {
        this.carts = data;
        console.log(this.carts);
        if (this.carts.length == 0) {
          this.subTotal = 0;
        } else {
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.carts.length; i++) {
            this.carts[i].total = String(Number(this.carts[i].quantity) * Number(this.carts[i].price));
            this.subTotal += Number(this.carts[i].total);
          }
          this.subTotal += 50000;
        }
      });
    } else {
      this.cartService.getCartSession().subscribe(next => {
        this.carts = next;
        // tslint:disable-next-line:prefer-for-of
        console.log(this.carts);
        if (this.carts == null) {
          this.carts = [];
        }
        if (this.carts.length == 0) {
          this.subTotal = 0;
        } else {
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.carts.length; i++) {
            this.carts[i].total = String(Number(this.carts[i].quantity) * Number(this.carts[i].price));
            this.subTotal += Number(this.carts[i].total);
          }
          this.subTotal += 50000;
        }
      });
    }
    this.formCheckout = this.formBuilder.group({
      // idUser: [''],
      fullName: ['', Validators.required],
      numberPhone: ['', [Validators.required, Validators.pattern(/^[0-9\-\+]{10}$/)]],
      address: ['', [Validators.required, Validators.maxLength(60), Validators.pattern(/^[a-zA-Zà-ỹÀ-Ỹ_0-9\s]{3,60}$/)]],
      email: ['', [Validators.required, Validators.pattern(/^[a-z][a-z0-9_\.]{3,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/)]],
      note: [''],
    });
    paypal.Buttons(
      {
        style: {
          shape: 'rect',
          color: 'gold',
          layout: 'horizontal',
          label: 'paypal',
          tagline: true,
          height: 50
        },
        createOrder: (data, actions) => {
          // console.log('createOrder');
          // This function sets up the details of the transaction,
          // including the amount and line item details
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: this.subTotal,
                  currency_code: 'USD'
                }
              }
            ]
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then(details => {
            console.log('Transaction completed');
            this.billService.createBill(this.idUser).subscribe(dataFull => {
            }, error => {
            }, () => {
              this.sendMail();
            });
          });
        },
        onError: (data, actions) => {
          console.log('Transaction error');
          // @ts-ignore
          $('#refreshData').click();
        }

      }
    ).render(this.paypalRef.nativeElement);
  }

  sendMail(): void {
    this.cartService.sendMail().subscribe(b => {
    }, error => {
    }, () => {
      this.toastr.success('Checkout Success', 'Successfully');
      this.cartService.updateBill(this.idUser).subscribe(data => {
      }, error => {
      }, () => {
        // this.dialogRef.close();
        this.ngOnInit();
        this.router.navigate([''], {queryParams: {create_msg: 'Create successfully!', si: true}});
      });
    });
  }

  openDialog(): void {
    this.formCheckout.markAllAsTouched();
    console.log(this.formCheckout.valid);
    if (this.formCheckout.valid) {
      // this.userService.getByID(id).subscribe(dataUser => {
      const dialogRef = this.dialog.open(ConfirmComponent, {
        panelClass: 'app-full-bleed-dialog',
        width: '500px',
        // data: {data1: dataUser},
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.ngOnInit();
      });
      // });
    }
  }

  money() {
    this.check = false;
  }

  paypal() {
    this.check = true;
    console.log(this.check);
  }
}
