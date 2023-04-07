import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenStorageService } from './token-storage.service';

// will be added in header, before sending the request to BackEnd
const TOKEN_HEADER_KEY = "Authorization";
//const TOKEN_HEADER_KEY = 'x-access-token';


//HttpInterceptor has intercept() method to inspect and transform HTTP requests before they are sent to server.
@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private tokenStorageService: TokenStorageService) {}

  //intercept method will recevie the httpRequest, which will be inspected & farworded to nextHandler.
  //HttpHandler is injectable. When injected, the handler instance dispatches requests to the first interceptor in the chain, which dispatches to the second, etc, eventually reaching the HttpBackend.
  //next: HttpHandler object represents the next interceptor in the chain of interceptors. The final ‘next’ in the chain is the Angular HttpClient.
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("Entered the Intercept() method ");
    let authReq = req;
    
    console.log("Calling GetUser() Method -- " + JSON.stringify(this.tokenStorageService.getUser()));
    const token = this.tokenStorageService.getToken();
    if (token != null) {
      console.log("Token is not NULL -- " + JSON.stringify(token));
      authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, "Bearer " + token) });
      console.log("Token added to HTTP request");
      console.log("Complete Request after Inteception -- " + JSON.stringify(authReq));
      return next.handle(authReq);
    } else {
      //No token; proceed request without bearer token
      console.log('No token added to HTTP request');
      return next.handle(req);
    }
    
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
];