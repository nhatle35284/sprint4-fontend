import { Component, OnInit } from '@angular/core';
import {UserService} from '../../service/user.service';
import {Title} from '@angular/platform-browser';
import {TokenStorageService} from '../../../app-common/service/token-storage/token-storage.service';
import {ActivatedRoute, Router} from '@angular/router';
import {GoodsService} from '../../../shopping/service/goods.service';
import {Goods} from '../../../shopping/model/Goods.class';
import {GoodDeleteComponent} from '../good-delete/good-delete.component';
import {MatDialog} from '@angular/material/dialog';
import {UserEditComponent} from '../user-edit/user-edit.component';
import {GoodEditComponent} from '../good-edit/good-edit.component';
import {GoodDetailsComponent} from '../good-details/good-details.component';
import {GoodAddComponent} from '../good-add/good-add.component';

@Component({
  selector: 'app-good-manager',
  templateUrl: './good-manager.component.html',
  styleUrls: ['./good-manager.component.css']
})
export class GoodManagerComponent implements OnInit {
  public goodsList: Goods[] = [];
  public valueSearch: string;
  public sizeMSG: string;
  p: any;

  constructor(
    private dialog: MatDialog,
    private goodsService: GoodsService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private token: TokenStorageService
  ) {
  }

  ngOnInit(): void {
    this.title.setTitle('Quản lý hàng hóa');
        this.goodsService.getAllGoods().subscribe(data => {
          this.goodsList = data;
        });
  }

  openDialogDelete(id): void {
    this.goodsService.getByID(id).subscribe(dataUser => {
      const dialogRef = this.dialog.open(GoodDeleteComponent, {
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
    const dialogRef = this.dialog.open(GoodAddComponent, {
      width: '670px',
      maxHeight: '90vh',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  openDialogEdit(id): void {
    this.goodsService.getByID(id).subscribe(dataUser => {
      const dialogRef = this.dialog.open(GoodEditComponent, {
        width: '600px',
        maxHeight: '90vh',
        data: {dataC: dataUser.idGood},
        disableClose: true
      });
      console.log('data:' + dataUser.idUser);
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.ngOnInit();
      });
    });
  }

  openDialogDetail(id): void {
    this.goodsService.getByID(id).subscribe(data => {
      const dialogRef = this.dialog.open(GoodDetailsComponent, {
        panelClass: 'app-full-bleed-dialog',
        width: '650px',
        maxHeight: '500px',
        data: {data1: data},
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.ngOnInit();
      });
    });
  }

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
