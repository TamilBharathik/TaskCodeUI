import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Product, Invoice, DatePeriod } from './product';
import { Observable, of, throwError } from 'rxjs';
import { Country } from './product';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  baseApiUrl: string = "http://localhost:5243/api/Product";
  countryurl: string = "http://localhost:5243/api/countries";
  apiUrl: string = "http://localhost:5243/api";

  private totalAmount: number = 0;
  constructor(private http: HttpClient) { }

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseApiUrl + '/GetAll');
  }

  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(this.countryurl);
  }


  // addProduct(product: Product): Observable<any> {
  //   return this.http.post<any>(this.baseApiUrl, product);
  // }

  //   addProduct(product: Product): Observable<any> {
  //     let queryString=`?ProductID=${product.productID}&ProductName=${product.productName}&country=${product.country}&InvoicePeriod=${product.invoicePeriod}&ScrapType=${product.scrapType}&ManCost=${product.manCost}&MaterialCost=${product.materialCost}&EstimateCost=${product.estimateCost}&LocalAmount=${product.localAmount}&ImageBase64=nil`
  //   return this.http.post<any>(this.baseApiUrl+queryString,product);
  // }

  // createProduct(productData: any): Observable<any> {
  //   return this.http.post<any>(`${this.baseApiUrl}/create`, productData);
  // }
  createProduct(productData: any): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/Create`, productData);
  }
  // addProduct(product: FormData): Observable<any> {
  //   return this.http.post<any>(`${this.baseApiUrl}/Create`, product);
  // }

  createInvoice(invoiceData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/invoice`, invoiceData);
  }

  getTotalAmount() {
    return this.totalAmount;
  }

  // getAllDepartmentIds() {
  //   return this.http.get<number[]>(`${this.apiUrl}/ids`);
  // }
  getAllDepartmentIds(): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/Department/ids`);
  }
  getDepartmentNamesForId(id: number) {
    return this.http.get<string[]>(`${this.apiUrl}/Department/${id}/names`);
  }
  addInvoice(addinvoice:Invoice):Observable<Invoice[]>
  {
    addinvoice.invoiceId='00000000-0000-0000-0000-000000000000';
    return this.http.post<Invoice[]>(this.apiUrl+'/Invoice',addinvoice);
  }

  getDatesAndPeriods(): Observable<DatePeriod[]> {
    return this.http.get<DatePeriod[]>('http://localhost:5243/api/Submission/submission-dates-and-periods');
  }
}





// .pipe(
//   catchError(this.handleError)
// );
// }
// private handleError(error: HttpErrorResponse) {
// if (error.error instanceof ErrorEvent) {
//   // A client-side or network error occurred. Handle it accordingly.
//   console.error('An error occurred:', error.error.message);
// } else {
//   // The backend returned an unsuccessful response code.
//   // The response body may contain clues as to what went wrong.
//   console.error(
//     `Backend returned code ${error.status}, ` +
//     `body was: ${error.error}`);
// }
// // Return an observable with a user-facing error message.
// return throwError('Something bad happened; please try again later.');




// addProduct(addProductRequest: Product): Observable<any> {
//   addProductRequest.productID = 0;

//   return this.http.post(this.baseApiUrl + '/Create', addProductRequest).pipe(
//       tap((response: any) => {
//         // Log the response from the server
//         console.log('Response from server:', response);
       
//         // Check if the response contains the details of the added booking
//         if (response && response.success) {
//           console.log('Booking added successfully.');
//         } else {
//           console.error('Failed to add booking.');
//         }
//       }),
//       catchError((error: any) => {
//         // Log and handle any errors that occur during the HTTP request
//         console.error('Error adding booking:', error);
//         // Check if the error is an HttpErrorResponse
//         if (error instanceof HttpErrorResponse) {
//           console.error('HTTP error status:', error.status);
//           console.error('HTTP error message:', error.message);
//         } else {
//           console.error('Non-HTTP error:', error);
//         }
//         return throwError(error); // Rethrow the error to be caught by the caller
//       })
//     );
// }