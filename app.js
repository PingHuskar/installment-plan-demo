let rows
const toUnixTS = (date) => {
  const c = new Date(date)
  return Math.floor(c.getTime() / 1000);
}
const updateTable = () => {
  
  document.querySelector(`tbody`).innerHTML = ``;

  const disbdate = document.getElementById(`disbdate`).value;
  const DISBURSEMENTDATE = new Date(disbdate);
  console.log(DISBURSEMENTDATE);
  const firstpaymentdate = document.getElementById(`firstpaymentdate`).value;
  const PAYMENTFIRSTDATE = new Date(firstpaymentdate);
  console.log(PAYMENTFIRSTDATE);

  console.log(toUnixTS(disbdate) < toUnixTS(PAYMENTFIRSTDATE));
  document.getElementById(`firstpaymentdateerr`).innerText = ``
  if (!(toUnixTS(disbdate) < toUnixTS(PAYMENTFIRSTDATE))) {
    document.getElementById(`firstpaymentdateerr`).innerText = `disbdate is not before paymentfirstdate`;
    return
  }
  const PAYMENTDUEDAY = parseInt(document.getElementById(`dueday`).value);
  const TermYear = parseInt(document.getElementById(`termyear`).value);
  const Principal = parseInt(document.getElementById(`principal`).value);
  document.getElementById(`principalerr`).innerText = ``;
  if (Principal <= 0) {
    document.getElementById(`principalerr`).innerText = `principal error`;
    return
  }
  const installments = document.getElementById(`installment`).value.split(`,`);
  console.log(installments);
  const IntRates = document.getElementById(`intrates`).value.split(`,`);
  console.log(IntRates);

  const Tos = document.getElementById(`tos`).value.split(`,`);
  console.log(Tos);

  const TosLen = Tos.length;
  console.log(TosLen);
  
  document.getElementById(`tiererr`).innerText = ``;
  
  if (!((installments.length === IntRates.length) && (TosLen === IntRates.length)))
    {
      document.getElementById(
        `tiererr`
      ).innerText = `No of Tier not Match ${installments.length}:${IntRates.length}:${TosLen}`;
      return;
    }
  
  let frommonth = 1;

  const PaymentAmount = [];
  for (let i = 0; i < TosLen; i++) {
    PaymentAmount.push({
      from: frommonth,
      to: parseInt(Tos.at(i)),
      installment: parseInt(installments.at(i)),
      IntRate: parseFloat(IntRates.at(i)),
    });
    frommonth = parseInt(Tos.at(i)) + 1;
  }

  PaymentAmount.at(-1).to = 999;

  rows = CalculateInstallmentPlan(
    DISBURSEMENTDATE,
    PAYMENTFIRSTDATE,
    PAYMENTDUEDAY,
    TermYear,
    Principal,
    PaymentAmount
  );

  document.getElementById(`termerr`).innerText = ``;
  if (TermYear * 12 < rows.length) {
    document.getElementById(`termerr`).innerText = `Overflow Term`;
    return
  }
  if (rows.at(-1).RemainingPrincipal != 0) {
    document.getElementById(`termerr`).innerText = `RemainingPrincipal Error`;
  }

  console.log(rows);
  for (const row of rows) {
    if (row.DeductPrincipal < 0) {
      document.getElementById(`termerr`).innerText += `\nPaymentAmount Error`;
    }
    document.querySelector(`tbody`).innerHTML += `<tr>
  <td>${row.countInstallment}</td>
  <td>${formatDate(row.thismonthpaymentdate)}</td>
  <td>${formatCurrency(row.PaymentAmount)}</td>
  <td>${formatCurrency(row.DeductPrincipal)}</td>
  <td>${formatCurrency(row.InterestDueAmount)}</td>
  <td>${formatCurrency(row.RemainingPrincipal)}</td>
  </tr>`;
  }
  google.charts.setOnLoadCallback(drawChart);
};
updateTable()