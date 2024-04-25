import { Component, OnInit,  } from '@angular/core';
import { ServiceService } from '../service.service';
import { Router } from '@angular/router';
import { DepartmentDropdownData, Product } from '../product';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventEmitter, Output } from '@angular/core';
import { InvoiceDetailsComponent } from '../invoice-details/invoice-details.component';
import { HttpClient } from '@angular/common/http';
import { forkJoin} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { Invoice } from '../product';
import { formatDate } from '@angular/common';
import { DatePeriod } from '../product';
import { Observable } from 'rxjs';
import { DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectorRef } from '@angular/core';


interface PageEvent {
  first: number; 
  rows: number;
  page: number;
  pageCount: number;
} 

@Component({
  selector: 'app-tableview',
  templateUrl: './tableview.component.html',
  styleUrl: './tableview.component.css'
})
export class TableviewComponent implements OnInit {
  dialogRef!: MatDialogRef<TableviewComponent>;
  isButtonDisabled: boolean = true;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedInvoicePeriod: string ='' ; 
  visible: boolean = false;
  totalAmount: number | undefined;
  remainingDays: number = 0;


  addInvoice:Invoice={
    invoiceId: '',
    invoicePeriod: '',
    departmentId: 0,
    departmentName: '',
    totalUSDAmount: 0
  };

  // getDatesAndPeriods:DatePeriod={
  //   submissionDate: new Date(),
  //   compareInvoicePeriod: ''
  // }

  getDatesPeriods:DatePeriod[]=[];
  
  showDialog(): void {
    this.visible = !this.visible; 
    
  }
  
  lastSubmissionTime: Date | null = null;
  selectedPeriodId: number | null = null;
  formSubmitted = false;
  disabledPeriods: { [key: string]: boolean } = {};
  datesAndPeriods$!: Observable<DatePeriod[]>;
  

  departmentData: DepartmentDropdownData = {
    departmentIds: [],
    departmentNames: [],
    selectedDepartmentId: null,
    selectedDepartmentName: null
  };
  periods = [
    { id:1, name: 'Weekly' },
    { id:2, name: 'Fortnight' },
    { id:3, name: 'Monthly' },
    { id:4, name: 'Half-Yearly' },
    { id:5, name: 'Yearly' }
];
  constructor(private ServiceService:ServiceService, 
    private router: Router, 
    private snackBar: MatSnackBar, 
    private http: HttpClient,private dialog: MatDialog,
    private cdr: ChangeDetectorRef
   
  ){

  }
  openDialog() {
    this.dialogRef = this.dialog.open(TableviewComponent);
  }

  
  ngOnInit(): void {
  this.ServiceService.getAll().subscribe((data: Product[]) => {
    this.products = data.map(product => {
      console.log(product+"res");
      return {
        ...product,
        imageUrl: `http://localhost:5243/api/Product/images/${product.imageFileName}`
      };
    });
    this.applyFilter();
    this.getAllDepartmentIds();
    this.loadDatesAndPeriods();
  });
}


applyFilter(): void {
  if (!this.selectedInvoicePeriod) {
    this.filteredProducts = this.products;
  } else {
    this.filteredProducts = this.products.filter(product => product.invoicePeriod === this.selectedInvoicePeriod);
  }

  this.totalAmount = this.filteredProducts.reduce((total, product) => {
    return total + (product.estimateCost || 0); 
  }, 0);
  this.cdr.detectChanges();
}

generateInvoice1() {
  // Assign values to the addInvoice object
  if (this.departmentData.selectedDepartmentId !== null && this.departmentData.selectedDepartmentName !== null) {
    this.addInvoice.departmentId = this.departmentData.selectedDepartmentId;
    this.addInvoice.departmentName = this.departmentData.selectedDepartmentName;
    this.addInvoice.invoicePeriod= this.selectedInvoicePeriod;
    this.addInvoice.totalUSDAmount=this.totalAmount!;
    
    this.disabledPeriods[this.selectedInvoicePeriod] = true;
this.resetDepartmentId();
    
  this.ServiceService.addInvoice(this.addInvoice).subscribe(
    (response) => {
      console.log('Invoice added successfully:', response);
    },
    (error) => {
      console.error('Error adding invoice:', error);
    }
  );
  this.snackBar.open('Invoice generated successfully!', 'Close', {
    duration: 3000,
  }

);
  }
  
 
}


submitInvoice(): void {
  this.ServiceService.addInvoice(this.addInvoice).subscribe(
    (response) => {
      console.log('Invoice added successfully:', response);
      this.visible = false; // Close the dialog box after successful submission
      window.location.reload();
    },
    (error) => {
      console.error('Error adding invoice:', error);
      // Handle error if needed
    }
  );
}





first: number = 0;
rows: number = 10;

onPageChange(event: PageEvent) {
  this.first = event.first || 0;
  this.rows = event.rows || 10;
}


getAllDepartmentIds(): void {
  this.ServiceService.getAllDepartmentIds().subscribe(ids => {
    console.log('Department IDs:', this.departmentData.departmentIds);

    this.departmentData.departmentIds = ids;
    
    this.getDepartmentNamesForIds(ids);
  });
}

getDepartmentNamesForIds(ids: number[]) {
  forkJoin(ids.map(id =>
    this.ServiceService.getDepartmentNamesForId(id).pipe(
      map((names: any[]) => { // Adjust the type here
        return names.map(obj => obj.departmentName);
      }),
      catchError(error => {
        console.error('Error fetching department names:', error);
        return of([]); // Use 'of' to return an observable with an empty array
      })
    )
  )).subscribe(namesArray => {
    const allNames: string[] = namesArray.reduce((acc: string[], names: string[]) => {
      return acc.concat(names);
    }, []);
    this.departmentData.departmentNames = allNames || [];
  }, error => {
    console.error('Error fetching department names:', error);
  });
}

onDepartmentIdChange(): void {
  const selectedId = this.departmentData.selectedDepartmentId;
  if (selectedId) {
    this.getDepartmentNamesForIds([selectedId]);
  } else {
    this.departmentData.departmentNames = []; // Clear department names if no ID is selected
  }
}

resetDepartmentId(): void {
  this.departmentData.selectedDepartmentId = null;
  this.departmentData.selectedDepartmentName = null;
  
}


loadDatesAndPeriods() {
  this.ServiceService.getDatesAndPeriods().subscribe(data =>{
       this.getDatesPeriods=data;
       
  });
}

getRemainingDays(): number {
  if (!this.selectedInvoicePeriod || !this.getDatesPeriods) {
    return 0; 
  }

  const selectedPeriod = this.getDatesPeriods.find(period => period.compareInvoicePeriod === this.selectedInvoicePeriod);
  if (!selectedPeriod || !selectedPeriod.submissionDate) {
    return 0; 
  }
  const submissionDate = new Date(selectedPeriod.submissionDate);
  return this.calculateRemainingDays(submissionDate, selectedPeriod.compareInvoicePeriod);
}

calculateRemainingDays(submissionDate: Date, compareInvoicePeriod: string): number {
  const today = new Date();
  const todayWithoutTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const submissionDateWithoutTime = new Date(submissionDate.getFullYear(), submissionDate.getMonth(), submissionDate.getDate());

  if (isNaN(submissionDateWithoutTime.getTime())) {
    console.error("submissionDate is not a valid date:", submissionDate);
    return 0; 
  }

  const inBetweenDays = Math.abs(Math.round((todayWithoutTime.getTime() - submissionDateWithoutTime.getTime()) / (1000 * 60 * 60 * 24)));

  switch (compareInvoicePeriod) {
    case 'Weekly':
      return 7 - inBetweenDays;
    case 'Fortnight':
      return 14 - inBetweenDays;
    case 'Monthly':
      return 30 - inBetweenDays;
    case 'Half-Yearly':
      return 182 - inBetweenDays;
    case 'Yearly':
      return 365 - inBetweenDays;
    default:
      return 0; 
  }
}

isGenerateButtonDisabled(): boolean {
  if (!this.selectedInvoicePeriod || !this.getDatesPeriods) {
    return true; // no invoice period is choosed
  }
  const existingPeriod = this.getDatesPeriods.find(period => period.compareInvoicePeriod === this.selectedInvoicePeriod);
  
  if (existingPeriod) {
    const submissionDate = new Date(existingPeriod.submissionDate);
    const remainingDays = this.calculateRemainingDays(submissionDate, existingPeriod.compareInvoicePeriod);
    return remainingDays > 0;
  }
  return false; //no existing period, enable the button
}



// loadDatesAndPeriods(): void {
//   this.ServiceService.getDatesAndPeriods().subscribe(
//     (data: DatePeriod[]) => {
//       this.getDatesPeriods = data.map(period => ({
//         ...period,
//         submissionDate: new Date(period.submissionDate) // Parse submissionDate as a Date object
//       }));
//       console.log('Dates and periods:', this.getDatesPeriods);
//       // Optionally, perform any additional processing or logic here
//       this.isGenerateButtonDisabled(); // Check if the button should be disabled after loading dates and periods
//     },
//     error => {
//       console.error('Error loading dates and periods:', error);
//       // Optionally, handle errors here
//     }
//   );
// }
}