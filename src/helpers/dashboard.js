export function generateDateLabels() {
  const currentDate = new Date();
  const chartLabels = [];
  for (let i = 12; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setMonth(currentDate.getMonth() - i);
    const formattedDate = formatDate(date);
    chartLabels.push(formattedDate);
  }
  return chartLabels;
}

function formatDate(date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
}
