import {Component, Inject, OnInit} from '@angular/core';
import {CartService} from '../../../shopping/service/cart.service';
import {AngularFireStorage} from '@angular/fire/storage';
import {finalize} from 'rxjs/operators';
import {UserService} from '../../service/user.service';
import {ToastrService} from 'ngx-toastr';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GoodsService} from '../../../shopping/service/goods.service';

// tslint:disable-next-line:typedef
export function checkNameUser(name = []) {
  return (a: AbstractControl) => {
    return (name.includes(a.value) ? {invalidName: true} : null);
  };
}
@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  public image;
  public username = 'Nhat123';
  public formEdit: FormGroup;
  public dataId: number;
  url = this.image;
  public userOfId = 1;
  selectedImage: any = null;
  public listUserName = [];
  public userList;
  constructor(
    private dialogRef: MatDialogRef<UserService>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    // filebase
    @Inject(AngularFireStorage) private storage: AngularFireStorage
  ) { }

  ngOnInit(): void {
    this.dataId = this.data.dataC;
    this.userService.getByID(this.dataId).subscribe(getData => {
      console.log(getData);
      this.formEdit.patchValue(getData);
    });
    // this.goodsService.categoryList().subscribe(getData => {
    //   this.category = getData;
    // });
    this.formEdit = this.formBuilder.group({
      idUser: [''],
      password: [''],
      confirmPassword: [''],
      fullName: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(/^[a-zA-Zà-ỹÀ-Ỹ\s]{2,30}$/)]],
      username: ['', [Validators.required, Validators.pattern('^[a-z0-9]{3,30}$'), checkNameUser(this.listUserName)]],
      email: ['', [Validators.required, Validators.pattern(/^[a-z][a-z0-9_\.]{3,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/)]],
      numberPhone: ['', [Validators.required, Validators.pattern(/^[0-9\-\+]{10}$/)]],
      // gender: [''],
      address: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(/^[a-zA-Zà-ỹÀ-Ỹ_0-9\s]{3,30}$/)]],
      image: ['']
    });
    this.userService.getAllUser().subscribe(data => {
      this.userList = data;
      this.getAllUserName();
    });
    // filebase
    // this.userService.getImageDetailList();
  }
  edit(): void {
    if (this.formEdit.valid) {
      console.log(this.formEdit.value);
      this.userService.edit(this.formEdit.value, this.dataId).subscribe(data => {
        this.dialogRef.close();
      }, error => {
        console.log(error);
      }, () => {
        this.toastr.success('Chỉnh sửa thành viên thành công', 'Thành công');
      });
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

  save(): void {
    // const name = this.selectedImage.name;
    const name = this.username;
    const fileRef = this.storage.ref(name);
    this.storage.upload(name, this.selectedImage).snapshotChanges().pipe(
      finalize(() => {
        console.log('b1');
        fileRef.getDownloadURL().subscribe((url) => {
          console.log(url);
          this.url = url;
          this.userService.insertImageDetails(this.url);
          this.userService.updateAccountImage(this.userOfId, this.url).subscribe(data => {
            if (data == null){
              this.toastr.success('ok');
            }
          });
        });
      })
    ).subscribe();
  }
  getAllUserName(): void {
    if (!this.userList.isEmpty) {
      for (const user of this.userList) {
        this.listUserName.push(user.username);
      }
    }
  }

}
