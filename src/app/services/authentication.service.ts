import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

const headers = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

//This service sends signup, login HTTP POST requests to back-end.
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {
  }

  //User Login
  login(username: string, password: string): Observable<any> {
    return this.http.post(this.baseUrl + 'auth/signin', {username, password}, headers);
  }

  //User Registration
  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(this.baseUrl + 'auth/signup', {
      username, email, password
    }, headers);
  }

}

