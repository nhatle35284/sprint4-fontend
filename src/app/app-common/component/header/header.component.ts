import { Component, OnInit } from '@angular/core';
import {CartService} from '../../../shopping/service/cart.service';
import {Cart} from '../../../shopping/model/Cart.class';
import {TokenStorageService} from '../../service/token-storage/token-storage.service';
import {LoginComponent} from '../login/login.component';
import {MatDialog} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-header1',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public carts: Cart[] = [];
  public idUser: number;
  public username: string;
  public role: string;
  isLoggedIn = false;
  constructor(
    public dialog: MatDialog,
    private cartService: CartService,
    private tokenStorageService: TokenStorageService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.idUser = 0;
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      this.idUser = this.tokenStorageService.getUser().id;
      this.username = this.tokenStorageService.getUser().username;
      this.role = this.tokenStorageService.getUser().role[0];
      console.log(this.tokenStorageService.getUser());
    }
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    this.cartService.getAllCartByUser(this.idUser).subscribe(data => {
      this.carts = data;
    });
    console.log(this.role);
  }
  logout(): void {
    // this.idUser = null;
    this.tokenStorageService.signOut();
    this.toastr.success('Logout success', 'Successfully');
    this.ngOnInit();
  }
  reloadPage(): void {
    window.location.reload();
  }
  dialogLoginComment(): void {
      const dialogRef = this.dialog.open(LoginComponent, {
        panelClass: 'app-full-bleed-dialog',
        width: '1000px',
        height: '70%',
        // data: {fullName: dataName},
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(result => {
        this.ngOnInit();
      });
  }
}
