// ===============================
// 🔐 SESSION CHECK
// ===============================
const s = localStorage.getItem("fs_session");

if (!s) {
    window.location = "login.html";
}

const session = JSON.parse(s);

document.getElementById("userMsg").textContent =
    `Hello, ${session.name}! Here is your transaction history.`;


// ===============================
// 📦 LOAD BILLS
// ===============================
const allBills =
    JSON.parse(localStorage.getItem("fs_bills")) || [];


// current user related bills
const userBills = allBills.filter(bill => {

    // created by current user
    if (bill.createdBy === session.email) {
        return true;
    }

    // included in split
    if (
        bill.selectedMembers &&
        bill.selectedMembers.includes(session.email)
    ) {
        return true;
    }

    return false;
});


// ===============================
// 📊 SUMMARY
// ===============================
document.getElementById("totalTransactions")
.textContent = userBills.length;


let totalPaid = 0;

let pending = 0;


userBills.forEach(bill => {

    // creator paid initially
    if (bill.createdBy === session.email) {
        totalPaid += Number(bill.amount);
    }

    // pending settlement
    if (
        bill.settlements &&
        bill.settlements[session.email] === false
    ) {
        pending++;
    }
});


document.getElementById("totalPaid")
.textContent = `₹${totalPaid}`;

document.getElementById("pendingCount")
.textContent = pending;


// ===============================
// 📜 ACTIVITY FEED
// ===============================
const activityFeed =
    document.getElementById("activityFeed");


if (userBills.length === 0) {

    activityFeed.innerHTML =
        "No transaction history yet.";

} else {

    const latest =
        [...userBills]
        .reverse();

    activityFeed.innerHTML =
        latest.map(bill => {

            let message = "";

            // creator activity
            if (bill.createdBy === session.email) {

                message =
                    `✅ You paid ₹${bill.amount}
                     for "${bill.title}"`;

            } else {

                message =
                    `💸 You were added to
                     "${bill.title}" split`;
            }

            return `

                <div class="subcard">

                    <strong>
                        ${message}
                    </strong>

                    <br><br>

                    <small>
                        📅 ${bill.date}
                    </small>

                    <br>

                    <small>
                        👥 ${bill.group}
                    </small>

                    <br>

                    <small>
                        🕒 ${new Date(
                            bill.createdAt
                        ).toLocaleString()}
                    </small>

                </div>

            `;
        }).join("");
}


// ===============================
// 📋 TRANSACTION TABLE
// ===============================
const tableBody =
    document.getElementById("historyTableBody");


if (userBills.length === 0) {

    tableBody.innerHTML = `

        <tr>

            <td colspan="5">
                No transactions available.
            </td>

        </tr>

    `;

} else {

    const sortedBills =
        [...userBills]
        .reverse();

    sortedBills.forEach(bill => {

        let status = "Paid";

        // settlement check
        if (
            bill.settlements &&
            bill.settlements[session.email] === false
        ) {

            status = "Pending";
        }

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>
                ${bill.date}
            </td>

            <td>
                ${bill.title}
            </td>

            <td>
                ${bill.createdBy}
            </td>

            <td>
                ₹${bill.amount}
            </td>

            <td>
                ${status}
            </td>

        `;

        tableBody.appendChild(row);

    });
}