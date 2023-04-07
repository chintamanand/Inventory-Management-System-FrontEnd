import { Component } from '@angular/core';

import { Router, NavigationStart } from '@angular/router';
import { TokenStorageService } from './services/token-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ivms';
  showHead: boolean = false;
  showHead1: boolean = false;

  constructor(router: Router, private tokenStorageService: TokenStorageService) {
    if(tokenStorageService.checkIfUserLoggedIn()){
      console.log("User LoggedIn");

      router.events.forEach((event) => {
        if (event instanceof NavigationStart) {
          if (event['url'] == '/home') {
            this.showHead = true;
            this.showHead1 = false;
          }
        }
      });

    } else {
      console.log("User Logged Out");

      router.events.forEach((event) => {
        if (event instanceof NavigationStart) {
          if (event['url'] == '/home') {
            this.showHead = false;
            this.showHead1 = true;
          }
        }
      });

    }
    // else {
    //   this.tokenStorageService.signOut();
    //   this.router.navigate(['authz'])
    // }

    // on route change to '/login', set the variable showHead to false
      // router.events.forEach((event) => {
      //   if (event instanceof NavigationStart) {
      //     if (event['url'] == '/authz') {
      //       this.showHead = false;
      //     } else {
      //       // console.log("NU")
      //       this.showHead = true;
      //     }
      //   }
      // });


    }

    logout(): void {
      this.tokenStorageService.signOut();
      window.location.reload();
    }

}
