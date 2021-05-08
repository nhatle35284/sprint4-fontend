import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UserService} from '../../../admin/service/user.service';
import {Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {CartService} from '../../service/cart.service';
import {TokenStorageService} from '../../../app-common/service/token-storage/token-storage.service';

@Component({
  selector: 'app-delete-good-cart',
  templateUrl: './delete-good-cart.component.html',
  styleUrls: ['./delete-good-cart.component.css']
})
export class DeleteGoodCartComponent implements OnInit {
  public idCart;
  public username;

  constructor(
    private dialogRef: MatDialogRef<DeleteGoodCartComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cartService: CartService,
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private title: Title
  ) {
  }

  ngOnInit(): void {
    if (this.tokenStorageService.getUser() != null) {
      this.username = this.data.data1.username;
      this.idCart = this.data.data1.idCart;
    } else {
      this.idCart = this.data.data1;
    }
  }

  delete(): void {
    if (this.tokenStorageService.getUser() != null) {
      this.cartService.delete(this.idCart).subscribe(data => {
        if (data == null) {
          this.dialogRef.close();
        }
      }, error => {
        console.log(error);
      });
    } else {
      this.cartService.deleteSession(this.idCart).subscribe(data => {
        if (data == null) {
          this.dialogRef.close();
        }
      }, error => {
        console.log(error);
      });
    }
  }
}
