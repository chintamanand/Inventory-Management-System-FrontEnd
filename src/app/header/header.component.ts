import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLoggedIn$: Observable<boolean>;
  show2$: Observable<boolean>;

  constructor(private authService: TokenStorageService, private tokenStorageService: TokenStorageService) { }

  ngOnInit() {
    console.log("Header ngOnInit Method()");
    this.isLoggedIn$ = this.authService.isLoggedIn2;
    this.show2$ = this.authService.isLoggedOut;
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }

}
