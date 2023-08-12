import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { TokenStorageService } from '../services/token-storage.service';

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
  errorMessage = '';

  roles: string[] = [];

  constructor(private authService: AuthenticationService,
    private tokenStorage: TokenStorageService, private router: Router) { }

  ngOnInit(): void {
    this.signUpForm = new FormGroup({
      username: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl('')
    });

    this.signInForm = new FormGroup({
      username: new FormControl(''),
      password: new FormControl('')
    });

    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
  }

  register(form: FormGroup) {
    this.username = form.value.username;
    this.email = form.value.email;
    this.password = form.value.password;

    this.authService.register(this.username, this.email, this.password).subscribe(
      data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    );

  }

  login(form: FormGroup) {
    console.log('Valid?', form.valid); // true or false

    this.username = form.value.username;
    this.password = form.value.password;

    this.authService.login(this.username, this.password).subscribe(
      data => {
        console.log("In authComponent Login()");
        console.log("User Token -- " + data.token);
        this.tokenStorage.saveToken(data.token);
        this.tokenStorage.saveUser(data);

        console.log("Data received -- " + JSON.stringify(data))

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.router.navigate(['/home'])
      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }

  signUp() {
    document.getElementById('container')?.classList.add('right-panel-active');
  }

  signIn() {
    document.getElementById('container')?.classList.remove('right-panel-active');
  }

}
function next(next: any, arg1: (data: any) => void, arg2: (err: any) => void) {
  throw new Error('Function not implemented.');
}

