// auth.js - simple client-side auth simulation using localStorage
// Load this script on all auth pages that need logic.

(function(){
  // helpers
  function el(id){ return document.getElementById(id); }
  function showMsg(container, text, ok){
    container.innerHTML = "";
    const div = document.createElement('div');
    div.className = 'msg ' + (ok ? 'success':'error');
    div.textContent = text;
    container.appendChild(div);
    setTimeout(()=>{ if(div) div.remove(); }, 5000);
  }

  // basic storage API
  const Storage = {
    getUsers(){
      try {
        const raw = localStorage.getItem('fs_users');
        return raw ? JSON.parse(raw) : [];
      } catch(e){ return []; }
    },
    saveUsers(arr){ localStorage.setItem('fs_users', JSON.stringify(arr)); },
    findByEmail(email){
      const users = Storage.getUsers();
      return users.find(u => u.email.toLowerCase() === email.toLowerCase());
    },
    addUser(user){
      const users = Storage.getUsers();
      users.push(user);
      Storage.saveUsers(users);
    },
    updateUser(email, data){
      let users = Storage.getUsers();
      users = users.map(u => u.email.toLowerCase()===email.toLowerCase()? {...u,...data}:u);
      Storage.saveUsers(users);
    }
  };

  // If register page exists on DOM
  const regForm = document.getElementById('registerForm');
  if(regForm){
    regForm.addEventListener('submit', function(e){
      e.preventDefault();
      const name = el('regName').value.trim();
      const email = el('regEmail').value.trim();
      const pass = el('regPass').value;
      const phone = el('regPhone').value.trim();
      const msgBox = el('regMsg');

      if(!name || !email || !pass){ showMsg(msgBox,'Please fill name, email and password.',false); return; }
      if(Storage.findByEmail(email)){ showMsg(msgBox,'Email already registered. Please login.',false); return; }

      Storage.addUser({name,email,password:pass,phone});
      showMsg(msgBox,'Registration successful! Redirecting to login...',true);
      setTimeout(()=>{ window.location = 'login.html'; }, 1200);
    });
  }

  // Login form
  const loginForm = document.getElementById('loginForm');
  if(loginForm){
    loginForm.addEventListener('submit', function(e){
      e.preventDefault();
      const email = el('loginEmail').value.trim();
      const pass = el('loginPass').value;
      const msgBox = el('loginMsg');

      const user = Storage.findByEmail(email);
      if(!user){ showMsg(msgBox,'No account found with this email.',false); return; }
      if(user.password !== pass){ showMsg(msgBox,'Incorrect password.',false); return; }

      // store a simple session
      localStorage.setItem('fs_session', JSON.stringify({email: user.email, name: user.name}));
      showMsg(msgBox,'Login successful. Redirecting...',true);
      setTimeout(()=>{ window.location = 'dashboard.html'; }, 800);
    });
  }

  // Forgot password: Step1 - request code
  const forgotForm = document.getElementById('forgotForm');
  if(forgotForm){
    forgotForm.addEventListener('submit', function(e){
      e.preventDefault();
      const email = el('forgotEmail').value.trim();
      const box = el('forgotMsg');
      const user = Storage.findByEmail(email);
      if(!user){ showMsg(box,'No user registered with that email.',false); return; }

      // generate 6-digit temp code and store in ls (prototype)
      const temp = Math.floor(100000 + Math.random()*900000).toString();
      // store as fs_reset_{email}
      localStorage.setItem('fs_reset_'+email.toLowerCase(), temp);
      // NOTE: in real app, send email. Here we display code for demo.
      showMsg(box,'Temporary code generated (demo): ' + temp, true);

      // show code input area
      document.getElementById('resetArea').style.display = 'block';
    });
  }

  // Reset password form
  const resetForm = document.getElementById('resetForm');
  if(resetForm){
    resetForm.addEventListener('submit', function(e){
      e.preventDefault();
      const email = el('resetEmail').value.trim();
      const code = el('resetCode').value.trim();
      const np = el('resetPass').value;
      const box = el('resetMsg');
      const stored = localStorage.getItem('fs_reset_'+email.toLowerCase());
      if(!stored){ showMsg(box,'No reset request found for this email.',false); return; }
      if(stored !== code){ showMsg(box,'Invalid/reset code.',false); return; }
      if(!np || np.length < 4){ showMsg(box,'Enter new password (min 4 chars).',false); return; }

      Storage.updateUser(email, {password: np});
      localStorage.removeItem('fs_reset_'+email.toLowerCase());
      showMsg(box,'Password reset successful! Redirecting to login...', true);
      setTimeout(()=>{ window.location = 'login.html'; }, 1000);
    });
  }

  // logout link on dashboard
  const logoutBtn = document.getElementById('logoutBtn');
  if(logoutBtn){
    logoutBtn.addEventListener('click', function(){
      localStorage.removeItem('fs_session');
      window.location = 'login.html';
    });
  }

  // Pre-fill reset email if provided via query param (optional)
  function getQueryParam(name){
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }
  const preEmail = getQueryParam('email');
  if(preEmail){
    const fe = el('forgotEmail'); if(fe) fe.value = preEmail;
    const re = el('resetEmail'); if(re) re.value = preEmail;
  }

})();
