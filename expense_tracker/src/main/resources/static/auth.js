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

  

  // If register page exists on DOM
  const regForm = document.getElementById('registerForm');

  if (regForm) {

    regForm.addEventListener('submit', async function (e) {

      e.preventDefault();

      const name =
        el('regName').value.trim();

      const email =
        el('regEmail').value.trim();

      const pass =
        el('regPass').value;

      const phone =
        el('regPhone').value.trim();

      const msgBox =
        el('regMsg');


      if (!name || !email || !pass) {

        showMsg(
          msgBox,
          'Please fill all required fields.',
          false
        );

        return;
      }


      try {

        const response = await fetch(
          'http://localhost:8081/api/auth/register',
          {

            method: 'POST',

            headers: {
              'Content-Type': 'application/json'
            },

            body: JSON.stringify({

              username: name,

              email: email,

              password: pass,

              monthlyBudget: 0
            })
          }
        );

        const data = await response.json();


        if (data.success) {

          showMsg(
            msgBox,
            'Registration successful! Redirecting...',
            true
          );

          setTimeout(() => {

            window.location =
              'login.html';

          }, 1200);

        } else {

          showMsg(
            msgBox,
            data.message,
            false
          );
        }

      } catch (error) {

        console.error(error);

        showMsg(
          msgBox,
          'Server error.',
          false
        );
      }

    });

  }
  

  // Login form
  const loginForm = document.getElementById('loginForm');

  if (loginForm) {

    loginForm.addEventListener('submit', async function (e) {

      e.preventDefault();

      const email =
        el('loginEmail').value.trim();

      const pass =
        el('loginPass').value;

      const msgBox =
        el('loginMsg');


      try {

        const response = await fetch(
          'http://localhost:8081/api/auth/login',
          {

            method: 'POST',

            headers: {
              'Content-Type': 'application/json'
            },

            body: JSON.stringify({

              email: email,

              password: pass

            })
          }
        );

        const data = await response.json();


        if (!data.success) {

          showMsg(
            msgBox,
            data.message,
            false
          );

          return;
        }


        // =========================
        // SAVE SESSION TEMPORARILY
        // =========================

        localStorage.setItem(
          'fs_session',

          JSON.stringify({

            email: data.user.email,

            name: data.user.username,

            id: data.user.id

          })
        );


        showMsg(
          msgBox,
          'Login successful!',
          true
        );


        setTimeout(() => {

          window.location =
            'dashboard.html';

        }, 1000);

      } catch (error) {

        console.error(error);

        showMsg(
          msgBox,
          'Server error.',
          false
        );
      }

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
