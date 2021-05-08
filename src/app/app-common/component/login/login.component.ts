import {Component, Inject, OnInit} from '@angular/core';
import {AuthenticationService} from '../../service/auth/authentication.service';
import {TokenStorageService} from '../../service/token-storage/token-storage.service';
import {Title} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser} from 'angularx-social-login';
import {TokenDTO} from '../../model/TokenDTO';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  isLoggedIn = false;
  public idUser: number;
  socialUser: SocialUser;
  isLoginFailed = false;
  errorMessage = '';
  role: string;
  public computer: number;

  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private authenticationService: AuthenticationService,
    private tokenStorageService: TokenStorageService,
    private toarst: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    private title: Title,
    private authService: SocialAuthService
  ) {
  }

  ngOnInit(): void {
    this.title.setTitle('Đăng nhập');
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmitLogin(): void {
    console.log(this.loginForm.value);
    this.authenticationService.login(this.loginForm.value).subscribe(
      data => {
        this.tokenStorageService.saveToken(data.token);
        this.tokenStorageService.saveUser(data);
        this.idUser = data.idUser;
        this.isLoggedIn = true;
        // this.reloadPage();
        // this.ngOnInit();
        if (this.isLoggedIn === true && this.idUser !== 1) {
          // @ts-ignore
        }
      },
      err => {
        this.errorMessage = 'Tên tài khoản và mật khẩu không hợp lệ !';
        setTimeout(() => {
          this.errorMessage = '';
        }, 2000);
        this.isLoggedIn = false;
      }, () => {
        this.toarst.success('Login success', 'Successfully');
        this.router.navigate([''], {queryParams: {create_msg: 'Create successfully!', si: true}});
        this.dialogRef.close();
        // this.reloadPage();
      }
    );
  }

  reloadPage(): void {
    window.location.reload();
  }

  logout(): void {
    this.idUser = null;
    // @ts-ignore
    this.tokenStorageService.signOut();
    this.reloadPage();
  }
  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      data => {
        this.socialUser = data;
        // @ts-ignore
        this.idUser = data.id;
        const token = new TokenDTO(this.socialUser.idToken);
        this.authenticationService.google(token).subscribe(next => {
          this.tokenStorageService.saveToken(next.accessToken);
          this.tokenStorageService.saveUser(next);
          this.isLoggedIn = true;
          this.reloadPage();
        }, err => {
          this.isLoggedIn = false;
        });
      }
    );
  }
  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(
      data => {
        this.socialUser = data;
        const token = new TokenDTO(this.socialUser.authToken);
        console.log(data);
        // @ts-ignore
        this.idUser = data.id;
        this.authenticationService.facebook(token).subscribe(next => {
          this.tokenStorageService.saveToken(next.accessToken);
          this.tokenStorageService.saveUser(next);
          //   console.log(next);
          this.isLoggedIn = true;
          this.reloadPage();
        }, err => {
          console.log('error');
          this.isLoggedIn = false;
        });
      }
    );
  }
}
