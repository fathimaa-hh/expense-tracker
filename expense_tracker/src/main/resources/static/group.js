// ===============================
// 🔐 SESSION CHECK
// ===============================
const s = localStorage.getItem('fs_session');

if (!s) {
  window.location = 'login.html';
}

const session = JSON.parse(s);

document.getElementById('userMsg').textContent =
  `Hello, ${session.name}! Manage your expense groups below.`;


// ===============================
// 📦 LOAD GROUPS
// ===============================
let groups = JSON.parse(localStorage.getItem('fs_groups')) || [];


// ===============================
// 🎨 RENDER GROUPS
// ===============================
function renderGroups() {

  const groupList = document.getElementById('groupList');

  // Show only groups created by current user
  const userGroups = groups.filter(
    g => g.createdBy === session.email
  );

  if (userGroups.length === 0) {
    groupList.innerHTML = `
      <div class="subcard">
        No groups created yet.
      </div>
    `;
    return;
  }

  groupList.innerHTML = userGroups.map((group, index) => `

    <div class="subcard">

      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h4>${group.name}</h4>

        <button 
          class="btn-sm"
          onclick="deleteGroup('${group.id}')"
        >
          🗑 Delete
        </button>
      </div>

      <p>
        <strong>Created By:</strong>
        ${group.createdBy}
      </p>

      <p>
        <strong>Total Members:</strong>
        ${group.members.length}
      </p>

      <div style="margin-top:10px;">
        <strong>Members:</strong>

        <div style="margin-top:6px;">
          ${group.members.map(member => `
            <span class="member-chip">
              ${member}
            </span>
          `).join('')}
        </div>
      </div>

    </div>

  `).join('');
}


// ===============================
// ➕ CREATE GROUP
// ===============================
document.getElementById('createGroupBtn')
.addEventListener('click', () => {

  const groupName = document
    .getElementById('groupName')
    .value
    .trim();

  const membersRaw = document
    .getElementById('groupMembers')
    .value
    .trim();

  // Validation
  if (!groupName || !membersRaw) {
    alert('Please enter group name and members.');
    return;
  }

  // Duplicate name check
  const alreadyExists = groups.find(
    g =>
      g.name.toLowerCase() === groupName.toLowerCase()
      &&
      g.createdBy === session.email
  );

  if (alreadyExists) {
    alert('Group name already exists.');
    return;
  }

  // Convert comma separated emails
  let members = membersRaw
    .split(',')
    .map(m => m.trim())
    .filter(Boolean);

  // Add creator automatically if not present
  if (!members.includes(session.email)) {
    members.unshift(session.email);
  }

  // Remove duplicates
  members = [...new Set(members)];

  // Create group object
  const newGroup = {

    id: Date.now().toString(),

    name: groupName,

    members: members,

    createdBy: session.email,

    createdAt: new Date().toISOString()
  };

  // Save
  groups.push(newGroup);

  localStorage.setItem(
    'fs_groups',
    JSON.stringify(groups)
  );

  // Reset form
  document.getElementById('groupName').value = '';
  document.getElementById('groupMembers').value = '';

  // Refresh UI
  renderGroups();

  alert('Group created successfully!');
});


// ===============================
// 🗑 DELETE GROUP
// ===============================
function deleteGroup(groupId) {

  const confirmDelete = confirm(
    'Are you sure you want to delete this group?'
  );

  if (!confirmDelete) return;

  groups = groups.filter(
    g => g.id !== groupId
  );

  localStorage.setItem(
    'fs_groups',
    JSON.stringify(groups)
  );

  renderGroups();
}


// ===============================
// 🚀 INITIAL LOAD
// ===============================
renderGroups();