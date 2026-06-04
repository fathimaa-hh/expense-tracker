// ===============================
// 🔐 SESSION CHECK
// ===============================
const s = localStorage.getItem('fs_session');

if (!s) {

  window.location = 'login.html';

}

const session = JSON.parse(s);


// ===============================
// 🌐 LOAD ALL REPORT DATA
// ===============================
Promise.all([

  fetch(
    `http://localhost:8081/api/expenses/${session.email}`
  ).then(res => res.json()),

  fetch(
    `http://localhost:8081/api/settlements/user/${session.email}`
  ).then(res => res.json())

])

.then(([expenses, settlements]) => {

  console.log(expenses);

  console.log(settlements);

  updateSummaryCards(
    expenses,
    settlements
  );

  generateCategoryChart(expenses);

  generateMonthlyChart(expenses);

})

.catch(error => {

  console.error(error);

});


// ===============================
// 📊 SUMMARY CARDS
// ===============================
function updateSummaryCards(
  expenses,
  settlements
) {

  let totalSpent = 0;

  let pendingDues = 0;

  let food = 0;

  let rent = 0;

  let travel = 0;

  let shopping = 0;


  // ===============================
  // EXPENSE TOTALS
  // ===============================
  expenses.forEach(expense => {

    totalSpent += expense.amount || 0;

    const category =
      (expense.category || '')
      .toLowerCase();

    if (category.includes('food')) {

      food += expense.amount;

    }

    else if (category.includes('rent')) {

      rent += expense.amount;

    }

    else if (category.includes('travel')) {

      travel += expense.amount;

    }

    else if (category.includes('shopping')) {

      shopping += expense.amount;

    }

  });


  // ===============================
  // PENDING DUES
  // ===============================
  settlements.forEach(settlement => {

    if (
      settlement.status &&
      settlement.status.toLowerCase() === 'pending'
    ) {

      pendingDues += settlement.amount || 0;

    }

  });


  // ===============================
  // UPDATE UI
  // ===============================
  document.getElementById(
    'totalSpent'
  ).textContent =
    `₹${totalSpent.toFixed(2)}`;

  document.getElementById(
    'pendingDues'
  ).textContent =
    `₹${pendingDues.toFixed(2)}`;

  document.getElementById(
    'foodAmount'
  ).textContent =
    `₹${food.toFixed(2)}`;

  document.getElementById(
    'rentAmount'
  ).textContent =
    `₹${rent.toFixed(2)}`;

  document.getElementById(
    'travelAmount'
  ).textContent =
    `₹${travel.toFixed(2)}`;

  document.getElementById(
    'shoppingAmount'
  ).textContent =
    `₹${shopping.toFixed(2)}`;

}


// ===============================
// 🥧 CATEGORY PIE CHART
// ===============================
function generateCategoryChart(expenses) {

  const categoryTotals = {};

  expenses.forEach(expense => {

    const category =
      expense.category || 'Other';

    if (!categoryTotals[category]) {

      categoryTotals[category] = 0;
    }

    categoryTotals[category] += expense.amount;
  });

  const ctx =
    document
    .getElementById('expenseChart');

  new Chart(ctx, {

    type: 'pie',

    data: {

      labels: Object.keys(categoryTotals),

      datasets: [{

        data: Object.values(categoryTotals)

      }]
    },

    options: {

      responsive: true,

      maintainAspectRatio: false
    }

  });

}


// ===============================
// 📈 MONTHLY BAR GRAPH
// ===============================
function generateMonthlyChart(expenses) {

  const monthlyTotals = {};

  expenses.forEach(expense => {

    if (!expense.expenseDate) return;

    const month =
      expense.expenseDate.substring(0, 7);

    if (!monthlyTotals[month]) {

      monthlyTotals[month] = 0;
    }

    monthlyTotals[month] += expense.amount;
  });

  const ctx =
    document
    .getElementById('monthlyChart');

  new Chart(ctx, {

    type: 'bar',

    data: {

      labels: Object.keys(monthlyTotals),

      datasets: [{

        label: 'Monthly Expenses',

        data: Object.values(monthlyTotals)

      }]
    },

    options: {

      responsive: true,

      maintainAspectRatio: false
    }

  });

}