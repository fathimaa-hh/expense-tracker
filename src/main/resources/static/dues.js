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
      '<p class="note">Failed to load settlements.</p>';

  });

}


// ===============================
// 🧾 RENDER SETTLEMENTS
// ===============================
function renderSettlements(settlements) {

  const pending =
    settlements.filter(
      item =>
        item.status.toLowerCase() === 'pending'
    );

  const completed =
    settlements.filter(
      item =>
        item.status.toLowerCase() === 'completed'
    );


  // ===============================
  // PENDING LIST
  // ===============================
  if (pending.length === 0) {

    pendingList.innerHTML =
      '<p class="note">No pending dues.</p>';

  }

  else {

    pendingList.innerHTML =
      pending.map(item => `

        <div class="subcard">

          <strong>
            ${item.expenseTitle}
          </strong>

          <br><br>

          💸 <b>${item.payer}</b>

          owes

          <b>${item.receiver}</b>

          <br><br>

          💰 ₹${item.amount}

          <br><br>

          👥 Group:
          ${item.groupName}

          <br><br>

          <button
            class="btn"
            onclick="openPaymentPopup(
              ${item.id},
              '${item.receiver}',
              ${item.amount}
            )"
          >
            Pay Now
          </button>

        </div>

      `).join('');
  }


  // ===============================
  // COMPLETED LIST
  // ===============================
  if (completed.length === 0) {

    completedList.innerHTML =
      '<p class="note">No completed settlements.</p>';

  }

  else {

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
// 💳 DEMO PAYMENT POPUP
// ===============================
function openPaymentPopup(
  id,
  receiver,
  amount
) {

  const confirmPay = confirm(

    `Demo Payment\n\n` +

    `Pay ₹${amount} to ${receiver} ?`

  );

  if (confirmPay) {

    alert(
      '✅ Demo Payment Successful!'
    );

    markAsPaid(id);
  }

}


// ===============================
// ✅ MARK AS PAID
// ===============================
function markAsPaid(id) {

  fetch(
    `http://localhost:8081/api/settlements/pay/${id}`,
    {
      method: 'PUT'
    }
  )

  .then(response => response.json())

  .then(data => {

    alert('Settlement completed.');

    loadSettlements();

  })

  .catch(error => {

    console.error(error);

    alert('Failed to update.');

  });

}


// ===============================
// 🚀 INITIAL LOAD
// ===============================
loadSettlements();