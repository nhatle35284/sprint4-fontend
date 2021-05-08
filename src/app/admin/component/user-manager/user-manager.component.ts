import { Component, OnInit } from '@angular/core';
import {Goods} from '../../../shopping/model/Goods.class';
import {MatDialog} from '@angular/material/dialog';
import {GoodsService} from '../../../shopping/service/goods.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {TokenStorageService} from '../../../app-common/service/token-storage/token-storage.service';
import {GoodDeleteComponent} from '../good-delete/good-delete.component';
import {GoodAddComponent} from '../good-add/good-add.component';
import {GoodEditComponent} from '../good-edit/good-edit.component';
import {GoodDetailsComponent} from '../good-details/good-details.component';
import {UserService} from '../../service/user.service';
import {User} from '../../model/User';
import {UserDeleteComponent} from '../user-delete/user-delete.component';
import {UserCreateComponent} from '../user-create/user-create.component';
import {UserEditComponent} from '../user-edit/user-edit.component';

@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.css']
})
export class UserManagerComponent implements OnInit {

  public userList: User[] = [];
  p: any;

  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private token: TokenStorageService
  ) {
  }

  ngOnInit(): void {
    this.title.setTitle('Quản lý thành viên');
    // if (this.token.getUser() !== null) {
    //   // tslint:disable-next-line:triple-equals
    //   if (this.token.getUser().id == 1) {
    //     this.title.setTitle('Good');
    //     this.sizeMSG = 'Không có kết quả nào!';
    this.userService.getAllUser().subscribe(data => {
      this.userList = data;
      console.log(this.userList);
      // if (this.userList != null) {
      //   // tslint:disable-next-line:prefer-for-of
      //   for (let i = 0; i < this.userList.length; i++) {
      //     this.userList[i].money = formatCash(this.userList[i].money);
      //   }
      //   this.sizeMSG = this.userList.length + '';
      // }
      // this.sendMessage();
    });
    //   } else {
    //     this.router.navigateByUrl('/error-page');
    //   }
    // } else {
    //   this.router.navigateByUrl('/error-page');
    // }
  }

  openDialogDelete(id): void {
    this.userService.getByID(id).subscribe(dataUser => {
      const dialogRef = this.dialog.open(UserDeleteComponent, {
        width: '500px',
        data: {data1: dataUser},
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.ngOnInit();
      });
    });
  }

  openDialogCreate(): void {
    const dialogRef = this.dialog.open(UserCreateComponent, {
      panelClass: 'app-full-bleed-dialog',
      width: '670px',
      maxHeight: '90vh',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }
  openDialogEdit(id): void {
    this.userService.getByID(id).subscribe(dataUser => {
      const dialogRef = this.dialog.open(UserEditComponent, {
        width: '600px',
        maxHeight: '90vh',
        data: {dataC: dataUser.idUser},
        disableClose: true
      });
      console.log('data:' + dataUser.idUser);
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.ngOnInit();
      });
    });
  }

  // openDialogDetail(id): void {
  //   this.goodsService.getByID(id).subscribe(data => {
  //     const dialogRef = this.dialog.open(GoodDetailsComponent, {
  //       width: '650px',
  //       maxHeight: '500px',
  //       data: {data1: data},
  //       disableClose: true
  //     });
  //
  //     dialogRef.afterClosed().subscribe(result => {
  //       console.log('The dialog was closed');
  //       this.ngOnInit();
  //     });
  //   });
  // }

  // search(): void {
  //   this.p = 0;
  //   this.userService.searchUsers(this.valueSearch.trim()).subscribe(dataSearch => {
  //     this.userList = dataSearch;
  //     console.log(this.valueSearch);
  //   });
  // }

  // openDialogChangePass(id): void {
  //   this.userService.getByID(id).subscribe(dataUser => {
  //     const dialogRef = this.dialog.open(ChangePasswordComponent, {
  //       width: '450px',
  //       maxHeight: '400px',
  //       data: {dataC: dataUser.idUser},
  //       disableClose: true
  //     });
  //     console.log('data:' + dataUser.idUser);
  //     dialogRef.afterClosed().subscribe(result => {
  //       console.log('The dialog was closed');
  //       this.ngOnInit();
  //     });
  //   });
  // }
}
