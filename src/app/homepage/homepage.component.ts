import { COMPILER_OPTIONS, Component, OnInit } from '@angular/core';
import { DropdownFilterOptions } from 'primeng/dropdown';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ServiceService } from '../service.service';
import { Router } from '@angular/router';
import { Product } from '../product';
import { Country } from '../product';
import { Directive, ElementRef} from '@angular/core';
import { FileUpload, FileUploadEvent } from 'primeng/fileupload';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TableviewComponent } from '../tableview/tableview.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { empty } from 'rxjs';


@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
    

    isButtonDisabled: boolean = true;
    isDuplicate: boolean = false;


    addproductRequest: Product = {
        productID: 0,
        productName: '',
        country: '',
        invoicePeriod: '',
        scrapType: '',
        manCost: 0,
        materialCost: 0,
        estimateCost: null,
        localAmount: 0,   
        imageFileName: '',
        imageUrl: ''
    };
    
    imageFile: File | null = null;
   
    formSubmitted = false;

    invoicePeriod: string = '';
    periods = [
        { id:1, name: 'Weekly' },
        { id:2, name: 'Fortnight' },
        { id:3, name: 'Monthly' },
        { id:4, name: 'Half-Yearly' },
        { id:5, name: 'Yearly' }
    ];  
    lastSubmissionTime: Date | null = null;
    selectedPeriodId: number | null = null;
    
    scrapType: string = ''; 
    scraptypes = [
        { name: 'Ferrous' },
        { name: 'Non-Ferrous' }
    ];

    filterValue: string | undefined = '';
    countries: Country[] = []; 
    selectedCountry: string='';
    selectedImage: File | undefined; 

    constructor(
        private ServiceService: ServiceService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private router: Router,
        private el: ElementRef,
        private http: HttpClient,
        private snackBar: MatSnackBar, 
    ) {
        if (!el.nativeElement.querySelector('.required-asterisk')) {
            const asteriskElement = document.createElement('span');
            asteriskElement.className = 'required-asterisk';
            asteriskElement.style.color = 'red';
            el.nativeElement.appendChild(asteriskElement);
          }
    }
   
    ngOnInit() { 
        this.getCountries(); 
    }
   
    showTopLeft() {
      this.messageService.add({ key: 'tl', severity: 'info', summary: 'Info', detail: 'Your Estimate is Created Successfully' });
  }

    calculateEstimateCost() {
        if (this.addproductRequest.manCost != null && this.addproductRequest.materialCost != null) {
            this.addproductRequest.estimateCost = this.addproductRequest.manCost + this.addproductRequest.materialCost;
            this. countries.forEach(count =>{
              if(this.selectedCountry===count.country){
                this.addproductRequest.localAmount = (this.addproductRequest.estimateCost != null ? this.addproductRequest.estimateCost : 0) * count.currency;
              }
            });
        } else {
            this.addproductRequest.estimateCost = null;
        }
    }
    
    
    
    onSubmit1(): void {
        
        this.formSubmitted = true;
      
    }

    getCountries(): void {
        this.ServiceService.getCountries()
          .subscribe(countries => this.countries = countries);
      }

     
      onFileSelected(event: any) {
        if (event.target.files && event.target.files.length > 0) {
          this.selectedImage = event.target.files[0];
          // Check if selectedImage is not undefined before accessing its properties
          if (this.selectedImage) {
            this.addproductRequest.imageFileName = this.selectedImage.name;
          }
        }
      }
      
      
      onSubmit(): void {
        this.addproductRequest.invoicePeriod = this.invoicePeriod;
        this.addproductRequest.scrapType = this.scrapType;
        this.addproductRequest.country = this. selectedCountry;
        this.isButtonDisabled = true;
      
        const formData = new FormData();
        formData.append('productID', this.addproductRequest.productID.toString());
        formData.append('productName', this.addproductRequest.productName.toString());
        formData.append('country', this.addproductRequest.country.toString());
        formData.append('invoicePeriod', this.addproductRequest.invoicePeriod.toString());
        formData.append('scrapType', this.addproductRequest.scrapType.toString());
        formData.append('manCost', this.addproductRequest.manCost.toString());
        formData.append('materialCost', this.addproductRequest.materialCost.toString());
        formData.append('estimateCost', this.addproductRequest.estimateCost?.toString() ?? '');
        formData.append('localAmount', this.addproductRequest.localAmount.toString());
        // Append other form fields as needed
      
        if (this.selectedImage) {
          formData.append('image', this.selectedImage, this.selectedImage.name);
          formData.append('ImageFileName', this.selectedImage.name);
        }
      
        this.ServiceService.createProduct(formData)
          .subscribe(
            response => {
              console.log('Product created successfully:', response);
              this.isButtonDisabled = false;
            },
            error => {
              console.error('Error creating product:', error);
              this.isButtonDisabled = false;
            }
          );
          this.snackBar.open('Estimate generated successfully!', 'Close', {
            duration: 15000, 
          });
          
          this.reset();
      }
      
      reset(): void{
        this.addproductRequest = {
          productID: 0, 
          productName: '',
          country: '',
          invoicePeriod: '',
          scrapType: '',
          manCost: 0,
          materialCost:0,
          estimateCost: 0,
          localAmount: 0,
          imageFileName: '',
          imageUrl: ''
        };
      
      }
      
    }
  
      
      // onSubmitform() {
      //   if (this.imageFile) {
      //     // Set the image property of the product to the selected file
      //     this.addproductRequest.image = this.imageFile;
    
      //     // Call the addProduct method from the ProductService
      //     this.ServiceService.addProduct(this.addproductRequest).subscribe(
      //       response => {
      //         console.log('Product added successfully:', response);
      //         // Reset form fields or perform any other action upon successful addition
      //         this.addproductRequest = { 
      //           productID: 0,
      //           productName: '',
      //           country: '',
      //           invoicePeriod: '',
      //           scrapType: '',
      //           manCost: 0,
      //           materialCost: 0,
      //           estimateCost: null,
      //           localAmount: 0
      //         };
      //         this.imageFile = null;
      //       },
      //       error => {
      //         console.error('Error adding product:', error);
      //         // Handle error appropriately
      //       }
      //     );
      //   } else {
      //     console.error('Please select an image file.');
      //     // Handle case where no image file is selected
      //   }
      // }




