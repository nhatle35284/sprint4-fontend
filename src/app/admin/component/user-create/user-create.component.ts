import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GoodsService} from '../../../shopping/service/goods.service';
import {ToastrService} from 'ngx-toastr';
import {UserService} from '../../service/user.service';
import {Role} from '../../model/Role';
import {User} from '../../model/User';

// tslint:disable-next-line:typedef
function comparePassword(c: AbstractControl) {
  const v = c.value;
  const isNotEmpty = v.confirmPassword !== '';
  if (isNotEmpty) {
    return (v.password === v.confirmPassword) ? null : {
      passwordNotMatch: true
    };
  }
}
// tslint:disable-next-line:typedef
export function checkNameUser(name = []) {
  return (a: AbstractControl) => {
    return (name.includes(a.value) ? {invalidName: true} : null);
  };
}
@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit {
  public role: Role[] = [];
  public formCreate: FormGroup;
  public listUserName = [];
  public userList;
  constructor(
    private dialogRef: MatDialogRef<UserCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.userService.roleList().subscribe(getData => {
      this.role = getData;
    });
    this.formCreate = this.formBuilder.group({
      idUser: [''],
      password: ['', [Validators.required, Validators.pattern('^[a-z0-9]{6,30}$')]],
      confirmPassword: ['', [Validators.required]],
      fullName: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(/^[a-zA-Zà-ỹÀ-Ỹ\s]{2,30}$/)]],
      username: ['', [Validators.required, Validators.pattern('^[a-z0-9]{3,30}$'), checkNameUser(this.listUserName)]],
      email: ['', [Validators.required, Validators.pattern(/^[a-z][a-z0-9_\.]{3,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/)]],
      numberPhone: ['', [Validators.required, Validators.pattern(/^[0-9\-\+]{10}$/)]],
      // gender: [''],
      address: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(/^[a-zA-Zà-ỹÀ-Ỹ_0-9\s]{3,30}$/)]],
      image: ['']
    }, {validator: comparePassword});
    this.userService.getAllUser().subscribe(data => {
      this.userList = data;
      this.getAllUserName();
    });
  }
  create(): void {
    this.formCreate.markAllAsTouched();
    if (this.formCreate.valid) {
    // console.log(this.formCreate.value);
      this.userService.create(this.formCreate.value).subscribe(data => {
        if (data == null) {
          this.dialogRef.close();
        }
      }, error => {
        console.log(error);
      }, () => {
        this.toastr.success('Thêm thành viên thành công', 'Thành Công');
      });
    }
  }
  getAllUserName(): void {
    if (!this.userList.isEmpty) {
      for (const user of this.userList) {
        this.listUserName.push(user.username);
      }
    }
  }
}
