import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Category} from '../../model/Category';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {GoodsService} from '../../../shopping/service/goods.service';
import {ToastrService} from 'ngx-toastr';
import {Goods} from '../../../shopping/model/Goods.class';

@Component({
  selector: 'app-good-details',
  templateUrl: './good-details.component.html',
  styleUrls: ['./good-details.component.css']
})
export class GoodDetailsComponent implements OnInit {
  public formEdit: FormGroup;
  public dataId: number;
  public category: Category[] = [];
  public goods: Goods;

  constructor(
    private dialogRef: MatDialogRef<GoodDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private goodsService: GoodsService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.dataId = this.data.data1.idGood;
    this.goodsService.getByID(this.dataId).subscribe(getData => {
      this.formEdit.patchValue(getData);
      this.goods = getData;
    });
    this.goodsService.categoryList().subscribe(getData => {
      this.category = getData;
    });
    this.formEdit = this.formBuilder.group({
      // idUser: [''],
      idGood: [''],
      goodName: [''],
      price: [''],
      quantity: [''],
      saleOff: [''],
      trademark: [''],
      categoryName: [''],
      idCategory: [''],
      // password: ['', [Validators.required, Validators.pattern('^[a-z0-9]{6,30}$')]],
      // confirmPassword: [''],
      // fullName: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(/^[a-zA-Zà-ỹÀ-Ỹ\s]{1,30}$/)]],
      // email: ['', [Validators.required, Validators.pattern(/^[a-z][a-z0-9_\.]{3,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/)]],
      // gender: ['', [Validators.required]],
      // money: ['0'],
      // birthday: ['', [Validators.required]]
    });
  }

}
