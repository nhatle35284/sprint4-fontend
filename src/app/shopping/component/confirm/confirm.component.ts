import {Component, Inject, OnInit} from '@angular/core';
import {CartService} from '../../service/cart.service';
import {ToastrService} from 'ngx-toastr';
import {BillService} from '../../service/bill.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {GoodsService} from '../../service/goods.service';
import {AuthenticationService} from '../../../app-common/service/auth/authentication.service';
import {TokenStorageService} from '../../../app-common/service/token-storage/token-storage.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {
  public idUser: number;
  public isLoggedIn = false;
  public check = false;
  constructor(
    private dialogRef: MatDialogRef<ConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private goodsService: GoodsService,
    private cartService: CartService,
    private billService: BillService,
    private toastr: ToastrService,
    private authenticationService: AuthenticationService,
    private tokenStorageService: TokenStorageService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      this.idUser = this.tokenStorageService.getUser().id;
      console.log(this.idUser);
    }
  }
  sendMail(): void {
    this.cartService.sendMail().subscribe(b => {
    }, error => {
    }, () => {
      this.toastr.success('Thanh toán thành công', 'Thành công');
      this.cartService.updateBill(this.idUser).subscribe(data => {
      }, error => {
      }, () => {
        this.dialogRef.close();
        this.ngOnInit();
      });
    });
  }

  checkout() {
    this.check = true;
    this.billService.createBill(this.idUser).subscribe(data => {
    }, error => {
    }, () => {
      this.sendMail();
    });
  }
}
