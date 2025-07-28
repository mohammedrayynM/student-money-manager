// Track chart instances
let balanceChart, expenseChart;

// Update both charts
function refreshCharts() {
  const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
  updateBalanceChart(transactions);
  updateExpenseChart(transactions);
}

// 1. Balance Chart (Income vs Expenses vs Remaining)
function updateBalanceChart(transactions) {
  const ctx = document.getElementById('balance-chart').getContext('2d');
  
  // Calculate totals
  const totals = transactions.reduce((acc, t) => {
    acc[t.type] = (acc[t.type] || 0) + t.amount;
    return acc;
  }, {});

  const balance = (totals.income || 0) - (totals.expense || 0);

  // Destroy old chart
  if (balanceChart) balanceChart.destroy();

  // Create new chart
  balanceChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Income', 'Expenses', 'Balance'],
      datasets: [{
        label: 'Amount (₹)',
        data: [
          totals.income || 0,
          totals.expense || 0,
          balance
        ],
        backgroundColor: [
          '#4CAF50', // Income (green)
          '#FF6384', // Expenses (red)
          '#36A2EB'  // Balance (blue)
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Your Current Balance'
        }
      }
    }
  });
}

// 2. Expense Categories Chart
function updateExpenseChart(transactions) {
  const ctx = document.getElementById('expense-chart').getContext('2d');
  
  // Group expenses by category
  const categories = {};
  transactions.forEach(t => {
    if (t.type === 'expense') {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    }
  });

  // Destroy old chart
  if (expenseChart) expenseChart.destroy();

  // Create new chart
  expenseChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(categories),
      datasets: [{
        data: Object.values(categories),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', 
          '#4CAF50', '#9966FF', '#FF9F40'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Where Your Money Goes'
        }
      }
    }
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', refreshCharts);