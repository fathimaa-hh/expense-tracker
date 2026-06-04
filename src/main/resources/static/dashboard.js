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
  
}

// ===============================
// 📊 LOAD ANALYTICS
// ===============================

function loadAnalytics() {

    fetch(
        `http://localhost:8081/api/analytics/${session.email}`
    )

    .then(response => response.json())

    .then(data => {

        document.getElementById(
            'budgetAmount'
        ).textContent =
            `₹${data.budget}`;

        document.getElementById(
            'spentAmount'
        ).textContent =
            `₹${data.totalSpent}`;

        document.getElementById(
            'remainingAmount'
        ).textContent =
            `₹${data.remaining}`;

        // =========================
        // WARNING
        // =========================

        if (
            data.warning &&
            data.warning !== ""
        ) {

            const warningBox =
                document.getElementById(
                    'budgetWarning'
                );

            warningBox.style.display =
                'block';

            warningBox.innerHTML =
                data.warning;

            // popup warning
            alert(data.warning);
        }

    })

    .catch(error => {

        console.error(error);

    });

}

loadAnalytics();


// ===============================
// 🚪 LOGOUT
// ===============================
document.getElementById('logoutBtn')
.addEventListener('click', () => {

  localStorage.removeItem('fs_session');

  window.location = 'login.html';

});