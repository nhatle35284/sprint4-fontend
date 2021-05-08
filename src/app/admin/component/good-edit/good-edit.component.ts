import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {GoodsService} from '../../../shopping/service/goods.service';
import {ToastrService} from 'ngx-toastr';
import {Category} from '../../model/Category';
import {AngularFireStorage} from '@angular/fire/storage';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-good-edit',
  templateUrl: './good-edit.component.html',
  styleUrls: ['./good-edit.component.css']
})
export class GoodEditComponent implements OnInit {
  public formEdit: FormGroup;
  public dataId: number;
  public category: Category[] = [];

  selectedImage: any = null;
  public image;
  url = this.image;

  constructor(
    private dialogRef: MatDialogRef<GoodEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private goodsService: GoodsService,
    private toastr: ToastrService,
    @Inject(AngularFireStorage) private storage: AngularFireStorage
  ) {
  }

  ngOnInit(): void {
    this.dataId = this.data.dataC;
    this.goodsService.getByID(this.dataId).subscribe(getData => {
      this.url = getData.image;
      console.log(getData);
      this.formEdit.patchValue(getData);
    });
    // console.log(this.url);
    this.goodsService.categoryList().subscribe(getData => {
      this.category = getData;
    });
    this.formEdit = this.formBuilder.group({
      // idUser: [''],
      idGood: [''],
      goodName: [''],
      price: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(/^\d{4,}$/)]],
      quantity: [''],
      saleOff: [''],
      trademark: [''],
      categoryName: [''],
      idCategory: [''],
    });
    this.goodsService.getImageDetailList();
  }

  edit(): void {
    if (this.formEdit.valid) {
      const name = this.formEdit.value.goodName;
      const fileRef = this.storage.ref(name);
      this.storage.upload(name, this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            console.log(url);
            this.url = url;
            this.goodsService.insertImageDetails(this.url);
            this.formEdit.value.image = this.url;
            this.goodsService.edit(this.formEdit.value, this.dataId).subscribe(data => {
              this.dialogRef.close();
            }, error => {
              console.log(error);
            }, () => {
              this.toastr.success('Chỉnh sửa sản phẩm thành công', 'Thành Công');
            });
            // this.goodsService.updateAccountImage(this.userOfId, this.url).subscribe(data => {
            //   if (data == null) {
            //     this.toastr.success('ok');
            //   }
            // });
          });
        })
      ).subscribe();
    }
  }
  // filebase
  showPreview(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.url = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
    } else {
      this.url = this.image;
      this.selectedImage = null;
    }
  }
}
