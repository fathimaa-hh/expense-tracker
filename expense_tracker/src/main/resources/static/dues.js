// ===============================
// 🔐 SESSION CHECK
// ===============================
const s =
    localStorage.getItem('fs_session');

if (!s) {

    window.location = 'login.html';

}

const session = JSON.parse(s);


// ===============================
// 🌐 API URL
// ===============================
const API_URL =
    'http://localhost:8081/api/settlements';


// ===============================
// ➕ ADD DUE
// ===============================
document
.getElementById('addDueBtn')

.addEventListener('click', async () => {

    const receiver =
        document
        .getElementById('receiver')
        .value
        .trim();

    const amount =
        parseFloat(
            document
            .getElementById('amount')
            .value
        );

    if (!receiver || !amount) {

        alert('Please fill all fields');

        return;
    }

    const settlementData = {

        payer: session.email,

        receiver: receiver,

        amount: amount,

        status: 'Pending'

    };

    try {

        const response =
            await fetch(API_URL, {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(
                    settlementData
                )

            });

        if (!response.ok) {

            throw new Error(
                'Failed to save'
            );

        }

        alert('Due added successfully!');

        document.getElementById('receiver').value = '';

        document.getElementById('amount').value = '';

        loadSettlements();

    }

    catch (error) {

        console.error(error);

        alert('Error adding due');

    }

});


// ===============================
// 📦 LOAD SETTLEMENTS
// ===============================
async function loadSettlements() {

    try {

        const response =
            await fetch(
                `${API_URL}/${session.email}`
            );

        const settlements =
            await response.json();

        renderSettlements(
            settlements
        );

    }

    catch (error) {

        console.error(error);

    }

}


// ===============================
// 🎨 RENDER SETTLEMENTS
// ===============================
function renderSettlements(
    settlements
) {

    const duesList =
        document.getElementById(
            'duesList'
        );

    if (
        !settlements ||
        settlements.length === 0
    ) {

        duesList.innerHTML = `

            <p class="note">
                No pending dues.
            </p>

        `;

        return;
    }

    duesList.innerHTML = '';

    settlements.forEach(
        settlement => {

        duesList.innerHTML += `

            <div class="subcard">

                <h3>
                    ₹ ${settlement.amount}
                </h3>

                <br>

                <p>
                    <strong>
                        Receiver:
                    </strong>

                    ${settlement.receiver}
                </p>

                <br>

                <p>
                    <strong>
                        Status:
                    </strong>

                    ${settlement.status}
                </p>

            </div>

        `;

    });

}


// ===============================
// 🚀 INITIAL LOAD
// ===============================
loadSettlements();