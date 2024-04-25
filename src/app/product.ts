export interface Product {
    productID: number,
    productName: String,
    country: string,
    invoicePeriod: string,
    scrapType: string,
    manCost: number,
    materialCost: number,
    estimateCost: number|null,
    localAmount: number,
    imageFileName: string,
    imageUrl: string
}

export interface Country{
    country: string
    currency:number
}


export interface DepartmentDropdownData{
    departmentIds: number[];
    departmentNames: string[];
    selectedDepartmentId: number | null;
    selectedDepartmentName: string | null;
}

export interface Invoice{
    invoiceId: string,
    invoicePeriod: string,
    departmentId: number,
    departmentName: String,
    totalUSDAmount: number
}

export interface DatePeriod{
    submissionDate: Date,
    compareInvoicePeriod: string
}