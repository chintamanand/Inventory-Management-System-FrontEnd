import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { TokenStorageService } from '../services/token-storage.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-authz-component',
  templateUrl: './authz-component.component.html',
  styleUrls: ['./authz-component.component.css']
})
export class AuthzComponent implements OnInit {
  showHead1 = true;

  signUpForm: FormGroup;

  signInForm: FormGroup;

  username: string = "";
  email: string = "";
  password: string = "";

  isSuccessful = false;
  isSignUpFailed = false;

  isLoggedIn = false;
  isLoginFailed = false;

  roles: string[] = [];

  constructor(private authService: AuthenticationService,
    private tokenStorage: TokenStorageService, private router: Router,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.signUpForm = new FormGroup({
      username: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl('')
    });

    this.signInForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });

    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
  }

  register(form: FormGroup) {
    if (form.value.username == '' || form.value.password == '' || form.value.email == '') {
      this.notificationService.showWarning("Enter Valid Details", "Registration Failure");
    } else {
      this.username = form.value.username;
      this.email = form.value.email;
      this.password = form.value.password;

      this.authService.register(this.username, this.email, this.password).subscribe(
        data => {
          console.log(data);
          this.isSuccessful = true;
          this.isSignUpFailed = false;
          this.notificationService.showSuccess(data.message, "Registration Success");
        },
        err => {
          this.notificationService.showError(err.error.message, "Registration Failure");
          this.isSignUpFailed = true;
          //form.reset();
        }
      );
    }
  }

  login(form: FormGroup) {
    if (form.value.username == '' || form.value.password == '') {
      this.notificationService.showWarning("Enter Valid UserName & Password", "Login Failure");
    } else {
      this.username = form.value.username;
      this.password = form.value.password;

      this.authService.login(this.username, this.password).subscribe(
        data => {
          console.log("In authComponent Login()");
          console.log("User Token -- " + data.token);
          console.log("Refresh Token -- " + data.refreshToken);
          this.tokenStorage.saveToken(data.token);
          this.tokenStorage.saveUser(data);

          console.log("Data received -- " + JSON.stringify(data))
          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.roles = this.tokenStorage.getUser().roles;
          this.router.navigate(['home'])
          this.notificationService.showSuccess(data.message, "Login Success");
        },
        err => {
          this.isLoginFailed = true;
          console.log("Error message -- " + err.error.message);
          this.notificationService.showError(err.error.message, "Login Failure");
        }
      );
    }
  }

  signUp() {
    document.getElementById('container')?.classList.add('right-panel-active');
  }

  signIn() {
    document.getElementById('container')?.classList.remove('right-panel-active');
  }

  forgotPassword(){
    this.notificationService.showWarning("Feature still in development", "Forgot Password");
  }

}

