import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponentComponent } from './home-component/home-component.component';
import { ManufacturersComponent } from './manufacturers/manufacturers.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ProductComponent } from './product/product.component';
import { TransactionComponent } from './transaction/transaction.component';
import { AuthzComponent } from './authz-component/authz-component.component';

import { AuthInterceptorService } from './services/auth-interceptor.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DialogComponent } from './dialog/dialog.component';

const routes: Routes = [
  { path: '', redirectTo: 'authz', pathMatch: 'full' },
  { path: 'home1', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponentComponent },
  { path: 'manufactuers', component: ManufacturersComponent },
  { path: 'products', component: ProductComponent },
  { path: 'transactions', component: TransactionComponent },
  { path: 'authz', component: AuthzComponent }
];

@NgModule({
  //component available for usage.
  declarations: [
    AppComponent,
    HomeComponentComponent,
    ManufacturersComponent,
    ProductComponent,
    TransactionComponent,
    AuthzComponent,
    DialogComponent
  ],
  imports: [
    //Modulues or libraries which are used in project
    RouterModule.forRoot(routes),
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    MatTableModule,
    MDBBootstrapModule.forRoot(),
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDialogModule,
    ToastrModule.forRoot()
  ],
  //providers: [AuthInterceptorService],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }],
  //below component will be considered as homeComponent
  bootstrap: [AppComponent]
})
export class AppModule { }
