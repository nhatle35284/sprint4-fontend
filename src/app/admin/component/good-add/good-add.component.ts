import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Category} from '../../model/Category';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {GoodsService} from '../../../shopping/service/goods.service';
import {ToastrService} from 'ngx-toastr';
import {finalize} from 'rxjs/operators';
import {AngularFireStorage} from '@angular/fire/storage';

@Component({
  selector: 'app-good-add',
  templateUrl: './good-add.component.html',
  styleUrls: ['./good-add.component.css']
})
export class GoodAddComponent implements OnInit {
  public formCreate: FormGroup;
  public dataId: number;
  public category: Category[] = [];
  selectedImage: any = null;
  public image;
  url = this.image;

  // public userOfId = 1;
  constructor(
    private dialogRef: MatDialogRef<GoodAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private goodsService: GoodsService,
    private toastr: ToastrService,
    // filebase
    @Inject(AngularFireStorage) private storage: AngularFireStorage
  ) {
  }

  ngOnInit(): void {
    this.goodsService.categoryList().subscribe(getData => {
      this.category = getData;
    });
    this.formCreate = this.formBuilder.group({
      // idUser: [''],
      idGood: [''],
      goodName: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(/^[a-zA-Zà-ỹÀ-Ỹ\s]{2,30}$/)]],
      price: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(/^\d{4,}$/)]],
      quantity: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(/^[1-9]|[1-9][0-9]{1,}$/)]],
      image: [''],
      saleOff: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(/^[0-9]|[1-9][0-9]{1,2}|100$/)]],
      trademark: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(/^[a-zA-Zà-ỹÀ-Ỹ\s]{2,30}$/)]],
      // categoryName: ['', [Validators.required]],
      idCategory: ['', [Validators.required]],
    });
    // filebase
    this.goodsService.getImageDetailList();
  }

  create(): void {
    console.log('b');
    this.formCreate.markAllAsTouched();
    console.log('v');
    if (this.formCreate.valid) {
      console.log('b0');
      const name = this.formCreate.value.goodName;
      const fileRef = this.storage.ref(name);
      this.storage.upload(name, this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          console.log('b1');
          fileRef.getDownloadURL().subscribe((url) => {
            console.log(url);
            this.url = url;
            this.goodsService.insertImageDetails(this.url);
            this.formCreate.value.image = this.url;
            console.log(this.formCreate.value);
            this.goodsService.create(this.formCreate.value).subscribe(data => {
              if (data == null) {
                this.dialogRef.close();
                this.toastr.success('Thêm sản phẩm thành công', 'Thành Công');
              }
            }, error => {
              console.log(error);
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

  // save(): void {
  //   // const name = this.selectedImage.name;
  //   const name = this.username;
  //   const fileRef = this.storage.ref(name);
  //   this.storage.upload(name, this.selectedImage).snapshotChanges().pipe(
  //     finalize(() => {
  //       console.log('b1');
  //       fileRef.getDownloadURL().subscribe((url) => {
  //         console.log(url);
  //         this.url = url;
  //         this.goodsService.insertImageDetails(this.url);
  //         this.goodsService.updateAccountImage(this.userOfId, this.url).subscribe(data => {
  //           if (data == null) {
  //             this.toastr.success('ok');
  //           }
  //         });
  //       });
  //     })
  //   ).subscribe();
  // }
}
