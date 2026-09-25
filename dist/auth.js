// Módulo de Autenticação com Google e Sincronização em Nuvem (Firebase)
// IFintenso - Institutos Federais

(async function () {
  const config = window.FIREBASE_CONFIG;
  const isConfigured = config && config.apiKey && config.apiKey !== "SUA_API_KEY";

  let auth = null;
  let db = null;
  let currentUser = null;
  let saveTimeout = null;

  // Elementos da interface
  const loginBtn = document.getElementById("loginBtn");
  const userProfile = document.getElementById("userProfile");
  const userAvatar = document.getElementById("userAvatar");
  const userName = document.getElementById("userName");
  const syncStatus = document.getElementById("syncStatus");
  const logoutBtn = document.getElementById("logoutBtn");

  function setSyncStatus(text, icon = "☁️", isPending = false) {
    if (!syncStatus) return;
    syncStatus.textContent = `${icon} ${text}`.trim();
    syncStatus.className = `sync-badge ${isPending ? 'pending' : 'synced'}`;
  }

  function showSetupModal() {
    let modal = document.getElementById("authSetupModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "authSetupModal";
      modal.className = "auth-modal-overlay";
      modal.innerHTML = `
        <div class="auth-modal">
          <div class="auth-modal-header">
            <h3>Conectar com Google & Salvar na Nuvem</h3>
            <button class="auth-modal-close" onclick="document.getElementById('authSetupModal').remove()">&times;</button>
          </div>
          <div class="auth-modal-body">
            <p>Para ativar o login com Google no IFintenso:</p>
            <ol>
              <li>Acesse o <a href="https://console.firebase.google.com" target="_blank" rel="noopener">Firebase Console</a>.</li>
              <li>Em <b>Authentication > Sign-in method</b>, ative o provedor <b>Google</b>.</li>
              <li>Copie as credenciais da Web App para <code>dist/firebase-config.js</code>.</li>
            </ol>
            <div class="auth-modal-tip">
              💡 <b>Nota:</b> Enquanto o Firebase não for configurado, seu progresso continuará sendo salvo localmente com total segurança!
            </div>
          </div>
          <div class="auth-modal-footer">
            <button class="btn primary" onclick="document.getElementById('authSetupModal').remove()">Entendido</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }
  }

  if (!isConfigured) {
    if (loginBtn) loginBtn.addEventListener("click", showSetupModal);
    window.cloudSync = { isReady: () => false, scheduleSave: () => {} };
    return;
  }

  try {
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js");
    const { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
    const { getFirestore, doc, getDoc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");

    const app = initializeApp(config);
    auth = getAuth(app);
    db = getFirestore(app);

    // Mesclagem de progresso (local vs nuvem)
    function mergeProgress(local, cloud) {
      if (!cloud) return local;
      if (!local) return cloud;

      const merged = { ...local };
      merged.state = cloud.state || local.state || '';
      merged.institution = cloud.institution || local.institution || '';
      merged.level = cloud.level || local.level || 'integrado';

      if ((cloud.answered || 0) >= (local.answered || 0)) {
        merged.answered = cloud.answered;
        merged.correct = cloud.correct || 0;
      }

      // Funde erros evitando duplicação
      const errorMap = new Map();
      (cloud.errors || []).forEach(e => errorMap.set(e.text, e));
      (local.errors || []).forEach(e => errorMap.set(e.text, e));
      merged.errors = Array.from(errorMap.values()).slice(0, 30);

      // Desempenho por matéria
      merged.bySubject = { ...(cloud.bySubject || {}) };
      Object.entries(local.bySubject || {}).forEach(([s, v]) => {
        if (!merged.bySubject[s]) {
          merged.bySubject[s] = v;
        } else {
          merged.bySubject[s] = {
            answered: Math.max(merged.bySubject[s].answered, v.answered),
            correct: Math.max(merged.bySubject[s].correct, v.correct)
          };
        }
      });

      return merged;
    }

    // Sincronização periódica na nuvem
    async function syncToCloud(progress) {
      if (!currentUser || !db) return;
      try {
        setSyncStatus("Salvando...", "⏳", true);
        const userRef = doc(db, "users", currentUser.uid);
        const dataToSave = {
          ...progress,
          lastUpdated: Date.now(),
          userEmail: currentUser.email,
          userName: currentUser.displayName,
          userPhoto: currentUser.photoURL || ""
        };
        await setDoc(userRef, dataToSave, { merge: true });
        setSyncStatus("Salvo", "☁️", false);
      } catch (err) {
        console.error("Erro ao sincronizar na nuvem:", err);
        setSyncStatus("Erro ao sincronizar", "⚠️", false);
      }
    }

    window.cloudSync = {
      isReady: () => !!currentUser,
      scheduleSave: (progress) => {
        if (!currentUser) return;
        setSyncStatus("Salvando...", "⏳", true);
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
          syncToCloud(progress);
        }, 1200);
      }
    };

    // Observador de Autenticação
    onAuthStateChanged(auth, async (user) => {
      currentUser = user;

      if (user) {
        if (loginBtn) loginBtn.classList.add("hidden");
        if (userProfile) userProfile.classList.remove("hidden");
        if (userAvatar) {
          userAvatar.src = user.photoURL || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2366758a'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";
          userAvatar.alt = user.displayName || "Usuário";
        }
        if (userName) {
          userName.textContent = (user.displayName || "Estudante").split(" ")[0];
        }

        // Verifica permissão de Administrador
        const adminList = window.ADMIN_EMAILS || ["djkleber@gmail.com"];
        const isAdmin = adminList.includes(user.email);
        let adminLink = document.getElementById("adminPanelLink");
        if (isAdmin) {
          if (!adminLink) {
            adminLink = document.createElement("a");
            adminLink.id = "adminPanelLink";
            adminLink.href = "admin.html";
            adminLink.className = "btn-admin-nav";
            adminLink.innerHTML = "⚙️ Painel Admin";
            const authContainer = document.getElementById("authContainer");
            if (authContainer) authContainer.prepend(adminLink);
          }
          adminLink.classList.remove("hidden");
        } else if (adminLink) {
          adminLink.classList.add("hidden");
        }

        setSyncStatus("Sincronizando...", "⏳", true);

        try {
          const userRef = doc(db, "users", user.uid);
          const snap = await getDoc(userRef);
          const localProgress = window.getProgressState ? window.getProgressState() : null;

          if (snap.exists()) {
            const cloudData = snap.data();
            if (cloudData.status === "blocked") {
              setSyncStatus("Acesso suspenso", "🚫", false);
              alert("Seu acesso a esta plataforma foi suspenso pelo administrador. Entre em contato com a coordenação.");
              await signOut(auth);
              return;
            }

            const merged = mergeProgress(localProgress, cloudData);
            if (window.applyCloudProgress) {
              window.applyCloudProgress(merged);
            }

            await setDoc(userRef, {
              ...merged,
              status: cloudData.status || "active",
              lastLoginAt: Date.now(),
              lastUpdated: Date.now(),
              userEmail: user.email,
              userName: user.displayName,
              userPhoto: user.photoURL || ""
            }, { merge: true });
          } else if (localProgress) {
            await setDoc(userRef, {
              ...localProgress,
              status: "active",
              createdAt: Date.now(),
              lastLoginAt: Date.now(),
              lastUpdated: Date.now(),
              userEmail: user.email,
              userName: user.displayName,
              userPhoto: user.photoURL || ""
            });
          }

          setSyncStatus("Sincronizado", "☁️", false);
          if (typeof window.toast === "function") {
            window.toast(`Bem-vindo, ${(user.displayName || "").split(" ")[0]}! Progresso salvo na nuvem.`);
          }
        } catch (err) {
          console.error("Erro ao carregar dados do usuário:", err);
          setSyncStatus("Offline / Local", "📱", false);
        }
      } else {
        if (loginBtn) loginBtn.classList.remove("hidden");
        if (userProfile) userProfile.classList.add("hidden");
        const adminLink = document.getElementById("adminPanelLink");
        if (adminLink) adminLink.classList.add("hidden");
        setSyncStatus("", "");
      }
    });

    if (loginBtn) {
      loginBtn.addEventListener("click", async () => {
        try {
          loginBtn.disabled = true;
          loginBtn.style.opacity = "0.7";
          const provider = new GoogleAuthProvider();
          await signInWithPopup(auth, provider);
        } catch (err) {
          console.error("Erro no login:", err);
          if (err.code !== "auth/popup-closed-by-user" && typeof window.toast === "function") {
            window.toast("Não foi possível conectar com o Google.");
          }
        } finally {
          if (loginBtn) {
            loginBtn.disabled = false;
            loginBtn.style.opacity = "1";
          }
        }
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", async () => {
        try {
          await signOut(auth);
          if (typeof window.toast === "function") {
            window.toast("Você saiu da conta.");
          }
        } catch (err) {
          console.error("Erro ao desconectar:", err);
        }
      });
    }

  } catch (err) {
    console.error("Falha ao inicializar o Firebase:", err);
    if (loginBtn) loginBtn.addEventListener("click", showSetupModal);
  }
})();
