// ===============================
// 🔐 SESSION CHECK
// ===============================
const s = localStorage.getItem('fs_session');

if (!s) {
  window.location = 'login.html';
}

const session = JSON.parse(s);

document.getElementById('userMsg').textContent =
  `Hello, ${session.name}! Add and manage your bills here.`;


// ===============================
// 📦 LOAD DATA
// ===============================
let allBills = [];

let allGroups =
  JSON.parse(localStorage.getItem('fs_groups')) || [];

let personalData =
  JSON.parse(localStorage.getItem('fs_personalData')) || {};

let userBills = [];


// ===============================
// 👤 AUTO FILL PAID BY
// ===============================
document.getElementById('paidBy').value =
  session.email;


// ===============================
// 👥 GROUP DROPDOWN
// ===============================
const groupSelect =
  document.getElementById('groupSelect');

const userGroups = allGroups.filter(group =>
  group.createdBy === session.email ||
  group.members.includes(session.email)
);

groupSelect.innerHTML =
  '<option value="">Select Group</option>';

userGroups.forEach(group => {

  groupSelect.innerHTML += `
    <option value="${group.name}">
      ${group.name}
    </option>
  `;
});


// ===============================
// 🔄 SPLIT YES/NO
// ===============================
const isSplit =
  document.getElementById('isSplit');

const groupSection =
  document.getElementById('groupSection');

isSplit.addEventListener('change', () => {

  if (isSplit.value === 'yes') {
    groupSection.style.display = 'block';
  } else {
    groupSection.style.display = 'none';
  }

});


// ===============================
// 👥 MEMBER SELECTION
// ===============================
groupSelect.addEventListener('change', () => {

  const selectedGroup =
    allGroups.find(
      g => g.name === groupSelect.value
    );

  const memberBox =
    document.getElementById('memberSelection');

  memberBox.innerHTML = '';

  if (!selectedGroup) return;

  memberBox.innerHTML =
    '<label class="note">Select Members</label>';

  selectedGroup.members.forEach(member => {

    memberBox.innerHTML += `
      <div style="margin-top:6px;">
        <input
          type="checkbox"
          class="memberCheck"
          value="${member}"
        >
        ${member}
      </div>
    `;
  });

});


// ===============================
// 🔄 CUSTOM SPLIT TOGGLE
// ===============================
const splitType =
  document.getElementById('splitType');

const customSplitBox =
  document.getElementById('customSplitBox');

splitType.addEventListener('change', () => {

  if (splitType.value === 'custom') {
    customSplitBox.style.display = 'block';
  } else {
    customSplitBox.style.display = 'none';
  }

});


// ===============================
// ➕ ADD BILL
// ===============================
document.getElementById('addBillBtn')
.addEventListener('click', () => {

  const title =
    document.getElementById('billTitle').value.trim();

  const amount =
    parseFloat(document.getElementById('billAmount').value);

  const date =
    document.getElementById('billDate').value;

  const category =
    document.getElementById('billCategory').value.trim();

  const paymentMethod =
    document.getElementById('paymentMethod').value;

  const splitEnabled =
    isSplit.value === 'yes';

  if (!title || !amount || !date || !category) {

    alert('Please fill all fields.');
    return;
  }

  // ===============================
  // PERSONAL EXPENSE
  // ===============================
  if (!splitEnabled) {

    const personalBill = {

      id: Date.now(),

      title,
      amount,
      date,
      category,

      type: 'personal',

      paidBy: session.email,

      createdBy: session.email,

      paymentMethod,

      settlementStatus: 'paid'
    };

    // ===============================
    // SAVE TO BACKEND
    // ===============================
    fetch('http://localhost:8081/api/expenses', {

      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({

        title: title,

        amount: amount,

        category: category,

        expenseDate: date,

        createdBy: session.email,

        groupName: 'Personal',

        splitType: 'no-split'

      })

    })

    .then(response => response.json())

    .then(data => {

      // localStorage backup
      addToPersonalExpenses(
        session.email,
        personalBill
      );

      alert('Expense added successfully!');

      console.log(data);

      resetForm();

      loadBillsFromBackend();

    })

    .catch(error => {

      console.error(error);

      alert('Failed to save expense.');

    });

    return;
  }

  // ===============================
  // GROUP EXPENSE
  // ===============================
  const selectedMembers =
    Array.from(
      document.querySelectorAll('.memberCheck:checked')
    ).map(cb => cb.value);

  if (
    !groupSelect.value ||
    selectedMembers.length === 0
  ) {
    alert('Please select group and members.');
    return;
  }

  let splitDetails = {};

  // ===============================
  // EQUAL SPLIT
  // ===============================
  if (splitType.value === 'equal') {

    const splitAmount =
      amount / (selectedMembers.length + 1);

    selectedMembers.forEach(member => {

      splitDetails[member] =
        parseFloat(splitAmount.toFixed(2));
    });

    splitDetails[session.email] =
      parseFloat(splitAmount.toFixed(2));

  }

  // ===============================
  // CUSTOM SPLIT
  // ===============================
  else {

    const lines =
      customSplitBox.value
      .split('\n')
      .filter(Boolean);

    lines.forEach(line => {

      const [email, amt] =
        line.split(':');

      if (email && amt) {

        splitDetails[email.trim()] =
          parseFloat(amt.trim());
      }

    });
  }

  // ===============================
  // CREATE BILL
  // ===============================
  const bill = {

    id: Date.now(),

    title,

    amount,

    date,

    category,

    type: 'group',

    group: groupSelect.value,

    selectedMembers,

    splitType: splitType.value,

    customSplit: splitDetails,

    paidBy: session.email,

    createdBy: session.email,

    paymentMethod,

    createdAt: new Date().toISOString()
  };

  // ===============================
  // SAVE GROUP BILL
  // ===============================
  fetch('http://localhost:8081/api/expenses', {

    method: 'POST',

    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({

      title: bill.title,

      amount: bill.amount,

      expenseDate: bill.date,

      category: bill.category,

      groupName: bill.group,

      splitType: bill.splitType,

      createdBy: bill.createdBy
    })

  })

  .then(response => response.json())

  .then(savedBill => {

    allBills.push(bill);

    localStorage.setItem(
      'fs_bills',
      JSON.stringify(allBills)
    );

    Object.keys(splitDetails).forEach(member => {

      addToPersonalExpenses(member, {

        title,
        amount: splitDetails[member],
        date,
        category,

        group: groupSelect.value,

        type: 'split-share',

        paid:
          member === session.email
      });

    });

    alert('Group expense added successfully!');

    resetForm();

    loadBillsFromBackend();

  })

  .catch(error => {

    console.error(error);

    alert('Error saving group bill.');

  });

});


// ===============================
// 💾 ADD TO PERSONAL DATA
// ===============================
function addToPersonalExpenses(email, expense) {

  if (!personalData[email]) {

    personalData[email] = {
      budget: 0,
      alertPercentage: 80,
      expenses: []
    };
  }

  personalData[email].expenses.push(expense);

  localStorage.setItem(
    'fs_personalData',
    JSON.stringify(personalData)
  );
}


// ===============================
// 🌐 LOAD USER BILLS FROM BACKEND
// ===============================
function loadBillsFromBackend() {

  fetch(
    `http://localhost:8081/api/expenses/${session.email}`
  )

  .then(response => response.json())

  .then(data => {

    userBills = data;

    renderBills();

  })

  .catch(error => {

    console.error(error);

  });

}


// ===============================
// 🧾 RENDER BILLS
// ===============================
function renderBills() {

  const billList =
    document.getElementById('billList');

  if (userBills.length === 0) {

    billList.innerHTML =
      'No bills added yet.';

    return;
  }

  billList.innerHTML =
    [...userBills]
    .reverse()
    .map(bill => `

      <div class="subcard">

        <strong>
          ${bill.title}
        </strong>

        <br><br>

        ₹${bill.amount}

        <br><br>

        <small>
          📅 ${bill.expenseDate}
        </small>

        <br>

        <small>
          📂 ${bill.category}
        </small>

        <br>

        <small>
          👥 ${bill.groupName || 'Personal'}
        </small>

        <br>

        <small>
          🔀 ${bill.splitType}
        </small>

      </div>

    `).join('');
}


// ===============================
// 🔄 RESET FORM
// ===============================
function resetForm() {

  document.getElementById('billTitle').value = '';
  document.getElementById('billAmount').value = '';
  document.getElementById('billDate').value = '';
  document.getElementById('billCategory').value = '';

  groupSelect.value = '';

  customSplitBox.value = '';

  document.getElementById('memberSelection').innerHTML =
    '';

  splitType.value = 'equal';

  customSplitBox.style.display = 'none';

  isSplit.value = 'no';

  groupSection.style.display = 'none';
}


// ===============================
// 🚀 INITIAL LOAD
// ===============================
loadBillsFromBackend();