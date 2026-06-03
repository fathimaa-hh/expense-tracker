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
  `Hello, ${session.name}! Here is your expense history.`;


// ===============================
// 🌐 LOAD HISTORY
// ===============================
fetch(`http://localhost:8081/api/expenses/${session.email}`)

.then(response => response.json())

.then(expenses => {

  renderHistory(expenses);

})

.catch(error => {

  console.error(error);

  alert('Failed to load history.');

});


// ===============================
// 📜 RENDER HISTORY
// ===============================
function renderHistory(expenses) {

  const historyBox =
    document.getElementById('historyList');

  if (expenses.length === 0) {

    historyBox.innerHTML = `
      <p class="note">
        No expense history found.
      </p>
    `;

    return;
  }

  historyBox.innerHTML =
    [...expenses]
    .reverse()
    .map(expense => `

      <div class="subcard">

        <h3>
          ${expense.title}
        </h3>

        <p>
          💰 Amount:
          ₹${expense.amount}
        </p>

        <p>
          📂 Category:
          ${expense.category}
        </p>

        <p>
          📅 Date:
          ${expense.expenseDate}
        </p>

        <p>
          👥 Group:
          ${expense.groupName || 'Personal'}
        </p>

        <p>
          🔀 Split:
          ${expense.splitType}
        </p>

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