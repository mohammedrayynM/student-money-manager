// Load transactions from localStorage
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// DOM Elements
const transactionForm = document.getElementById("transaction-form");
const transactionsBody = document.getElementById("transactions-body");
const balanceElement = document.getElementById("balance");

// Add Transaction
transactionForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const type = document.getElementById("type").value;
  const category = document.getElementById("category").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const paymentMethod = document.getElementById("payment-method").value;

  if (!type || !category || isNaN(amount)) {
    alert("Please fill all fields!");
    return;
  }

  const transaction = {
    id: Date.now(),
    type,
    category,
    amount,
    paymentMethod,
    date: new Date().toLocaleDateString()
  };

  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  
  updateUI();
  transactionForm.reset();
});

// Update UI (Balance & Transactions List)
function updateUI() {
  // Calculate Balance
  const balance = transactions.reduce((total, t) => {
    return t.type === "income" ? total + t.amount : total - t.amount;
  }, 0);
  balanceElement.textContent = `₹${balance.toFixed(2)}`;

  // Update Transactions Table
  transactionsBody.innerHTML = transactions.map(t => `
    <tr>
      <td>${t.type}</td>
      <td>${t.category}</td>
      <td>₹${t.amount.toFixed(2)}</td>
      <td>${t.paymentMethod}</td>
      <td><button onclick="deleteTransaction(${t.id})"><i class="fas fa-trash"></i></button></td>
    </tr>
  `).join("");
}

// Delete Transaction
function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  updateUI();
}
// After adding a transaction:
function addTransaction() {
  // ... your existing code ...
  refreshCharts(); // Add this line
}

// After deleting a transaction:
function deleteTransaction(id) {
  // ... your existing code ...
  refreshCharts(); // Add this line
}





// Initialize
updateUI();
// Replace localStorage with API calls
async function fetchTransactions() {
  const res = await fetch("http://localhost:3001/api/transactions");
  return await res.json();
}

async function addTransaction(transaction) {
  await fetch("http://localhost:3001/api/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transaction),
  });
}