export type CurrencyType = 'PKR' | 'USD';

export function formatPrice(amount: number, currency: CurrencyType): string {
  if (currency === 'PKR') {
    return `Rs. ${amount.toLocaleString('en-PK')}`;
  }
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function convertPrice(pkrAmount: number, currency: CurrencyType): number {
  if (currency === 'PKR') return pkrAmount;
  return pkrAmount / 278;
}
