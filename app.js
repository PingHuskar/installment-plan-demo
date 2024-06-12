const DISBURSEMENTDATE = new Date(2023, 11 - 1, 24);
const PAYMENTFIRSTDATE = new Date(2023, 11 - 1, 24);
const PAYMENTDUEDAY = 30;
const TermYear = 30;
const Principal = 900000;

const PaymentAmount = [
  { from: 1, to: 12, installment: 4900, IntRate: 0.0494 },
  { from: 3, to: 24, installment: 4900, IntRate: 0.0494 },
  { from: 25, to: 36, installment: 4900, IntRate: 0.0494 },
  { from: 37, to: 360, installment: 6100, IntRate: 0.0625 },
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
    <td>${row.thismonthpaymentdate}</td>
    <td>${row.PaymentAmount}</td>
    <td>${row.DeductPrincipal}</td>
    <td>${row.InterestDueAmount}</td>
    <td>${row.RemainingPrincipal}</td>
    </tr>`;
}
