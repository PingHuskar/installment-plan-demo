function formatCurrency(number) {
  const n = parseFloat(number);
  return n.toFixed(2).replace(/./g, function (c,i, a) {
    return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
  });
}


function formatDate(date) {
    // return date
    date = new Date(date)
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
}