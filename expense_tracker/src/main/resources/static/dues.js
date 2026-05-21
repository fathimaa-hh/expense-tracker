// ===============================
// 🔐 SESSION CHECK
// ===============================
const s = localStorage.getItem("fs_session");

if (!s) {
    window.location = "login.html";
}

const session = JSON.parse(s);

document.getElementById("userMsg").textContent =
    `Hello, ${session.name}! Track your settlements here.`;


// ===============================
// 📦 LOAD BILLS
// ===============================
const allBills =
    JSON.parse(localStorage.getItem("fs_bills")) || [];


// ===============================
// DOM
// ===============================
const youOweList =
    document.getElementById("youOweList");

const othersOweList =
    document.getElementById("othersOweList");


// ===============================
// FILTER DATA
// ===============================
const youOwe = [];

const othersOweYou = [];



allBills.forEach(bill => {

    // ===========================
    // SOMEONE OWES YOU
    // ===========================
    if (bill.createdBy === session.email) {

        Object.keys(bill.settlements).forEach(member => {

            if (
                member !== session.email &&
                bill.settlements[member] === false
            ) {

                othersOweYou.push({

                    billId: bill.id,

                    title: bill.title,

                    member,

                    amount: bill.shares[member]

                });
            }
        });
    }


    // ===========================
    // YOU OWE SOMEONE
    // ===========================
    else {

        if (
            bill.settlements &&
            bill.settlements[session.email] === false
        ) {

            youOwe.push({

                billId: bill.id,

                title: bill.title,

                creator: bill.createdBy,

                amount: bill.shares[session.email]

            });
        }
    }

});


// ===============================
// RENDER YOU OWE
// ===============================
if (youOwe.length === 0) {

    youOweList.innerHTML =
        "No pending dues.";

} else {

    youOweList.innerHTML =
    youOwe.map(item => `

        <div class="subcard">

            <strong>
                ${item.title}
            </strong>

            <br><br>

            ₹${item.amount}

            <br>

            <small>
                Pay to:
                ${item.creator}
            </small>

            <br><br>

            <a
              class="btn"
              href="${generateUPILink(
                item.creator,
                item.amount,
                item.title
              )}"
            >
              💳 Pay via GPay
            </a>

            <br><br>

            <button
              class="btn"
              onclick="
                generateQR(
                  '${item.creator}',
                  '${item.amount}',
                  '${item.title}'
                )
              "
            >
              📷 Generate QR
            </button>

            <br><br>

            <button
                class="btn"
                onclick="markAsPaid(${item.billId})"
            >
                ✅ Mark Settled
            </button>

        </div>

    `).join("");
}


// ===============================
// RENDER OTHERS OWE YOU
// ===============================
if (othersOweYou.length === 0) {

    othersOweList.innerHTML =
        "Nobody owes you.";

} else {

    othersOweList.innerHTML =
        othersOweYou.map(item => `

            <div class="subcard">

                <strong>
                    ${item.title}
                </strong>

                <br><br>

                ₹${item.amount}

                <br>

                <small>
                    Pending from:
                    ${item.member}
                </small>

            </div>

        `).join("");
}



// ===============================
// MARK AS PAID
// ===============================
function markAsPaid(billId) {

    const billIndex =
        allBills.findIndex(
            bill => bill.id === billId
        );

    if (billIndex === -1) return;


    // mark settlement
    allBills[billIndex]
        .settlements[session.email] = true;


    // save
    localStorage.setItem(
        "fs_bills",
        JSON.stringify(allBills)
    );


    alert("Payment marked as settled!");

    location.reload();
}
// ===============================
// 💳 GENERATE UPI LINK
// ===============================
function generateUPILink(receiverEmail, amount, note) {

    const allSettings =
        JSON.parse(localStorage.getItem("fs_settings")) || {};

    const receiverSettings =
        allSettings[receiverEmail];

    if (!receiverSettings || !receiverSettings.upiId) {

        return "#";
    }

    const upiId =
        receiverSettings.upiId;

    const upiName =
        receiverSettings.upiName || "Fare Share User";

    return `
upi://pay?pa=${upiId}
&pn=${encodeURIComponent(upiName)}
&am=${amount}
&cu=INR
&tn=${encodeURIComponent(note)}
    `.replace(/\s/g, "");
}

// ===============================
// 📷 GENERATE QR
// ===============================
function generateQR(receiverEmail, amount, note) {

    const qrContainer =
        document.getElementById("qrContainer");

    qrContainer.innerHTML = "";


    // ===========================
    // RECEIVER SETTINGS
    // ===========================
    const allSettings =
        JSON.parse(localStorage.getItem("fs_settings")) || {};

    const receiverSettings =
        allSettings[receiverEmail];


    if (
        !receiverSettings ||
        !receiverSettings.upiId
    ) {

        qrContainer.innerHTML =
            "Receiver UPI ID not found.";

        return;
    }


    // ===========================
    // CREATE UPI LINK
    // ===========================
    const upiLink =
        generateUPILink(
            receiverEmail,
            amount,
            note
        );


    // ===========================
    // TITLE
    // ===========================
    const title =
        document.createElement("h4");

    title.textContent =
        `Scan to pay ₹${amount}`;

    qrContainer.appendChild(title);


    // ===========================
    // QR BOX
    // ===========================
    const qrDiv =
        document.createElement("div");

    qrDiv.id = "paymentQR";

    qrDiv.style.marginTop = "15px";

    qrContainer.appendChild(qrDiv);


    // ===========================
    // GENERATE QR
    // ===========================
    new QRCode(qrDiv, {

        text: upiLink,

        width: 220,

        height: 220
    });


    // ===========================
    // SHOW DETAILS
    // ===========================
    const details =
        document.createElement("p");

    details.style.marginTop = "15px";

    details.innerHTML = `

        <strong>
            UPI ID:
        </strong>

        ${receiverSettings.upiId}

        <br><br>

        <strong>
            Payment Note:
        </strong>

        ${note}

    `;

    qrContainer.appendChild(details);

}