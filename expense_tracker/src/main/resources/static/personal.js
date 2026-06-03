// =========================
// 🔐 SESSION CHECK
// =========================
const s = localStorage.getItem('fs_session');

if (!s) {
  window.location = 'login.html';
}

const session = JSON.parse(s);

document.getElementById('userMsg').textContent =
  `Hello, ${session.name}! Here is your expense summary.`;

// =========================
// 📦 LOAD DATA
// =========================
const allBills =
  JSON.parse(localStorage.getItem('fs_bills')) || [];

const userEmail =
  session.email;

// =========================
// 📦 FILTER USER EXPENSES
// =========================
let userExpenses = [];

allBills.forEach(bill => {

  // =========================
  // PERSONAL EXPENSE
  // =========================
  if (
    bill.type === 'personal' &&
    bill.createdBy === userEmail
  ) {

    userExpenses.push({

      title: bill.title,

      amount: bill.amount,

      date: bill.date,

      category: bill.category,

      type: 'Personal Expense',

      status: 'Paid'
    });
  }

  // =========================
  // GROUP SPLIT EXPENSE
  // =========================
  if (
    bill.type === 'group' &&
    bill.settlement
  ) {

    const memberShare =
      bill.settlement.find(
        member => member.member === userEmail
      );

    if (memberShare) {

      userExpenses.push({

        title: bill.title,

        amount: memberShare.amount,

        date: bill.date,

        category: bill.category,

        type: 'Group Share',

        group: bill.group,

        status:
          memberShare.paid
          ? 'Paid ✅'
          : 'Pending ❌'
      });
    }
  }

});

// =========================
// 📊 SUMMARY CALCULATION
// =========================
let totalExpenses = 0;

let personalTotal = 0;

let groupTotal = 0;

userExpenses.forEach(expense => {

  totalExpenses += Number(expense.amount);

  if (expense.type === 'Personal Expense') {

    personalTotal += Number(expense.amount);

  } else {

    groupTotal += Number(expense.amount);
  }

});

// =========================
// 📊 UPDATE UI
// =========================
document.getElementById('spentValue')
.textContent = `₹ ${totalExpenses}`;

document.getElementById('personalValue')
.textContent = `₹ ${personalTotal}`;

document.getElementById('groupValue')
.textContent = `₹ ${groupTotal}`;

// =========================
// 🧾 RENDER EXPENSES
// =========================
function renderExpenses() {

  const expList =
    document.getElementById('expList');

  if (userExpenses.length === 0) {

    expList.innerHTML =
      'No expenses found.';

    return;
  }

  expList.innerHTML =
    [...userExpenses]
    .reverse()
    .map(expense => `

      <div class="subcard">

        <strong>
          ${expense.title}
        </strong>

        <br><br>

        ₹ ${expense.amount}

        <br>

        <small>
          📂 ${expense.category}
        </small>

        <br>

        <small>
          📅 ${expense.date}
        </small>

        <br>

        <small>
          🔀 ${expense.type}
        </small>

        ${expense.group ? `
          <br>
          <small>
            👥 ${expense.group}
          </small>
        ` : ''}

        <br>

        <small>
          ${expense.status}
        </small>

      </div>

    `).join('');
}

// =========================
// 💸 PENDING SETTLEMENTS
// =========================
function renderPendingSettlements() {

  const pendingList =
    document.getElementById('pendingList');

  const pendingExpenses =
    userExpenses.filter(
      exp => exp.status.includes('Pending')
    );

  if (pendingExpenses.length === 0) {

    pendingList.innerHTML =
      'No pending settlements.';

    return;
  }

  pendingList.innerHTML =
    pendingExpenses.map(expense => `

      <div class="subcard">

        <strong>
          ${expense.title}
        </strong>

        <br><br>

        ₹ ${expense.amount}

        <br>

        <small>
          👥 ${expense.group}
        </small>

        <br>

        <small>
          📅 ${expense.date}
        </small>

        <br><br>

        <button class="btn-sm">
          Pay via GPay
        </button>

      </div>

    `).join('');
}
// =========================
// 💳 RENDER SETTLEMENTS
// =========================

function renderSettlements() {

    const settlementList =
        document.getElementById("settlementList");

    const allBills =
        JSON.parse(localStorage.getItem("fs_bills")) || [];



    // user split bills
    const pendingBills = allBills.filter(bill => {

        return (

            bill.isSplit &&

            bill.selectedMembers &&

            bill.selectedMembers.includes(session.email)

        );

    });



    if (pendingBills.length === 0) {

        settlementList.innerHTML =
            "No pending settlements.";

        return;

    }



    settlementList.innerHTML =

        pendingBills.map(bill => {

            const shareAmount =

                bill.amount /
                bill.selectedMembers.length;



            const isPaid =

                bill.settlements &&
                bill.settlements[session.email];



            return `

                <div class="subcard">

                    <strong>
                        ${bill.title}
                    </strong>

                    <br>

                    Share:
                    ₹ ${shareAmount.toFixed(2)}

                    <br>

                    <small>
                        Group Expense
                    </small>

                    <br><br>

                    ${

                        isPaid

                        ?

                        `
                        <span>
                          ✅ Paid
                        </span>
                        `

                        :

                        `
                        <button
                          class="btn-sm"
                          onclick="markAsPaid(${bill.id})"
                        >
                          Mark Paid
                        </button>
                        `
                    }

                </div>

            `;

        }).join("");

}

// =========================
// 💰 MARK AS PAID
// =========================

function markAsPaid(billId) {

    const allBills =
        JSON.parse(localStorage.getItem("fs_bills")) || [];



    const updatedBills = allBills.map(bill => {

        if (bill.id === billId) {

            if (!bill.settlements) {

                bill.settlements = {};

            }

            bill.settlements[session.email] = true;

        }

        return bill;

    });



    localStorage.setItem(
        "fs_bills",
        JSON.stringify(updatedBills)
    );



    renderSettlements();

}

// =========================
// 🚀 INITIAL LOAD
// =========================
renderExpenses();


renderPendingSettlements();

renderSettlements();
