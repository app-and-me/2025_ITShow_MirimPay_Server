export interface TossCardResponse {
  billingKey: string;
  customerKey: string;
  cardCompany: string;
  card: {
    number: string;
    cardType: string;
    ownerType: string;
  };
}

export interface TossPaymentResponse {
  paymentKey: string;
  orderId: string;
  status: string;
  totalAmount: number;
  balanceAmount: number;
  suppliedAmount: number;
  vat: number;
  cultureExpense: boolean;
  taxFreeAmount: number;
  taxExemptionAmount: number;
  cancels?: any[];
  isPartialCancelable: boolean;
  card?: {
    amount: number;
    issuerCode: string;
    acquirerCode: string;
    number: string;
    installmentPlanMonths: number;
    approveNo: string;
    useCardPoint: boolean;
    cardType: string;
    ownerType: string;
    acquireStatus: string;
    isInterestFree: boolean;
    interestPayer?: string;
  };
  virtualAccount?: any;
  secret?: string;
  mobilePhone?: any;
  giftCertificate?: any;
  transfer?: any;
  receipt?: {
    url: string;
  };
  checkout?: {
    url: string;
  };
  easyPay?: any;
  country: string;
  failure?: any;
  cashReceipt?: any;
  cashReceipts?: any;
  discount?: any;
}

export interface TossErrorResponse {
  code: string;
  message: string;
}
