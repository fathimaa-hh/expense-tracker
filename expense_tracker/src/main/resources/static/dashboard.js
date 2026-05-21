document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // 🔐 SESSION CHECK
    // =========================

    const sessionData =
        localStorage.getItem("fs_session");

    if (!sessionData) {

        window.location.href = "login.html";
        return;

    }

    const session =
        JSON.parse(sessionData);

    document.getElementById("welcomeMsg")
        .textContent =
        `Hello, ${session.name}! Welcome back.`;



    // =========================
    // 📦 LOAD DATA
    // =========================

    const allBills =
        JSON.parse(localStorage.getItem("fs_bills")) || [];

    const allGroups =
        JSON.parse(localStorage.getItem("fs_groups")) || [];

    const settings =
        JSON.parse(localStorage.getItem("fs_settings")) || {};



    // =========================
    // ⚙ USER SETTINGS
    // =========================

    const monthlyBudget =
        Number(settings.monthlyBudget) || 0;

    const alertLimit =
        Number(settings.alertLimit) || 80;



    // =========================
    // 👤 USER RELATED BILLS
    // =========================

    const userBills = allBills.filter(bill => {

        // Personal bill created by user
        if (
            bill.createdBy === session.email &&
            !bill.isSplit
        ) {
            return true;
        }

        // Split member bill
        if (
            bill.selectedMembers &&
            bill.selectedMembers.includes(session.email)
        ) {
            return true;
        }

        return false;

    });



    // =========================
    // 💰 CALCULATE TOTAL SPENT
    // =========================

    let totalSpent = 0;

    userBills.forEach(bill => {

        // If not split
        if (!bill.isSplit) {

            totalSpent += Number(bill.amount);

        }

        // Split bill
        else {

            if (
                bill.selectedMembers &&
                bill.selectedMembers.length > 0
            ) {

                const splitAmount =
                    Number(bill.amount) /
                    bill.selectedMembers.length;

                totalSpent += splitAmount;
            }
        }

    });



    // =========================
    // 💳 BUDGET REMAINING
    // =========================

    const remaining =
        monthlyBudget - totalSpent;

    document.getElementById("totalSpent")
        .textContent =
        `₹ ${totalSpent.toFixed(2)}`;

    document.getElementById("budgetRemaining")
        .textContent =
        `₹ ${remaining.toFixed(2)}`;



    // =========================
    // ⏳ PENDING SETTLEMENTS
    // =========================

    let pendingAmount = 0;

    userBills.forEach(bill => {

        if (
            bill.isSplit &&
            bill.selectedMembers &&
            bill.selectedMembers.includes(session.email)
        ) {

            const share =
                Number(bill.amount) /
                bill.selectedMembers.length;

            pendingAmount += share;

        }

    });

    document.getElementById("pendingSettlements")
        .textContent =
        `₹ ${pendingAmount.toFixed(2)}`;



    // =========================
    // 📅 UPCOMING BILLS
    // =========================

    const upcomingContainer =
        document.getElementById("upcomingBills");

    const today =
        new Date();

    const upcomingBills =
        userBills.filter(bill => {

            if (!bill.date) return false;

            return new Date(bill.date) >= today;

        });



    if (upcomingBills.length === 0) {

        upcomingContainer.innerHTML =
            "No upcoming bills.";

    }

    else {

        upcomingContainer.innerHTML =
            upcomingBills.map(bill => {

                let displayAmount =
                    bill.amount;

                if (
                    bill.isSplit &&
                    bill.selectedMembers &&
                    bill.selectedMembers.length > 0
                ) {

                    displayAmount =
                        bill.amount /
                        bill.selectedMembers.length;
                }

                return `

                    <div class="subcard">

                        <strong>
                            ${bill.title}
                        </strong>

                        <br>

                        ₹ ${displayAmount.toFixed(2)}

                        <br>

                        <small>
                            📅 ${bill.date}
                        </small>

                        <br>

                        <small>
                            📂 ${bill.category}
                        </small>

                    </div>

                `;

            }).join("");

    }



    // =========================
    // 🚨 BUDGET ALERT
    // =========================

    const budgetAlert =
        document.getElementById("budgetAlert");

    const alertMessage =
        document.getElementById("alertMessage");

    if (monthlyBudget > 0) {

        const usedPercentage =
            (totalSpent / monthlyBudget) * 100;

        if (usedPercentage >= alertLimit) {

            budgetAlert.style.display = "block";

            alertMessage.textContent =
                `You have used ${usedPercentage.toFixed(0)}% of your monthly budget.`;

        }

        else {

            budgetAlert.style.display = "none";

        }

    }



    // =========================
    // 🕒 RECENT ACTIVITY
    // =========================

    const recentActivity =
        document.getElementById("recentActivity");

    if (userBills.length === 0) {

        recentActivity.innerHTML =
            "No recent activity.";

    }

    else {

        const latestBills =
            [...userBills]
            .reverse()
            .slice(0, 5);

        recentActivity.innerHTML =
            latestBills.map(bill => `

                <div class="subcard">

                    <strong>
                        ${bill.title}
                    </strong>

                    <br>

                    ₹ ${bill.amount}

                    <br>

                    <small>
                        ${bill.category}
                    </small>

                    <br>

                    <small>
                        📅 ${bill.date}
                    </small>

                </div>

            `).join("");

    }



    // =========================
    // 🚪 LOGOUT
    // =========================

    document.getElementById("logoutBtn")
        .addEventListener("click", () => {

            localStorage.removeItem("fs_session");

            window.location.href =
                "login.html";

        });

});