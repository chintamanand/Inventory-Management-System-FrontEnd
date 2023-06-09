import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

//TokenStorageService to manages token and user information inside Browser’s Session Storage. 
//For Logout, we only need to clear this Session Storage.
@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  isLoggedIn: boolean;

  constructor() { }

  public checkIfUserLoggedIn(): boolean {
    this.isLoggedIn = !!this.getToken();
    if (this.isLoggedIn) {
      const user = this.getUser();
      if (user != null) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  public signOut(): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.clear();
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  //It gets LoggedIn User
  public getUser(): any {
    console.log("Entered into GetUser() method");
    const user = window.sessionStorage.getItem(USER_KEY);
    console.log("User in session Storage -- " + JSON.stringify(user));
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }

  public isUserLoggedIn(): boolean {
    let user = window.sessionStorage.getItem(USER_KEY)
    if (user === null) {
      return false
    } else {
      return true
    }
  }

}
