// ===============================
// 🔐 SESSION CHECK
// ===============================
const s = localStorage.getItem('fs_session');

if (!s) {
  window.location = 'login.html';
}

const session = JSON.parse(s);


// ===============================
// 👋 WELCOME MESSAGE
// ===============================
document.getElementById('welcomeMsg').textContent =
  `Welcome back, ${session.name}!`;


// ===============================
// 🌐 LOAD EXPENSES FROM BACKEND
// ===============================
fetch(`http://localhost:8081/api/expenses/${session.email}`)

.then(response => response.json())

.then(expenses => {

  console.log(expenses);

  updateDashboard(expenses);

})

.catch(error => {

  console.error(error);

  alert('Failed to load dashboard.');

});


// ===============================
// 📊 UPDATE DASHBOARD
// ===============================
function updateDashboard(expenses) {

  // =========================
  // TOTAL SPENT
  // =========================
  let totalSpent = 0;

  expenses.forEach(expense => {

    totalSpent += expense.amount;

  });

  document.getElementById('totalSpent').textContent =
    `₹${totalSpent}`;


  // =========================
  // TOTAL BILLS
  // =========================
  document.getElementById('totalBills').textContent =
    expenses.length;


  // =========================
  // LATEST CATEGORY
  // =========================
  if (expenses.length > 0) {

    const latestExpense =
      expenses[expenses.length - 1];

    document.getElementById('latestCategory').textContent =
      latestExpense.category;

  }


  // =========================
  // RECENT EXPENSES
  // =========================
  const recentBox =
    document.getElementById('recentExpenses');

  if (expenses.length === 0) {

    recentBox.innerHTML =
      'No expenses found.';

    return;
  }

  recentBox.innerHTML =
    [...expenses]
    .reverse()
    .slice(0, 5)
    .map(expense => `

      <div class="subcard">

        <strong>
          ${expense.title}
        </strong>

        <br><br>

        ₹${expense.amount}

        <br><br>

        <small>
          📂 ${expense.category}
        </small>

        <br>

        <small>
          📅 ${expense.expenseDate}
        </small>

      </div>

    `).join('');
}


// ===============================
// 🚪 LOGOUT
// ===============================
document.getElementById('logoutBtn')
.addEventListener('click', () => {

  localStorage.removeItem('fs_session');

  window.location = 'login.html';

});