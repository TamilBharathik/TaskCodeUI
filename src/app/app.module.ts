import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { TableviewComponent} from './tableview/tableview.component';

import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ImageModule } from 'primeng/image';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';

import { PaginatorModule } from 'primeng/paginator';
import { NgSelectModule } from '@ng-select/ng-select';
import { MessagesModule } from 'primeng/messages';
import { TableModule } from 'primeng/table';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatDialogModule } from '@angular/material/dialog';
import { InvoiceDetailsComponent } from './invoice-details/invoice-details.component';
import { DialogModule } from 'primeng/dialog';
import { FileUpload, FileUploadEvent } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    TableviewComponent,
    InvoiceDetailsComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DropdownModule,
    FormsModule, 
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ImageModule,
    ButtonModule,
    ToastModule,
    ConfirmPopupModule,
    FileUploadModule,
    PaginatorModule,
    MessagesModule,
    NgSelectModule,
    TableModule,
    MatDialogModule,
    DialogModule,
    HttpClientModule
    
  ],
  providers: [ConfirmationService, MessageService, provideAnimationsAsync()],
  bootstrap: [AppComponent],
  
})
export class AppModule { }
