import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {GoodsService} from '../../../shopping/service/goods.service';
import {Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {UserService} from '../../service/user.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-user-delete',
  templateUrl: './user-delete.component.html',
  styleUrls: ['./user-delete.component.css']
})
export class UserDeleteComponent implements OnInit {
  public idUser;
  public username;
  constructor(
    private dialogRef: MatDialogRef<UserDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private router: Router,
    private title: Title,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.username = this.data.data1.username;
    this.idUser = this.data.data1.idUser;
  }
  delete(): void {
    this.userService.delete(this.idUser).subscribe(data => {
      if (data == null){
        this.dialogRef.close();
      }
    }, error => {
      console.log(error);
    }, () => {
      this.toastr.success('Xóa thành viên thành công', 'Thành Công');
    });
  }
}
