import { Component } from '@angular/core';
import { ServiceService } from '../service.service';
import { Router } from '@angular/router';
import { Product } from '../product';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Invoice } from '../product';
@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrl: './invoice-details.component.css'
})
export class InvoiceDetailsComponent {
  addInvoice:Invoice={
    invoiceId: '',
    invoicePeriod: '',
    departmentId: 0,
    departmentName: '',
    totalUSDAmount:0
  };

  constructor(private serviceService:ServiceService){}

  ngOnInit(): void {}
  createInvoice()
  {
    this.serviceService.addInvoice(this.addInvoice)
    .subscribe({
      next:(task)=>
      {
        console.log(task);
      },
      error:(response)=>
      {
        console.log(response);
      }
    })
  }


}
