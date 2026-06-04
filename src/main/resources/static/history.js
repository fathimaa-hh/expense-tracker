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
document.getElementById(
  'welcomeMsg'
).textContent =

  `Hello, ${session.name}! Here is your complete expense history.`;


// ===============================
// 🌐 LOAD HISTORY
// ===============================
function loadHistory() {

  fetch(
    `http://localhost:8081/api/expenses/${session.email}`
  )

  .then(response => response.json())

  .then(expenses => {

    renderHistory(expenses);

  })

  .catch(error => {

    console.error(error);

    document.getElementById(
      'historyList'
    ).innerHTML = `

      <p class="note">
        Failed to load history.
      </p>

    `;

  });

}


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


  // ===============================
  // SORT NEWEST FIRST
  // ===============================
  expenses.sort((a, b) => {

    return new Date(b.expenseDate)
      -
      new Date(a.expenseDate);

  });


  // ===============================
  // RENDER
  // ===============================
  historyBox.innerHTML =

    expenses.map(expense => `

      <div class="subcard history-card">

        <div class="history-top">

          <h3>
            ${expense.title}
          </h3>

          <span class="history-badge">

            ${
              expense.groupName &&
              expense.groupName !== 'Personal'

              ? '👥 Group'

              : '💰 Personal'
            }

          </span>

        </div>


        <div class="history-amount">

          ₹${expense.amount}

        </div>


        <small>
          📂 Category:
          ${expense.category}
        </small>

        <small>
          📅 Date:
          ${expense.expenseDate}
        </small>

        <small>
          👤 Paid By:
          ${expense.createdBy}
        </small>

        <small>
          👥 Group:
          ${expense.groupName || 'Personal'}
        </small>

        <small>
          🔀 Split:
          ${expense.splitType || 'No Split'}
        </small>

        <small>
          👨‍👩‍👧 Members:
          ${expense.selectedMembers || 'Only You'}
        </small>

      </div>

    `).join('');

}


// ===============================
// 🚪 LOGOUT
// ===============================
document.getElementById(
  'logoutBtn'
)

.addEventListener('click', () => {

  localStorage.removeItem(
    'fs_session'
  );

  window.location = 'login.html';

});


// ===============================
// 🚀 INITIAL LOAD
// ===============================
loadHistory();