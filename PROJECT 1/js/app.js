/* ================================================================
   OSINT GENIUS - App Router & State Manager
   ================================================================ */
window.App = {
  currentModule: null,
  mapInstances: {},
  currentUser: null,

  modules: {
    dashboard:   null,
    ip:          null,
    email:       null,
    domain:      null,
    username:    null,
    phone:       null,
    geo:         null,
    crypto:      null,
    file:        null,
    darkweb:     null,
    dorking:     null,
    cve:         null,
    person:      null,
    threat:      null,
    urlanalyzer: null,
    network:     null
  },

  init() {
    this.runIntro();
    this.initClock();
    this.bindSidebar();
    this.initToasts();
    // Load module references after intro
  },

  runIntro() {
    const intro = document.getElementById('intro-screen');
    const fill  = document.getElementById('intro-progress-fill');
    const pct   = document.getElementById('intro-pct');
    const access= document.getElementById('intro-access');
    const bootLines = document.querySelectorAll('.boot-line');

    // Animate boot lines sequentially (classier, snappier stagger)
    bootLines.forEach((line, i) => {
      setTimeout(() => line.classList.add('visible'), 500 + i * 140);
    });

    // Animate progress bar (faster, dynamic interval)
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10 + 4;
      if (progress >= 100) { progress = 100; clearInterval(interval); }
      fill.style.width = progress + '%';
      if (pct) pct.textContent = Math.floor(progress) + '%';
    }, 60);

    // Show ACCESS GRANTED (reduced from 5s to 2.8s for premium user experience)
    setTimeout(() => {
      access.classList.add('show');
      setTimeout(() => {
        intro.classList.add('fade-out');
        setTimeout(() => {
          intro.style.display = 'none';
          this.loadModules();
          this.showLogin();
        }, 600);
      }, 750);
    }, 2800);
  },

  loadModules() {
    this.modules.dashboard   = window.DashboardModule;
    this.modules.ip          = window.IPModule;
    this.modules.email       = window.EmailModule;
    this.modules.domain      = window.DomainModule;
    this.modules.username    = window.UsernameModule;
    this.modules.phone       = window.PhoneModule;
    this.modules.geo         = window.GeoModule;
    this.modules.crypto      = window.CryptoModule;
    this.modules.file        = window.FileModule;
    this.modules.darkweb     = window.DarkwebModule;
    this.modules.dorking     = window.DorkingModule;
    this.modules.cve         = window.CVEModule;
    this.modules.person      = window.PersonModule;
    this.modules.threat      = window.ThreatModule;
    this.modules.urlanalyzer = window.URLAnalyzerModule;
    this.modules.network     = window.NetworkModule;
  },

  showLogin() {
    const loginScreen = document.getElementById('login-screen');
    loginScreen.style.display = 'flex';
    loginScreen.classList.add('animate-fadeInUp');

    const submitBtn = document.getElementById('login-submit-btn');
    const handleLoginClick = () => {
      const uid = document.getElementById('login-uid').value.trim();
      const pwd = document.getElementById('login-pwd').value.trim();
      this.login(uid, pwd);
    };

    submitBtn.onclick = handleLoginClick;

    // Press Enter to submit
    const inputs = [document.getElementById('login-uid'), document.getElementById('login-pwd')];
    inputs.forEach(input => {
      input.onkeydown = (e) => {
        if (e.key === 'Enter') handleLoginClick();
      };
    });
  },

  login(uid, pwd) {
    if (!uid || !pwd) { this.showToast('Please enter both ID and Password', 'warning'); return; }

    const settings = Storage.getSettings();
    const storedAdminPwd = settings.admin_password || '12345';

    let success = false;
    if (uid === 'genius' && pwd === storedAdminPwd) {
      this.currentUser = 'admin';
      success = true;
    } else if (uid === 'guest' && pwd === '12345') {
      this.currentUser = 'guest';
      success = true;
    }

    if (!success) {
      const card = document.querySelector('.login-card');
      const subtitle = document.querySelector('.login-subtitle');

      card.classList.add('denied');
      subtitle.innerHTML = `<span class="text-red font-bold" style="letter-spacing:0.04em;"><i class="fas fa-exclamation-triangle"></i> ACCESS DENIED &mdash; UNAUTHORIZED INTRUSION</span>`;

      // Clear password field only for retry
      document.getElementById('login-pwd').value = '';
      this.showToast('Authentication failed: invalid credentials', 'error');

      setTimeout(() => {
        card.classList.remove('denied');
        subtitle.textContent = 'OSINT GENIUS SECURE ACCESS GATEWAY';
      }, 1500);
      return;
    }

    // Success transition with custom clearance checking animation
    const loginScreen = document.getElementById('login-screen');
    const clearanceScreen = document.getElementById('clearance-screen');
    const clearanceLog = document.getElementById('clearance-log');
    const clearanceFill = document.getElementById('clearance-progress-fill');

    loginScreen.style.display = 'none';
    clearanceScreen.style.display = 'flex';
    clearanceLog.innerHTML = '';
    clearanceFill.style.width = '0%';

    const logs = [
      `[SYS] Requesting token validation...`,
      `[OK] Signature key accepted.`,
      `[SYS] Mapping role clearances: ${this.currentUser.toUpperCase()}`,
      `[OK] Permissions matrix built successfully.`,
      `[SYS] Initializing sandboxed workspace...`,
      `[OK] Environment loaded. Launching shell...`
    ];

    logs.forEach((log, idx) => {
      setTimeout(() => {
        if (!clearanceLog) return;
        const line = document.createElement('div');
        line.className = log.startsWith('[OK]') ? 't-green' : 't-cyan';
        line.textContent = log;
        clearanceLog.appendChild(line);
        clearanceLog.scrollTop = clearanceLog.scrollHeight;
      }, idx * 250);
    });

    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);
      }
      clearanceFill.style.width = progress + '%';
    }, 80);

    setTimeout(() => {
      clearanceScreen.style.display = 'none';
      
      // Clear inputs
      document.getElementById('login-uid').value = '';
      document.getElementById('login-pwd').value = '';

      const appEl = document.getElementById('app');
      appEl.style.display = 'flex';

      this.updateSidebarClearance();
      this.navigateTo('dashboard');
      this.showToast(`Established session for ${this.currentUser.toUpperCase()}`, 'success');
    }, 1800);
  },

  logout() {
    this.currentUser = null;
    document.getElementById('app').style.display = 'none';
    this.showLogin();
    this.showToast('Session terminated', 'info');
  },

  updateSidebarClearance() {
    const isGuest = this.currentUser === 'guest';
    const settings = Storage.getSettings();
    const allowed = settings.guest_modules || ['dashboard', 'ip', 'email', 'domain', 'phone'];

    document.querySelectorAll('.nav-item[data-module]').forEach(el => {
      const modId = el.dataset.module;
      if (modId === 'dashboard') {
        el.classList.remove('hidden');
        return;
      }
      if (isGuest && !allowed.includes(modId)) {
        el.classList.add('hidden');
      } else {
        el.classList.remove('hidden');
      }
    });
  },

  navigateTo(moduleId, tabId = null) {
    const isGuest = this.currentUser === 'guest';
    const settings = Storage.getSettings();
    const allowed = settings.guest_modules || ['dashboard', 'ip', 'email', 'domain', 'phone'];

    if (isGuest && moduleId !== 'dashboard' && !allowed.includes(moduleId)) {
      this.showToast('Access Denied: Administrator clearance required', 'error');
      return;
    }

    const mod = this.modules[moduleId];
    if (!mod) { this.showToast('Module not loaded: ' + moduleId, 'error'); return; }

    // Destroy previous
    if (this.currentModule && this.currentModule.destroy) {
      try { this.currentModule.destroy(); } catch(e) {}
    }

    // Update sidebar active state
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.module === moduleId);
    });

    // Render
    const content = document.getElementById('main-content');
    content.innerHTML = mod.render ? mod.render() : '<div class="module-area"><p>Module has no render()</p></div>';

    // Init
    this.currentModule = mod;
    if (mod.init) {
      try { mod.init(); } catch(e) { console.error('Module init error:', e); }
    }

    // Bind tabs if present
    this.bindTabs(content);

    // If specific tab is requested, trigger click
    if (tabId) {
      const tabBtn = content.querySelector(`.tab-btn[data-tab="${tabId}"]`);
      if (tabBtn) tabBtn.click();
    }
  },

  bindTabs(container) {
    container.querySelectorAll('.tab-bar').forEach(bar => {
      bar.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const target = btn.dataset.tab;
          bar.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const panelArea = bar.nextElementSibling;
          if (panelArea) {
            panelArea.querySelectorAll('.tab-panel').forEach(p => {
              p.classList.toggle('active', p.dataset.panel === target);
            });
          }
        });
      });
    });
  },

  bindSidebar() {
    document.querySelectorAll('.nav-item[data-module]').forEach(item => {
      item.addEventListener('click', () => {
        this.navigateTo(item.dataset.module);
      });
    });

    // Mobile sidebar toggle
    const menuBtn = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    if (menuBtn && sidebar) {
      menuBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
    }
  },

  initClock() {
    const el = document.getElementById('topbar-clock');
    if (!el) return;
    const update = () => {
      const now = new Date();
      el.textContent = now.toLocaleTimeString('en-US', { hour12: false });
    };
    update();
    setInterval(update, 1000);
  },

  initToasts() {
    if (!document.getElementById('toast-container')) {
      const tc = document.createElement('div');
      tc.id = 'toast-container';
      document.body.appendChild(tc);
    }
  },

  showToast(message, type = 'info', duration = 3500) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const icons = { success:'fa-check-circle', error:'fa-times-circle', warning:'fa-exclamation-triangle', info:'fa-info-circle' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${icons[type] || icons.info} toast-icon"></i><span>${Utils.escapeHtml(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('hiding');
      setTimeout(() => toast.remove(), 350);
    }, duration);
  },

  addToHistory(moduleId, query, data = null) {
    const modNames = {
      ip:'IP Intelligence', email:'Email OSINT', domain:'Domain Intel',
      username:'Username OSINT', phone:'Phone Intel', geo:'Geo & Maps',
      crypto:'Hash Tools', file:'File Intel', darkweb:'Dark Web', dashboard:'Dashboard',
      dorking:'Dorking', cve:'CVE Intel', person:'Person Profiler',
      threat:'Threat Intel', urlanalyzer:'URL Analyzer', network:'Network Tools'
    };
    Storage.addHistory({
      module: moduleId,
      moduleName: modNames[moduleId] || moduleId,
      query: String(query).substring(0, 200),
      preview: data ? JSON.stringify(data).substring(0, 100) : null
    });
  },

  // Leaflet dark map helper
  createDarkMap(containerId, lat = 20, lon = 0, zoom = 2) {
    if (this.mapInstances[containerId]) {
      try { this.mapInstances[containerId].remove(); } catch(e) {}
    }
    const map = L.map(containerId, { zoomControl: true, attributionControl: false }).setView([lat, lon], zoom);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19, subdomains: 'abcd'
    }).addTo(map);
    this.mapInstances[containerId] = map;
    return map;
  }
};

// Boot on load
document.addEventListener('DOMContentLoaded', () => App.init());
