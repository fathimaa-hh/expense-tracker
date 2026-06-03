// ===============================
// 🔐 SESSION CHECK
// ===============================
const s = localStorage.getItem('fs_session');

if (!s) {
  window.location = 'login.html';
}

const session = JSON.parse(s);


// ===============================
// 🌐 LOAD EXPENSES
// ===============================
fetch(
  `http://localhost:8081/api/expenses/${session.email}`
)

.then(response => response.json())

.then(data => {

  generateReports(data);

})

.catch(error => {

  console.error(error);

});


// ===============================
// 📊 GENERATE REPORTS
// ===============================
function generateReports(expenses) {

  let total = 0;

  let personal = 0;

  let group = 0;

  const categoryTotals = {};

  const monthlyTotals = {};


  expenses.forEach(expense => {

    total += expense.amount;

    // =========================
    // PERSONAL/GROUP
    // =========================
    if (
      expense.groupName === 'Personal'
    ) {

      personal += expense.amount;

    } else {

      group += expense.amount;
    }

    // =========================
    // CATEGORY
    // =========================
    if (!categoryTotals[expense.category]) {

      categoryTotals[expense.category] = 0;
    }

    categoryTotals[expense.category] += expense.amount;


    // =========================
    // MONTH
    // =========================
    const month =
      expense.expenseDate.substring(0, 7);

    if (!monthlyTotals[month]) {

      monthlyTotals[month] = 0;
    }

    monthlyTotals[month] += expense.amount;

  });


  // =========================
  // SUMMARY
  // =========================
  document.getElementById(
    'totalExpenses'
  ).textContent =
    `₹ ${total.toFixed(2)}`;

  document.getElementById(
    'personalExpenses'
  ).textContent =
    `₹ ${personal.toFixed(2)}`;

  document.getElementById(
    'groupExpenses'
  ).textContent =
    `₹ ${group.toFixed(2)}`;


  // =========================
  // CATEGORY CHART
  // =========================
  new Chart(

    document.getElementById(
      'categoryChart'
    ),

    {
      type: 'pie',

      data: {

        labels:
          Object.keys(categoryTotals),

        datasets: [{
          data:
            Object.values(categoryTotals)
        }]
      }
    }
  );


  // =========================
  // MONTHLY CHART
  // =========================
  new Chart(

    document.getElementById(
      'monthlyChart'
    ),

    {
      type: 'bar',

      data: {

        labels:
          Object.keys(monthlyTotals),

        datasets: [{
          data:
            Object.values(monthlyTotals)
        }]
      }
    }
  );

}
