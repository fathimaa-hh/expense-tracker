// ===============================
// 🔐 SESSION CHECK
// ===============================
const s = localStorage.getItem('fs_session');

if (!s) {
  window.location = 'login.html';
}

const session = JSON.parse(s);


// ===============================
// 📦 ELEMENTS
// ===============================
const pendingList =
  document.getElementById('pendingList');

const completedList =
  document.getElementById('completedList');


// ===============================
// 🌐 LOAD SETTLEMENTS
// ===============================
function loadSettlements() {

  fetch(
    `http://localhost:8081/api/settlements/user/${session.email}`
  )

  .then(response => response.json())

  .then(data => {

    renderSettlements(data);

  })

  .catch(error => {

    console.error(error);

    pendingList.innerHTML =
      'Failed to load settlements.';

  });

}


// ===============================
// 🧾 RENDER SETTLEMENTS
// ===============================
function renderSettlements(settlements) {

  const pending =
    settlements.filter(
      s => s.status.toLowerCase() === 'pending'
    );

  const completed =
    settlements.filter(
      s => s.status.toLowerCase() === 'completed'
    );

  // ===============================
  // PENDING
  // ===============================
  if (pending.length === 0) {

    pendingList.innerHTML =
      '<p class="note">No pending dues.</p>';

  } else {

    pendingList.innerHTML =
      pending.map(item => `

        <div class="subcard">

          <strong>
            ${item.expenseTitle}
          </strong>

          <br><br>

          💰 ₹${item.amount}

          <br><br>

          👤 Pay To:
          ${item.receiver}

          <br><br>

          👥 Group:
          ${item.groupName}

          <br><br>

          <small>
            Status:
            ${item.status}
          </small>

          <br><br>

          <button
            class="btn"
            onclick="settlePayment(${item.id})"
          >
            ✅ Settle
          </button>

        </div>

      `).join('');
  }


  // ===============================
  // COMPLETED
  // ===============================
  if (completed.length === 0) {

    completedList.innerHTML =
      '<p class="note">No completed settlements.</p>';

  } else {

    completedList.innerHTML =
      completed.map(item => `

        <div class="subcard">

          <strong>
            ${item.expenseTitle}
          </strong>

          <br><br>

          💰 ₹${item.amount}

          <br><br>

          👤 Paid To:
          ${item.receiver}

          <br><br>

          👥 Group:
          ${item.groupName}

          <br><br>

          <small style="color:green;">
            ✅ Completed
          </small>

        </div>

      `).join('');
  }

}


// ===============================
// ✅ SETTLE PAYMENT
// ===============================
function settlePayment(id) {

  fetch(
    `http://localhost:8081/api/settlements/${id}`,
    {
      method: 'PUT'
    }
  )

  .then(response => response.json())

  .then(data => {

    alert('Settlement completed!');

    loadSettlements();

  })

  .catch(error => {

    console.error(error);

    alert('Failed to settle payment.');

  });

}


// ===============================
// 🚀 INITIAL LOAD
// ===============================
loadSettlements();