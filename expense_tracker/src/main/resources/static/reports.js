// ===============================
// 🔐 SESSION CHECK
// ===============================
const s = localStorage.getItem('fs_session');

if (!s) {
  window.location = 'login.html';
}

const session = JSON.parse(s);


// ===============================
// 👋 WELCOME
// ===============================
document.getElementById('welcomeMsg').textContent =
  `Hello, ${session.name}! Here's your expense analytics.`;


// ===============================
// 🌐 LOAD EXPENSES FROM BACKEND
// ===============================
fetch(`http://localhost:8081/api/expenses/${session.email}`)

.then(response => response.json())

.then(expenses => {

  loadReports(expenses);

})

.catch(error => {

  console.error(error);

  alert('Failed to load reports.');

});


// ===============================
// 📊 LOAD REPORTS
// ===============================
function loadReports(expenses) {

  const tableBody =
    document.querySelector('#expenseTable tbody');


  // =========================
  // EMPTY CASE
  // =========================
  if (expenses.length === 0) {

    tableBody.innerHTML = `
      <tr>
        <td colspan="4">
          No expenses found.
        </td>
      </tr>
    `;

    return;
  }


  // =========================
  // CATEGORY TOTALS
  // =========================
  const categoryTotals = {};

  expenses.forEach(expense => {

    if (!categoryTotals[expense.category]) {

      categoryTotals[expense.category] = 0;
    }

    categoryTotals[expense.category] += expense.amount;

  });


  // =========================
  // MONTHLY TREND
  // =========================
  const trendData = {};

  expenses.forEach(expense => {

    const date =
      expense.expenseDate;

    if (!trendData[date]) {

      trendData[date] = 0;
    }

    trendData[date] += expense.amount;

  });


  // =========================
  // PIE CHART
  // =========================
  const categoryCtx =
    document.getElementById('categoryChart');

  new Chart(categoryCtx, {

    type: 'pie',

    data: {

      labels: Object.keys(categoryTotals),

      datasets: [{

        data: Object.values(categoryTotals)

      }]
    },

    options: {
      responsive: true
    }

  });


  // =========================
  // LINE CHART
  // =========================
  const trendCtx =
    document.getElementById('trendChart');

  new Chart(trendCtx, {

    type: 'line',

    data: {

      labels: Object.keys(trendData),

      datasets: [{

        label: 'Amount Spent',

        data: Object.values(trendData),

        fill: false,

        tension: 0.3

      }]
    },

    options: {
      responsive: true
    }

  });


  // =========================
  // TABLE DATA
  // =========================
  tableBody.innerHTML = '';

  [...expenses]
  .reverse()
  .forEach(expense => {

    const row =
      document.createElement('tr');

    row.innerHTML = `

      <td>
        ${expense.expenseDate}
      </td>

      <td>
        ${expense.category}
      </td>

      <td>
        ${expense.title}
      </td>

      <td>
        ₹${expense.amount}
      </td>

    `;

    tableBody.appendChild(row);

  });

}


// ===============================
// 🚪 LOGOUT
// ===============================
document.getElementById('logoutBtn')
.addEventListener('click', () => {

  localStorage.removeItem('fs_session');

  window.location = 'login.html';

});