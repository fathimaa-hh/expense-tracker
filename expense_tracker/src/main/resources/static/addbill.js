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
let allBills =
  JSON.parse(localStorage.getItem('fs_bills')) || [];

let allGroups =
  JSON.parse(localStorage.getItem('fs_groups')) || [];

let personalData =
  JSON.parse(localStorage.getItem('fs_personalData')) || {};

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

    allBills.push(personalBill);

    localStorage.setItem(
      'fs_bills',
      JSON.stringify(allBills)
    );

    addToPersonalExpenses(
      session.email,
      personalBill
    );

    alert('Personal expense added successfully!');

    resetForm();

    renderBills();

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
      amount / selectedMembers.length;

    selectedMembers.forEach(member => {

      splitDetails[member] =
        parseFloat(splitAmount.toFixed(2));
    });

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
  // ===============================
// 💳 SETTLEMENT DATA
// ===============================

  const settlements = {};

  if (isSplit) {

      selectedMembers.forEach(member => {

           settlements[member] = false;

      });

  }



// ===============================
// 💾 BILL OBJECT
// ===============================

  const shares = {};
const settlements = {};


// ===============================
// PERSONAL EXPENSE
// ===============================
if (!isSplit) {

    shares[session.email] = amount;

    settlements[session.email] = true;

}


// ===============================
// SPLIT BILL
// ===============================
else {

    const allMembers = [
        session.email,
        ...selectedMembers
    ];


    // remove duplicates
    const uniqueMembers =
        [...new Set(allMembers)];


    // ===========================
    // EQUAL SPLIT
    // ===========================
    if (splitType === "equal") {

        const splitAmount =
            amount / uniqueMembers.length;

        uniqueMembers.forEach(member => {

            shares[member] =
                Number(splitAmount.toFixed(2));

            // creator already paid
            settlements[member] =
                member === session.email;

        });

    }


    // ===========================
    // CUSTOM SPLIT
    // ===========================
    else {

        uniqueMembers.forEach(member => {

            shares[member] =
                customSplit[member] || 0;

            settlements[member] =
                member === session.email;

        });

    }

}


// ===============================
// CREATE BILL OBJECT
// ===============================
  const bill = {

      id: Date.now(),

      title,

      amount,

      date,

      category,

      isSplit,

      group: selectedGroup || "Personal",

      selectedMembers,

      splitType,

      customSplit,

      shares,

      settlements,

      createdBy: session.email,

      createdAt: new Date().toISOString()
  };

  
  allBills.push(bill);

  localStorage.setItem(
    'fs_bills',
    JSON.stringify(allBills)
  );

  // ===============================
  // ADD EACH MEMBER SHARE
  // ===============================
  selectedMembers.forEach(member => {

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

  renderBills();

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
// 🧾 RENDER BILLS
// ===============================
function renderBills() {

  const billList =
    document.getElementById('billList');

  const userBills =
    allBills.filter(
      bill => bill.createdBy === session.email
    );

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
          📅 ${bill.date}
        </small>

        <br>

        <small>
          📂 ${bill.category}
        </small>

        <br>

        <small>
          💳 ${bill.paymentMethod}
        </small>

        <br>

        <small>
          👤 Paid By:
          ${bill.paidBy}
        </small>

        <br>

        <small>
          🔀 ${bill.type}
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
renderBills();