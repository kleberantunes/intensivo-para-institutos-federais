// Painel de Controle de Acesso e Gestão de Alunos - Intensivo IF
(async function () {
  const config = window.FIREBASE_CONFIG;
  const adminEmails = window.ADMIN_EMAILS || ["djkleber@gmail.com"];

  const loadingState = document.getElementById("loadingState");
  const authGate = document.getElementById("authGate");
  const gateMessage = document.getElementById("gateMessage");
  const gateLoginBtn = document.getElementById("gateLoginBtn");
  const dashboardView = document.getElementById("dashboardView");
  const adminProfile = document.getElementById("adminProfile");
  const adminAvatar = document.getElementById("adminAvatar");
  const adminName = document.getElementById("adminName");
  const adminLogoutBtn = document.getElementById("adminLogoutBtn");

  const kpiTotalUsers = document.getElementById("kpiTotalUsers");
  const kpiActiveUsers = document.getElementById("kpiActiveUsers");
  const kpiBlockedUsers = document.getElementById("kpiBlockedUsers");
  const kpiTotalQuestions = document.getElementById("kpiTotalQuestions");
  const kpiAverageRate = document.getElementById("kpiAverageRate");

  const searchInput = document.getElementById("searchInput");
  const statusFilter = document.getElementById("statusFilter");
  const sortBy = document.getElementById("sortBy");
  const refreshBtn = document.getElementById("refreshBtn");
  const usersTableBody = document.getElementById("usersTableBody");
  const detailModalContainer = document.getElementById("detailModalContainer");

  let auth = null;
  let db = null;
  let currentAdmin = null;
  let allStudents = [];
  const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2394a3b8'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";

  function toast(msg) {
    const t = document.getElementById("toast");
    if (!t) return;
    t.textContent = msg;
    t.style.cssText = "position:fixed;right:20px;bottom:20px;background:#063b35;color:#fff;padding:12px 18px;border-radius:12px;z-index:9999;box-shadow:0 10px 30px rgba(6,59,53,0.3);font-size:0.9rem;font-weight:700;";
    t.style.display = "block";
    setTimeout(() => { t.style.display = "none"; }, 2500);
  }

  function formatDate(timestamp) {
    if (!timestamp) return "Nunca acessou";
    const d = new Date(timestamp);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  }

  try {
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js");
    const { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
    const { getFirestore, collection, getDocs, doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");

    const app = initializeApp(config);
    auth = getAuth(app);
    db = getFirestore(app);

    onAuthStateChanged(auth, async (user) => {
      loadingState.classList.add("hidden");
      currentAdmin = user;

      if (!user) {
        dashboardView.classList.add("hidden");
        adminProfile.classList.add("hidden");
        authGate.classList.remove("hidden");
        gateMessage.textContent = "Este painel é de acesso exclusivo para a administração. Faça login com a conta Google autorizada.";
        gateLoginBtn.classList.remove("hidden");
        return;
      }

      const isAdmin = adminEmails.includes(user.email);
      if (!isAdmin) {
        dashboardView.classList.add("hidden");
        adminProfile.classList.add("hidden");
        authGate.classList.remove("hidden");
        gateMessage.innerHTML = `A conta <b>${user.email}</b> não tem privilégios de administrador.<br>Acesse com a conta autorizada.`;
        gateLoginBtn.classList.add("hidden");
        return;
      }

      authGate.classList.add("hidden");
      dashboardView.classList.remove("hidden");
      adminProfile.classList.remove("hidden");

      if (adminAvatar) adminAvatar.src = user.photoURL || defaultAvatar;
      if (adminName) adminName.textContent = (user.displayName || "Admin").split(" ")[0];

      loadStudents();
    });

    async function loadStudents() {
      try {
        usersTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px; color:var(--muted);">Carregando estudantes...</td></tr>`;
        const snap = await getDocs(collection(db, "users"));
        allStudents = [];

        snap.forEach((d) => {
          const data = d.data();
          allStudents.push({
            id: d.id,
            ...data,
            name: data.userName || "Estudante",
            email: data.userEmail || "Sem e-mail",
            photo: data.userPhoto || "",
            status: data.status || "active",
            state: data.state || "Não informada",
            institution: data.institution || "Geral",
            level: data.level || "integrado",
            answered: data.answered || 0,
            correct: data.correct || 0,
            errors: data.errors || [],
            bySubject: data.bySubject || {},
            lastUpdated: data.lastUpdated || data.lastLoginAt || 0,
            createdAt: data.createdAt || 0
          });
        });

        renderKPIs();
        renderTable();
      } catch (err) {
        console.error("Erro ao carregar estudantes:", err);
        usersTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px; color:var(--red);">Erro ao consultar estudantes: ${err.message}</td></tr>`;
      }
    }

    function renderKPIs() {
      const total = allStudents.length;
      const active = allStudents.filter(u => u.status !== "blocked").length;
      const blocked = allStudents.filter(u => u.status === "blocked").length;
      const totalQ = allStudents.reduce((sum, u) => sum + u.answered, 0);

      const withAnswers = allStudents.filter(u => u.answered > 0);
      const avgRate = withAnswers.length
        ? Math.round(withAnswers.reduce((sum, u) => sum + (u.correct / u.answered), 0) / withAnswers.length * 100)
        : 0;

      kpiTotalUsers.textContent = total;
      kpiActiveUsers.textContent = active;
      kpiBlockedUsers.textContent = blocked;
      kpiTotalQuestions.textContent = totalQ;
      kpiAverageRate.textContent = `${avgRate}%`;
    }

    function renderTable() {
      const query = (searchInput.value || "").toLowerCase().trim();
      const status = statusFilter.value;
      const sort = sortBy.value;

      let filtered = allStudents.filter(u => {
        const matchesQuery = u.name.toLowerCase().includes(query) ||
                             u.email.toLowerCase().includes(query) ||
                             u.state.toLowerCase().includes(query) ||
                             u.institution.toLowerCase().includes(query);
        const matchesStatus = status === "all" ||
                              (status === "active" && u.status !== "blocked") ||
                              (status === "blocked" && u.status === "blocked");
        return matchesQuery && matchesStatus;
      });

      filtered.sort((a, b) => {
        if (sort === "lastActive") return b.lastUpdated - a.lastUpdated;
        if (sort === "questions") return b.answered - a.answered;
        if (sort === "rate") {
          const rateA = a.answered ? a.correct / a.answered : 0;
          const rateB = b.answered ? b.correct / b.answered : 0;
          return rateB - rateA;
        }
        if (sort === "name") return a.name.localeCompare(b.name);
        return 0;
      });

      if (!filtered.length) {
        usersTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:40px; color:var(--muted);">Nenhum estudante encontrado com os filtros selecionados.</td></tr>`;
        return;
      }

      usersTableBody.innerHTML = filtered.map(u => {
        const isBlocked = u.status === "blocked";
        const rate = u.answered ? Math.round(u.correct / u.answered * 100) : 0;
        const rateClass = rate >= 70 ? "good" : rate >= 50 ? "warn" : "bad";

        return `
          <tr>
            <td>
              <div class="student-cell">
                <img class="student-avatar" src="${u.photo || defaultAvatar}" alt="Avatar">
                <div class="student-info">
                  <b>${u.name}</b>
                  <small>${u.email}</small>
                </div>
              </div>
            </td>
            <td>
              <div><b>${u.state !== 'Não informada' ? u.state : 'Sem UF'}</b></div>
              <small style="color:var(--muted);">${u.institution}</small>
            </td>
            <td>
              <span class="status-badge ${isBlocked ? 'blocked' : 'active'}">
                ${isBlocked ? '🚫 Bloqueado' : '🟢 Ativo (Liberado)'}
              </span>
            </td>
            <td>
              <span style="font-size:0.85rem; color:var(--ink);">${formatDate(u.lastUpdated)}</span>
            </td>
            <td>
              <div><b>${u.answered}</b> questões</div>
              <small class="rate-badge ${rateClass}">${rate}% acertos (${u.correct} certos)</small>
            </td>
            <td>
              <div class="action-buttons">
                <button class="btn-sm ${isBlocked ? 'btn-unblock' : 'btn-block'}" onclick="window.toggleUserStatus('${u.id}', '${isBlocked ? 'active' : 'blocked'}')">
                  ${isBlocked ? 'Liberar Acesso' : 'Bloquear'}
                </button>
                <button class="btn-sm" onclick="window.openDetailModal('${u.id}')">
                  Detalhes
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join("");
    }

    window.toggleUserStatus = async function (userId, newStatus) {
      try {
        const student = allStudents.find(u => u.id === userId);
        const actionText = newStatus === "blocked" ? "bloquear" : "liberar";
        if (!confirm(`Deseja realmente ${actionText} o acesso de ${student ? student.name : 'este usuário'}?`)) return;

        const userDocRef = doc(db, "users", userId);
        await setDoc(userDocRef, { status: newStatus }, { merge: true });

        if (student) student.status = newStatus;
        renderKPIs();
        renderTable();

        toast(newStatus === "blocked" ? "Acesso do estudante bloqueado com sucesso!" : "Acesso liberado com sucesso!");
      } catch (err) {
        console.error("Erro ao alterar status:", err);
        toast("Erro ao alterar status: " + err.message);
      }
    };

    window.openDetailModal = function (userId) {
      const u = allStudents.find(x => x.id === userId);
      if (!u) return;

      const isBlocked = u.status === "blocked";
      const subjectRows = Object.entries(u.bySubject || {});

      detailModalContainer.innerHTML = `
        <div class="modal-overlay" onclick="if(event.target === this) window.closeDetailModal()">
          <div class="detail-modal">
            <div class="detail-modal-header">
              <div class="student-cell">
                <img class="student-avatar" src="${u.photo || defaultAvatar}" alt="Avatar">
                <div class="student-info">
                  <h3 style="margin:0;">${u.name}</h3>
                  <small>${u.email} · Região: ${u.state} (${u.institution})</small>
                </div>
              </div>
              <button class="btn light" onclick="window.closeDetailModal()" style="padding:6px 12px; font-size:1.1rem;">&times;</button>
            </div>

            <div class="detail-section">
              <h4>Controle de Acesso</h4>
              <div style="display:flex; justify-content:space-between; align-items:center; background:#f4f8f5; padding:12px 16px; border-radius:12px; border:1px solid var(--line);">
                <div>
                  Status Atual: <span class="status-badge ${isBlocked ? 'blocked' : 'active'}">${isBlocked ? '🚫 Bloqueado' : '🟢 Ativo (Liberado)'}</span>
                </div>
                <button class="btn-sm ${isBlocked ? 'btn-unblock' : 'btn-block'}" onclick="window.toggleUserStatus('${u.id}', '${isBlocked ? 'active' : 'blocked'}'); window.closeDetailModal();">
                  ${isBlocked ? 'Desbloquear Aluno' : 'Suspender Aluno'}
                </button>
              </div>
            </div>

            <div class="detail-section">
              <h4>Desempenho por Matéria</h4>
              ${subjectRows.length ? subjectRows.map(([sub, stat]) => {
                const subRate = stat.answered ? Math.round(stat.correct / stat.answered * 100) : 0;
                return `<div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--line);">
                  <span><b>${sub}</b> (${stat.answered} resolvidas)</span>
                  <span style="font-weight:800; color:var(--forest2);">${subRate}% acerto</span>
                </div>`;
              }).join('') : '<p style="color:var(--muted);">Nenhum simulado por matéria concluído ainda.</p>'}
            </div>

            <div class="detail-section">
              <h4>Caderno de Erros Recentes (${u.errors.length} registrados)</h4>
              ${u.errors.length ? u.errors.slice(0, 10).map((e, idx) => `
                <div class="error-item">
                  <b>${idx + 1}. ${e.text}</b><br>
                  <span style="color:#b52e3b;">Gabarito: ${e.answer}</span><br>
                  <small style="color:var(--muted);">${e.explanation}</small>
                </div>
              `).join('') : '<p style="color:var(--muted);">Nenhum erro registrado.</p>'}
            </div>

            <div style="text-align:right; margin-top:20px;">
              <button class="btn primary" onclick="window.closeDetailModal()">Fechar</button>
            </div>
          </div>
        </div>
      `;
    };

    window.closeDetailModal = function () {
      detailModalContainer.innerHTML = "";
    };

    searchInput.addEventListener("input", renderTable);
    statusFilter.addEventListener("change", renderTable);
    sortBy.addEventListener("change", renderTable);
    refreshBtn.addEventListener("click", loadStudents);

    gateLoginBtn.addEventListener("click", async () => {
      try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      } catch (err) {
        console.error("Erro no login:", err);
      }
    });

    adminLogoutBtn.addEventListener("click", async () => {
      await signOut(auth);
      location.reload();
    });

  } catch (err) {
    console.error("Falha ao inicializar painel:", err);
    loadingState.innerHTML = `<h3 style="color:var(--red);">Erro ao iniciar painel administrativo</h3><p>${err.message}</p>`;
  }
})();
