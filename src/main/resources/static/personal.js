// ===============================
// 🔐 SESSION CHECK
// ===============================
const s =
  localStorage.getItem('fs_session');

if (!s) {

  window.location =
    'login.html';
}

const session =
  JSON.parse(s);


// ===============================
// 🌐 LOAD PERSONAL SUMMARY
// ===============================
function loadPersonalSummary() {

  fetch(

    `http://localhost:8081/api/personal/summary/${session.email}`

  )

  .then(response => response.json())

  .then(data => {

    document.getElementById(
      'personalExpense'
    ).textContent =

      `₹${data.personalExpense.toFixed(2)}`;


    document.getElementById(
      'completedExpense'
    ).textContent =

      `₹${data.completedGroupExpense.toFixed(2)}`;


    document.getElementById(
      'pendingPay'
    ).textContent =

      `₹${data.pendingToPay.toFixed(2)}`;


    document.getElementById(
      'moneyReceive'
    ).textContent =

      `₹${data.moneyToReceive.toFixed(2)}`;


    document.getElementById(
      'netExpense'
    ).textContent =

      `₹${data.netExpense.toFixed(2)}`;

  })

  .catch(error => {

    console.error(error);

    alert(
      'Failed to load personal summary.'
    );

  });

}


// ===============================
// 🚀 INITIAL LOAD
// ===============================
loadPersonalSummary();