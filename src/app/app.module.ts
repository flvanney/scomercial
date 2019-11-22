import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';
import { MAT_DATE_LOCALE } from '@angular/material';
import { MatMenuModule } from '@angular/material/menu'; 

import { registerLocaleData } from '@angular/common';
import esAR from '@angular/common/locales/es-AR';
registerLocaleData(esAR, 'esAR');

import { OrderModule } from 'ngx-order-pipe';

import { AppComponent } from './app.component';
import { AgregarClienteComponent } from './clientes/agregar-cliente/agregar-cliente.component';
import { TablaClientesComponent } from './clientes/tabla-clientes/tabla-clientes.component';
import { BienvenidoComponent } from './bienvenido/bienvenido.component';
import { Error404Component } from './error404/error404.component';
import { NotaDePedidoComponent } from './nota-de-pedido/nota-de-pedido.component';
import { VentaComponent } from './venta/venta.component';
import { ListaDeArticulosComponent } from './lista-de-articulos/lista-de-articulos.component';

const appRoutes: Routes = [
  { path: 'lista-articulos', component: ListaDeArticulosComponent},
  { path: 'crear-cliente', component: AgregarClienteComponent },
  { path: 'lista-clientes', component: TablaClientesComponent },
  { path: 'crear-nota-de-pedido', component: NotaDePedidoComponent },
  { path: 'generar-venta', component: VentaComponent },
  { path: '', component: BienvenidoComponent },
  { path: '**', component: Error404Component }
];

@NgModule({
  declarations: [
    AppComponent,
    AgregarClienteComponent,
    TablaClientesComponent,
    BienvenidoComponent,
    Error404Component,
    NotaDePedidoComponent,
    VentaComponent,
    ListaDeArticulosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    OrderModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'es-AR'},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
