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
// LOAD SETTINGS
// ===============================
let allSettings =
    JSON.parse(localStorage.getItem("fs_settings")) || {};

let userSettings =
    allSettings[session.email] || {

        monthlyBudget: 0,

        alertLimit: 80,

        upiId: "",

        upiName: session.name
    };


// ===============================
// PREFILL
// ===============================
document.getElementById("budgetInput").value =
    userSettings.monthlyBudget;

document.getElementById("alertLimitInput").value =
    userSettings.alertLimit;

document.getElementById("upiIdInput").value =
    userSettings.upiId;

document.getElementById("upiNameInput").value =
    userSettings.upiName;


// ===============================
// SAVE FUNCTION
// ===============================
function saveSettings() {

    allSettings[session.email] =
        userSettings;

    localStorage.setItem(
        "fs_settings",
        JSON.stringify(allSettings)
    );
}


// ===============================
// SAVE BUDGET
// ===============================
document.getElementById("saveBudgetBtn")
.addEventListener("click", () => {

    userSettings.monthlyBudget =
        Number(
            document.getElementById("budgetInput").value
        );

    saveSettings();

    alert("Budget saved!");

});


// ===============================
// SAVE ALERT LIMIT
// ===============================
document.getElementById("saveAlertBtn")
.addEventListener("click", () => {

    userSettings.alertLimit =
        Number(
            document.getElementById("alertLimitInput").value
        );

    saveSettings();

    alert("Alert limit saved!");

});


// ===============================
// SAVE UPI
// ===============================
document.getElementById("saveUpiBtn")
.addEventListener("click", () => {

    userSettings.upiId =
        document.getElementById("upiIdInput").value;

    userSettings.upiName =
        document.getElementById("upiNameInput").value;

    saveSettings();

    alert("UPI settings saved!");

});