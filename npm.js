function daysDifference(d0, d1) {
  var diff = new Date(+d1).setHours(12) - new Date(+d0).setHours(12);
  return Math.round(diff / 8.64e7);
}

const lastday = function (y, m) {
    return new Date(y, m + 1, 0).getDate();
};

const round = (num) => {
    return Math.round(num*100)/100
}

const getThisPayment = (PaymentAmount, installmentno) => {
    for (let pay of PaymentAmount) {
        if (installmentno >= pay.from && installmentno <= pay.to) {
            return pay
        }
    }
};

const CalculateInstallmentPlan = (
  DISBURSEMENTDATE,
  PAYMENTFIRSTDATE,
  PAYMENTDUEDAY,
  TermYear,
  Principal,
  PaymentAmount
) => {
  const rows = [];
  let date = PAYMENTFIRSTDATE;
  let RemainingPrincipal = Principal;
  let month = date.getMonth();
  let year = date.getFullYear();

  let countInstallment = 0;
  let prevmonthpaymentdate = PAYMENTFIRSTDATE;
  let daysDifferences = daysDifference(DISBURSEMENTDATE, PAYMENTFIRSTDATE);
  let InterestDueAmount = round(
    ((RemainingPrincipal * daysDifferences) / 365) * PaymentAmount.at(0).IntRate
  );
  let DeductPrincipal = round(
    PaymentAmount.at(0).installment - InterestDueAmount
  );
  RemainingPrincipal = RemainingPrincipal - DeductPrincipal;

  rows.push({
    countInstallment: countInstallment + 1,
    prevmonthpaymentdate: null,
    thismonthpaymentdate: PAYMENTFIRSTDATE.toLocaleDateString(),
    daysDifferences: daysDifferences,
    PaymentAmount: PaymentAmount.at(0).installment,
    InterestDueAmount: InterestDueAmount,
    DeductPrincipal,
    RemainingPrincipal,
  });
  countInstallment++;

  while (true) {
    if (countInstallment + 1 > TermYear * 12) break;
    month++;
    if (month >= 12) {
      month -= 12;
      year++;
    }
    let EOMONTH = lastday(year, month);
    let thismonthpaymentdate;
    if (PAYMENTDUEDAY <= EOMONTH) {
      thismonthpaymentdate = new Date(year, month, PAYMENTDUEDAY);
    } else {
      thismonthpaymentdate = new Date(year, month, EOMONTH);
    }
    daysDifferences = daysDifference(
      prevmonthpaymentdate,
      thismonthpaymentdate
    );
    let thispayment = getThisPayment(PaymentAmount, countInstallment + 1);
    InterestDueAmount = round(
      ((RemainingPrincipal * daysDifferences) / 365) * thispayment.IntRate
    );
    DeductPrincipal = round(thispayment.installment - InterestDueAmount);

    if (DeductPrincipal >= RemainingPrincipal) {
      DeductPrincipal = RemainingPrincipal;
      let lastPaymentAmount = round(RemainingPrincipal + InterestDueAmount);
      rows.push({
        countInstallment: countInstallment + 1,
        prevmonthpaymentdate: prevmonthpaymentdate.toLocaleDateString(),
        thismonthpaymentdate: thismonthpaymentdate.toLocaleDateString(),
        daysDifferences: daysDifferences,
        PaymentAmount: lastPaymentAmount,
        InterestDueAmount,
        DeductPrincipal,
        RemainingPrincipal: 0,
      });
      break;
    } else {
      RemainingPrincipal = round(RemainingPrincipal - DeductPrincipal);
      rows.push({
        countInstallment: countInstallment + 1,
        prevmonthpaymentdate: prevmonthpaymentdate.toLocaleDateString(),
        thismonthpaymentdate: thismonthpaymentdate.toLocaleDateString(),
        daysDifferences: daysDifferences,
        PaymentAmount: thispayment.installment,
        InterestDueAmount: InterestDueAmount,
        DeductPrincipal,
        RemainingPrincipal,
      });
    }
    prevmonthpaymentdate = thismonthpaymentdate;
    countInstallment++;
  }
  return rows;
};
