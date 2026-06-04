// ===============================
// 🔐 SESSION
// ===============================
const s = localStorage.getItem("fs_session");

if (!s) {
    window.location = "login.html";
}

const session = JSON.parse(s);

document.getElementById("userMsg").textContent =
    `Hello, ${session.name}! Manage your settings here.`;


// ===============================
// 🌐 LOAD SETTINGS
// ===============================
function loadSettings() {

    fetch(
        `http://localhost:8081/api/settings/${session.email}`
    )

    .then(response => response.json())

    .then(data => {

        document.getElementById("budgetInput").value =
            data.monthlyBudget || 0;

        document.getElementById("alertLimitInput").value =
            data.alertLimit || 80;

        document.getElementById("upiIdInput").value =
            data.upiId || "";

        document.getElementById("upiNameInput").value =
            data.upiName || "";

    })

    .catch(error => {

        console.error(error);

        alert("Failed to load settings.");

    });

}


// ===============================
// 💾 SAVE SETTINGS
// ===============================
function saveSettings() {

    const settings = {

        email: session.email,

        monthlyBudget:
            Number(
                document.getElementById("budgetInput").value
            ),

        alertLimit:
            Number(
                document.getElementById("alertLimitInput").value
            ),

        upiId:
            document.getElementById("upiIdInput").value,

        upiName:
            document.getElementById("upiNameInput").value
    };

    fetch(
        "http://localhost:8081/api/settings",
        {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(settings)

        }
    )

    .then(response => response.json())

    .then(data => {

        alert("Settings saved successfully!");

    })

    .catch(error => {

        console.error(error);

        alert("Failed to save settings.");

    });

}


// ===============================
// SAVE BUTTONS
// ===============================
document.getElementById("saveBudgetBtn")
.addEventListener("click", saveSettings);

document.getElementById("saveAlertBtn")
.addEventListener("click", saveSettings);

document.getElementById("saveUpiBtn")
.addEventListener("click", saveSettings);


// ===============================
// 🚀 INITIAL LOAD
// ===============================
loadSettings();