import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {GoodsService} from '../../../shopping/service/goods.service';
import {Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-good-delete',
  templateUrl: './good-delete.component.html',
  styleUrls: ['./good-delete.component.css']
})
export class GoodDeleteComponent implements OnInit {
public goodName: string;
public idGood: number;
  constructor(
    private dialogRef: MatDialogRef<GoodDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    private goodsService: GoodsService,
    private router: Router,
    private title: Title
  ) { }

  ngOnInit(): void {
    this.goodName = this.data.data1.goodName;
    this.idGood = this.data.data1.idGood;
  }

  delete(): void {
    this.goodsService.delete(this.idGood).subscribe(data => {
      if (data == null){
        this.dialogRef.close();
      }
    }, error => {
      console.log(error);
    }, () => {
      this.toastr.success('Xóa sản phẩm thành công', 'Thành Công');
    });
  }
}
