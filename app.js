const searchParams = new URLSearchParams(location.search)
// http://127.0.0.1:5500/?dueday=27&termyear=30&principal=93000&disbdate=2023-11-15&firstpaymentdate=2023-11-27&installment=600,600,600,600&intrates=0.0325,0.0365,0.051,0.0594

const disbdate = searchParams.get(`disbdate`);
const DISBURSEMENTDATE = new Date(disbdate);
console.log(DISBURSEMENTDATE);
const firstpaymentdate = searchParams.get(`firstpaymentdate`);
const PAYMENTFIRSTDATE = new Date(firstpaymentdate);
console.log(PAYMENTFIRSTDATE);
const PAYMENTDUEDAY = parseInt(searchParams.get(`dueday`));
const TermYear = parseInt(searchParams.get(`termyear`));
const Principal = parseInt(searchParams.get(`principal`));
const installments = searchParams.get(`installment`).split(`,`);
console.log(installments)
const IntRates = searchParams.get(`intrates`).split(`,`);
console.log(IntRates);

const PaymentAmount = [
  { from: 1, to: 12, installment: parseInt(installments.at(0)), IntRate: parseFloat(IntRates.at(0)) },
  { from: 3, to: 24, installment:  parseInt(installments.at(1)), IntRate: parseFloat(IntRates.at(1)) },
  { from: 25, to: 36, installment:  parseInt(installments.at(2)), IntRate: parseFloat(IntRates.at(2)) },
  { from: 37, to: 360, installment:  parseInt(installments.at(3)), IntRate: parseFloat(IntRates.at(3)) },
];

PaymentAmount.at(-1).to = 999;

const rows = CalculateInstallmentPlan(
  DISBURSEMENTDATE,
  PAYMENTFIRSTDATE,
  PAYMENTDUEDAY,
  TermYear,
  Principal,
  PaymentAmount
);

console.log(rows);
for (const row of rows) {
    document.querySelector(`tbody`).innerHTML += `<tr>
    <td>${row.countInstallment}</td>
    <td>${formatDate(row.thismonthpaymentdate)}</td>
    <td>${formatCurrency(row.PaymentAmount)}</td>
    <td>${formatCurrency(row.DeductPrincipal)}</td>
    <td>${formatCurrency(row.InterestDueAmount)}</td>
    <td>${formatCurrency(row.RemainingPrincipal)}</td>
    </tr>`;
}
