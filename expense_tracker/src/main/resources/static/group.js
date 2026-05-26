// ===============================
// 🔐 SESSION CHECK
// ===============================
const s = localStorage.getItem('fs_session');

if (!s) {

    window.location = 'login.html';

}

const session = JSON.parse(s);


// ===============================
// 👋 USER MESSAGE
// ===============================
document.getElementById('welcomeMsg').textContent =
    `Hello ${session.name}, manage your groups here.`;


// ===============================
// 🌐 API URL
// ===============================
const API_URL =
    'http://localhost:8081/api/groups';


// ===============================
// 📦 LOAD GROUPS FROM BACKEND
// ===============================
async function loadGroups() {

    try {

        const response =
            await fetch(
                `${API_URL}/${session.email}`
            );

        const groups =
            await response.json();

        renderGroups(groups);

    }

    catch (error) {

        console.error(error);

        alert('Failed to load groups');

    }

}


// ===============================
// 🎨 RENDER GROUPS
// ===============================
function renderGroups(groups) {

    const groupList =
        document.getElementById('groupList');

    if (!groups || groups.length === 0) {

        groupList.innerHTML = `
            <p class="note">
                No groups created yet.
            </p>
        `;

        return;
    }

    groupList.innerHTML = '';

    groups.forEach(group => {

        const members =
            group.members
                ? group.members.split(',')
                : [];

        groupList.innerHTML += `

            <div class="subcard">

                <h3>
                    ${group.name}
                </h3>

                <br>

                <p>
                    <strong>Created By:</strong>
                    ${group.createdBy}
                </p>

                <br>

                <p>
                    <strong>Members:</strong>
                    ${members.join(', ')}
                </p>

            </div>

        `;

    });

}


// ===============================
// ➕ CREATE GROUP
// ===============================
document
.getElementById('createGroupBtn')

.addEventListener('click', async () => {

    const groupName =
        document
        .getElementById('groupName')
        .value
        .trim();

    const membersInput =
        document
        .getElementById('groupMembers')
        .value
        .trim();

    if (!groupName || !membersInput) {

        alert('Please fill all fields');

        return;
    }

    // ===============================
    // MEMBERS ARRAY
    // ===============================
    const membersArray =
        membersInput
        .split(',')
        .map(member => member.trim());

    // auto add logged-in user
    if (
        !membersArray.includes(session.email)
    ) {

        membersArray.push(session.email);

    }

    // ===============================
    // GROUP OBJECT
    // ===============================
    const groupData = {

        name: groupName,

        createdBy: session.email,

        members: membersArray.join(',')

    };


    // ===============================
    // SAVE TO BACKEND
    // ===============================
    try {

        const response =
            await fetch(API_URL, {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(groupData)

            });

        if (!response.ok) {

            throw new Error('Failed');

        }

        const savedGroup =
            await response.json();

        console.log(savedGroup);

        // ===============================
        // TEMP LOCALSTORAGE BACKUP
        // ===============================
        let localGroups =
            JSON.parse(
                localStorage.getItem('fs_groups')
            ) || [];

        localGroups.push({

            name: groupName,

            createdBy: session.email,

            members: membersArray

        });

        localStorage.setItem(
            'fs_groups',
            JSON.stringify(localGroups)
        );

        alert('Group created successfully!');

        // clear fields
        document.getElementById('groupName').value = '';

        document.getElementById('groupMembers').value = '';

        // reload groups
        loadGroups();

    }

    catch (error) {

        console.error(error);

        alert('Error creating group');

    }

});


// ===============================
// 🚀 INITIAL LOAD
// ===============================
loadGroups();