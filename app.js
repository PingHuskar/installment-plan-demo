const DISBURSEMENTDATE = new Date(2023, 11 - 1, 15);
const PAYMENTFIRSTDATE = new Date(2023, 11 - 1, 27);
const PAYMENTDUEDAY = 27;
const TermYear = 30;
const Principal = 93000;

const PaymentAmount = [
  { from: 1, to: 12, installment: 600, IntRate: 0.0325 },
  { from: 3, to: 24, installment: 600, IntRate: 0.0365 },
  { from: 25, to: 36, installment: 600, IntRate: 0.051 },
  { from: 37, to: 360, installment: 600, IntRate: 0.0594 },
];

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
