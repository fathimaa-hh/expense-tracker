// ===============================
// 🔐 SESSION CHECK
// ===============================

const sessionData =
  localStorage.getItem("fs_session");

if (!sessionData) {

  window.location = "login.html";

}

const session =
  JSON.parse(sessionData);

document.getElementById("welcomeMsg")
.textContent =
  `Hello, ${session.name}! Here's your expense analytics.`;



// ===============================
// 📦 LOAD ALL BILLS
// ===============================

const allBills =
  JSON.parse(localStorage.getItem("fs_bills")) || [];



// ===============================
// 👤 FILTER USER RELATED BILLS
// ===============================

const userBills = allBills.filter(bill => {

  // Personal expense created by user
  if (
    bill.createdBy === session.email &&
    !bill.isSplit
  ) {
    return true;
  }

  // Group split member
  if (
    bill.selectedMembers &&
    bill.selectedMembers.includes(session.email)
  ) {
    return true;
  }

  return false;

});



// ===============================
// 📊 SUMMARY VARIABLES
// ===============================

let totalExpense = 0;

let personalExpense = 0;

let groupExpense = 0;



// ===============================
// 📂 CATEGORY DATA
// ===============================

const categoryTotals = {};



// ===============================
// 📈 TREND DATA
// ===============================

const trendData = {};



// ===============================
// 🧾 PROCESS BILLS
// ===============================

userBills.forEach(bill => {

  let amount = Number(bill.amount);

  let finalAmount = amount;

  let expenseType = "Personal";


  // Split calculation
  if (
    bill.isSplit &&
    bill.selectedMembers &&
    bill.selectedMembers.length > 0
  ) {

    finalAmount =
      amount / bill.selectedMembers.length;

    expenseType = "Group";

    groupExpense += finalAmount;

  }

  else {

    personalExpense += finalAmount;

  }


  // Total
  totalExpense += finalAmount;


  // Category
  if (!categoryTotals[bill.category]) {

    categoryTotals[bill.category] = 0;

  }

  categoryTotals[bill.category] += finalAmount;


  // Trend
  if (!trendData[bill.date]) {

    trendData[bill.date] = 0;

  }

  trendData[bill.date] += finalAmount;

});



// ===============================
// 💰 UPDATE SUMMARY CARDS
// ===============================

document.getElementById("totalExpenseValue")
.textContent =
  `₹ ${totalExpense.toFixed(2)}`;

document.getElementById("personalExpenseValue")
.textContent =
  `₹ ${personalExpense.toFixed(2)}`;

document.getElementById("groupExpenseValue")
.textContent =
  `₹ ${groupExpense.toFixed(2)}`;



// ===============================
// 🥧 CATEGORY CHART
// ===============================

const categoryCanvas =
  document.getElementById("categoryChart");

new Chart(categoryCanvas, {

  type: "pie",

  data: {

    labels:
      Object.keys(categoryTotals),

    datasets: [

      {

        data:
          Object.values(categoryTotals)

      }

    ]

  },

  options: {

    responsive: true

  }

});



// ===============================
// 📈 TREND CHART
// ===============================

const trendCanvas =
  document.getElementById("trendChart");

new Chart(trendCanvas, {

  type: "line",

  data: {

    labels:
      Object.keys(trendData),

    datasets: [

      {

        label: "Expense Amount",

        data:
          Object.values(trendData),

        fill: false,

        tension: 0.3

      }

    ]

  },

  options: {

    responsive: true

  }

});



// ===============================
// 📊 PERSONAL VS GROUP CHART
// ===============================

const comparisonCanvas =
  document.getElementById("comparisonChart");

new Chart(comparisonCanvas, {

  type: "doughnut",

  data: {

    labels: [
      "Personal",
      "Group"
    ],

    datasets: [

      {

        data: [
          personalExpense,
          groupExpense
        ]

      }

    ]

  },

  options: {

    responsive: true

  }

});



// ===============================
// 🧾 EXPENSE TABLE
// ===============================

const tableBody =
  document.querySelector(
    "#expenseTable tbody"
  );



// No data
if (userBills.length === 0) {

  tableBody.innerHTML = `

    <tr>

      <td colspan="5">

        No expenses found.

      </td>

    </tr>

  `;

}

else {

  const sortedBills =
    [...userBills].reverse();


  sortedBills.forEach(bill => {

    let amount =
      Number(bill.amount);

    let displayAmount =
      amount;

    let type =
      "Personal";


    if (
      bill.isSplit &&
      bill.selectedMembers &&
      bill.selectedMembers.length > 0
    ) {

      displayAmount =
        amount / bill.selectedMembers.length;

      type = "Group";

    }


    const row =
      document.createElement("tr");


    row.innerHTML = `

      <td>
        ${bill.date}
      </td>

      <td>
        ${bill.category}
      </td>

      <td>
        ${bill.title}
      </td>

      <td>
        ${type}
      </td>

      <td>
        ₹ ${displayAmount.toFixed(2)}
      </td>

    `;

    tableBody.appendChild(row);

  });

}



// ===============================
// 🚪 LOGOUT
// ===============================

document.getElementById("logoutBtn")
.addEventListener("click", () => {

  localStorage.removeItem("fs_session");

  window.location =
    "login.html";

});