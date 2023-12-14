import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home-component/home-component.component';
import { ManufacturersComponent } from './manufacturers/manufacturers.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ProductComponent } from './product/product.component';
import { TransactionComponent } from './transaction/transaction.component';
import { AuthzComponent } from './authz-component/authz-component.component';
import { MatGridListModule } from '@angular/material/grid-list';

import { AuthInterceptorService } from './services/auth-interceptor.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ProductEditDialogComponent } from './product-edit-dialog/productEditDialog.component';
import { MatCardModule } from '@angular/material/card';
import { HeaderComponent } from './header/header.component';
import { ManufactureViewDialogComponent } from './manufacturer-view-dialog/manufacturer-view-dialog.component';
import { MatMenuModule } from '@angular/material/menu';
import { FilterPipe } from './filter.pipe';

const routes: Routes = [
  { path: '', redirectTo: 'authz', pathMatch: 'full' },
  { path: 'home', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: HomeComponent },
  { path: 'authz', component: AuthzComponent },
  { path: 'logout', component: AuthzComponent },
  { path: 'app', component: AppComponent },
  { path: 'manufactuers', component: ManufacturersComponent },
  { path: 'products', component: ProductComponent },
  { path: 'transactions', component: TransactionComponent }
];

@NgModule({
  //component available for usage.
  declarations: [
    AppComponent,
    HomeComponent,
    ManufacturersComponent,
    ProductComponent,
    TransactionComponent,
    AuthzComponent,
    ProductEditDialogComponent,
    HeaderComponent,
    ManufactureViewDialogComponent,
    FilterPipe 
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
    MatPaginatorModule, MatCardModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule, MatMenuModule,
    MatDialogModule, MatGridListModule,
    ToastrModule.forRoot()
  ],
  //providers: [AuthInterceptorService],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }],
  //below component will be considered as homeComponent
  bootstrap: [AppComponent]
})
export class AppModule { }
