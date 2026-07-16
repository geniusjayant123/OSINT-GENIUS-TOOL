/* ================================================================
   OSINT GENIUS — Module: Dashboard (Home Screen)
   ================================================================ */
window.DashboardModule = {
  id: 'dashboard',
  name: 'Intelligence Dashboard',

  TIPS: [
    'Use "site:" operator in Google to restrict results to a specific domain.',
    'WHOIS records can reveal registrant info, creation date, and nameservers.',
    'Check certificate transparency logs at crt.sh to find subdomains.',
    'Shodan InternetDB provides free port and CVE data for any public IP.',
    'Email headers reveal the full path an email traveled through servers.',
    'EXIF metadata in photos can expose GPS coordinates and device info.',
    'HaveIBeenPwned uses k-anonymity — your full password hash is never sent.',
    'BGP routing data from BGPView can reveal ASN ownership and IP ranges.',
  ],

  QUICK_MODULES: [
    { id:'ip',          icon:'fa-network-wired', label:'IP Intelligence',  color:'cyan' },
    { id:'email',       icon:'fa-envelope',      label:'Email OSINT',      color:'green' },
    { id:'domain',      icon:'fa-globe',         label:'Domain Intel',     color:'cyan' },
    { id:'username',    icon:'fa-user-secret',   label:'Username OSINT',   color:'purple' },
    { id:'phone',       icon:'fa-mobile-alt',    label:'Phone Intel',      color:'green' },
    { id:'geo',         icon:'fa-map-marked-alt',label:'Geo & Maps',       color:'cyan' },
    { id:'crypto',      icon:'fa-hashtag',       label:'Hash & Crypto',    color:'amber' },
    { id:'file',        icon:'fa-file-alt',      label:'File Intel',       color:'green' },
    { id:'darkweb',     icon:'fa-spider',        label:'Dark Web',         color:'red' },
    { id:'dorking',     icon:'fa-search',        label:'Dorking',          color:'purple' },
    { id:'cve',         icon:'fa-shield-alt',    label:'CVE Intel',        color:'red' },
    { id:'person',      icon:'fa-user-tie',      label:'Person Profiler',  color:'cyan' },
    { id:'threat',      icon:'fa-radiation',     label:'Threat Intel',     color:'red' },
    { id:'urlanalyzer', icon:'fa-link',          label:'URL Analyzer',     color:'amber' },
    { id:'network',     icon:'fa-project-diagram',label:'Network Tools',   color:'green' },
  ],

  render() {
    const tip = this.TIPS[Math.floor(Math.random() * this.TIPS.length)];
    const stats = Storage.getStats();
    const hist = Storage.getHistory().slice(0, 5);
    const isGuest = window.App.currentUser === 'guest';
    const settings = Storage.getSettings();
    const allowed = settings.guest_modules || ['dashboard'];
    
    const visibleModules = isGuest
      ? this.QUICK_MODULES.filter(m => allowed.includes(m.id))
      : this.QUICK_MODULES;

    return `<div class="module-area animate-fadeInUp">
      <!-- Header -->
      <div class="module-header">
        <div class="module-title-group">
          <div class="module-icon-title">
            <div class="module-icon-wrap icon-cyan"><i class="fas fa-th-large"></i></div>
            <div>
              <div class="module-title glitch-text" data-text="OSINT GENIUS">OSINT GENIUS</div>
              <div class="module-subtitle">Intelligence at your fingertips &mdash; ${visibleModules.length} tools available</div>
            </div>
          </div>
        </div>
        <div class="module-actions">
          <button class="btn btn-secondary btn-sm" onclick="Report.openReport()">
            <i class="fas fa-file-export"></i> Export Report
          </button>
        </div>
      </div>

      <!-- OSINT Tip -->
      <div class="alert alert-info mb-16">
        <i class="fas fa-lightbulb text-cyan"></i>
        <div><strong>OSINT Tip:</strong> ${tip}</div>
      </div>

      <!-- Stats -->
      <div class="grid-4 mb-20 stagger">
        <div class="stat-card hover-glow-cyan animate-fadeInUp">
          <div class="stat-label">Total Cases</div>
          <div class="stat-value text-cyan">${stats.totalCases}</div>
          <div class="stat-sub">Saved investigations</div>
        </div>
        <div class="stat-card animate-fadeInUp">
          <div class="stat-label">Searches Today</div>
          <div class="stat-value text-green">${stats.searchesToday}</div>
          <div class="stat-sub">Queries this session</div>
        </div>
        <div class="stat-card animate-fadeInUp">
          <div class="stat-label">Total History</div>
          <div class="stat-value text-amber">${stats.totalSearches}</div>
          <div class="stat-sub">All-time searches</div>
        </div>
        <div class="stat-card animate-fadeInUp">
          <div class="stat-label">Active Modules</div>
          <div class="stat-value text-purple">${visibleModules.length}</div>
          <div class="stat-sub">Intelligence tools</div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tab-bar">
        <button class="tab-btn active" data-tab="overview"><i class="fas fa-th"></i> Quick Launch</button>
        <button class="tab-btn" data-tab="cases"><i class="fas fa-briefcase"></i> Cases</button>
        <button class="tab-btn" data-tab="history"><i class="fas fa-history"></i> History</button>
        <button class="tab-btn" data-tab="notes"><i class="fas fa-sticky-note"></i> Notes</button>
        <button class="tab-btn" data-tab="export"><i class="fas fa-download"></i> Export</button>
        ${!isGuest ? `<button class="tab-btn" data-tab="security"><i class="fas fa-shield-alt"></i> Clearance</button>` : ''}
      </div>

      <div>
        <!-- Overview Tab -->
        <div class="tab-panel active" data-panel="overview">
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;" class="stagger">
            ${visibleModules.map(m => `
              <div class="card hover-glow-cyan animate-fadeInUp" style="cursor:pointer;text-align:center;padding:18px 12px;" onclick="App.navigateTo('${m.id}')">
                <div class="module-icon-wrap icon-${m.color}" style="margin:0 auto 10px;"><i class="fas ${m.icon}"></i></div>
                <div style="font-size:0.78rem;font-weight:600;color:var(--text-secondary);">${m.label}</div>
              </div>
            `).join('')}
          </div>

          ${hist.length ? `
          <div class="mt-24">
            <div class="card">
              <div class="card-header">
                <div class="card-title"><i class="fas fa-clock"></i> Recent Activity</div>
              </div>
              <div class="history-list">
                ${hist.map(h => `
                  <div class="history-item">
                    <i class="fas fa-chevron-right text-cyan"></i>
                    <span class="badge badge-cyan">${h.moduleName}</span>
                    <span style="font-family:'JetBrains Mono',monospace;font-size:.8rem;">${Utils.escapeHtml(h.query)}</span>
                    <span class="history-time">${Utils.timeAgo(h.timestamp)}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>` : ''}
        </div>

        <!-- Cases Tab -->
        <div class="tab-panel" data-panel="cases">
          <div class="card mb-16">
            <div class="card-header">
              <div class="card-title"><i class="fas fa-plus"></i> New Investigation Case</div>
            </div>
            <div class="grid-2" style="gap:12px;">
              <div>
                <label class="form-label">Case Name</label>
                <input class="form-input" id="case-name" placeholder="e.g. Target: suspicious-domain.com" />
              </div>
              <div>
                <label class="form-label">Target</label>
                <input class="form-input" id="case-target" placeholder="IP / Domain / Email / Name" />
              </div>
              <div>
                <label class="form-label">Case Type</label>
                <select class="form-select w-full" id="case-type">
                  <option value="ip">IP Investigation</option>
                  <option value="domain">Domain Investigation</option>
                  <option value="person">Person Investigation</option>
                  <option value="email">Email Investigation</option>
                  <option value="malware">Malware Analysis</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div>
                <label class="form-label">Description</label>
                <input class="form-input" id="case-desc" placeholder="Brief description..." />
              </div>
            </div>
            <button class="btn btn-primary mt-12" id="save-case-btn"><i class="fas fa-save"></i> Establish Case</button>
          </div>

          <div id="cases-list">
            ${this.renderCases()}
          </div>
        </div>

        <!-- History Tab -->
        <div class="tab-panel" data-panel="history">
          <div class="card mb-12">
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-8">
                <label class="form-label mb-0" style="margin-bottom:0;">Filter Module</label>
                <select class="form-select" id="hist-filter">
                  <option value="all">All Modules</option>
                  ${visibleModules.map(m=>`<option value="${m.id}">${m.label}</option>`).join('')}
                </select>
              </div>
              <button class="btn btn-danger btn-sm" id="clear-history-btn"><i class="fas fa-trash-alt"></i> Clear Logs</button>
            </div>
          </div>
          <div id="history-list">${this.renderHistory('all')}</div>
        </div>

        <!-- Notes Tab -->
        <div class="tab-panel" data-panel="notes">
          <div class="card">
            <div class="card-header">
              <div class="card-title"><i class="fas fa-sticky-note"></i> Scratchpad (Local Persistence)</div>
              <div class="flex gap-8 items-center">
                <span id="notes-saved-label" style="font-size:.72rem;color:var(--text-muted);">Saved local storage</span>
                <button class="btn btn-danger btn-sm" id="clear-notes-btn"><i class="fas fa-trash-alt"></i> Clear Notes</button>
              </div>
            </div>
            <textarea class="notes-area" id="global-notes" placeholder="Jot down IOCs, coordinates, usernames, domain discoveries, or case findings here...">${Utils.escapeHtml(Storage.getNotes())}</textarea>
            <div id="notes-stats" class="text-muted mt-8" style="font-size:.75rem;text-align:right;">0 words, 0 chars</div>
          </div>
        </div>

        <!-- Export Tab -->
        <div class="tab-panel" data-panel="export">
          <div class="grid-2">
            <div class="card">
              <div class="card-header"><div class="card-title"><i class="fas fa-download"></i> Export Data</div></div>
              <div class="flex-col gap-8">
                <button class="btn btn-primary w-full" id="export-cases-btn">
                  <i class="fas fa-briefcase"></i> Export All Cases (JSON)
                </button>
                <button class="btn btn-secondary w-full" id="export-history-btn">
                  <i class="fas fa-history"></i> Export Search History (JSON)
                </button>
                <button class="btn btn-secondary w-full" id="export-all-btn">
                  <i class="fas fa-database"></i> Export Everything (JSON)
                </button>
                <button class="btn btn-success w-full" id="export-report-btn">
                  <i class="fas fa-file-code"></i> Generate HTML Report
                </button>
              </div>
            </div>
            <div class="card">
              <div class="card-header"><div class="card-title"><i class="fas fa-info-circle"></i> Export Info</div></div>
              <div class="terminal-output">
<span class="t-cyan">Cases:</span>      ${Storage.getCases().length} records
<span class="t-cyan">History:</span>    ${Storage.getHistory().length} entries
<span class="t-cyan">Notes:</span>      ${Storage.getNotes().length} characters
<span class="t-cyan">Format:</span>     JSON / HTML
<span class="t-cyan">Version:</span>    OSINT GENIUS v1.0
<span class="t-cyan">Export:</span>     Local device only
              </div>
            </div>
          </div>
        </div>

        <!-- Security Clearance Tab (Admin only) -->
        ${!isGuest ? `
        <div class="tab-panel" data-panel="security">
          <div class="grid-2">
            <!-- Guest Access Control -->
            <div class="card">
              <div class="card-header"><div class="card-title"><i class="fas fa-user-shield"></i> Guest Access Control</div></div>
              <p style="font-size:.78rem;color:var(--text-secondary);margin-bottom:12px;">Toggle which tools the Guest user is allowed to access.</p>
              <div class="flex-col gap-8" id="guest-access-list" style="max-height: 260px; overflow-y: auto; padding-right: 8px; border: 1px solid var(--border-subtle); padding: 12px; border-radius: 8px; background: rgba(0,0,0,0.2);">
                <!-- Checkboxes populated in init() -->
              </div>
              <button class="btn btn-primary mt-12 w-full" id="save-clearance-btn"><i class="fas fa-save"></i> Save Permissions</button>
            </div>
            
            <!-- Admin Password Change -->
            <div class="card">
              <div class="card-header"><div class="card-title"><i class="fas fa-key"></i> Change Admin Password</div></div>
              <div class="mb-12">
                <label class="form-label">Current Password</label>
                <input class="form-input" type="password" id="admin-curr-pwd" placeholder="Enter current password" />
              </div>
              <div class="mb-12">
                <label class="form-label">New Password</label>
                <input class="form-input" type="password" id="admin-new-pwd" placeholder="Enter new password" />
              </div>
              <div class="mb-12">
                <label class="form-label">Confirm New Password</label>
                <input class="form-input" type="password" id="admin-conf-pwd" placeholder="Confirm new password" />
              </div>
              <button class="btn btn-secondary w-full" id="change-admin-pwd-btn"><i class="fas fa-save"></i> Update Password</button>
            </div>
          </div>
        </div>` : ''}
      </div>
    </div>`;
  },

  renderCases() {
    const cases = Storage.getCases();
    if (!cases.length) return `<div class="empty-state"><i class="fas fa-briefcase"></i><p>No investigation cases yet. Create your first case above.</p></div>`;
    const typeColors = { ip:'cyan', domain:'green', person:'purple', email:'amber', malware:'red', custom:'muted' };
    return `<div class="grid-2">${cases.map(c => `
      <div class="case-card">
        <div class="case-card-header">
          <div>
            <div class="case-title">${Utils.escapeHtml(c.name || 'Untitled')}</div>
            <div class="case-meta">${Utils.formatDate(c.createdAt)}</div>
          </div>
          <div class="flex gap-4">
            <span class="badge badge-${typeColors[c.type]||'muted'}">${(c.type||'custom').toUpperCase()}</span>
            <button class="btn btn-danger btn-sm btn-icon" onclick="DashboardModule.deleteCase('${c.id}')"><i class="fas fa-trash"></i></button>
          </div>
        </div>
        ${c.target ? `<div class="data-row"><span class="data-label">Target</span><span class="data-value text-cyan">${Utils.escapeHtml(c.target)}</span></div>` : ''}
        ${c.description ? `<div style="font-size:.8rem;color:var(--text-secondary);margin-top:8px;">${Utils.escapeHtml(c.description)}</div>` : ''}
      </div>
    `).join('')}</div>`;
  },

  renderHistory(filter) {
    let hist = Storage.getHistory();
    if (filter && filter !== 'all') hist = hist.filter(h => h.module === filter);
    if (!hist.length) return `<div class="empty-state"><i class="fas fa-history"></i><p>No search history ${filter !== 'all' ? 'for this module' : 'yet'}.</p></div>`;
    return `<div class="history-list">${hist.slice(0,100).map(h => `
      <div class="history-item">
        <i class="fas fa-angle-right text-cyan"></i>
        <span class="badge badge-cyan" style="font-size:.65rem;">${h.moduleName||h.module}</span>
        <span style="font-family:'JetBrains Mono',monospace;font-size:.8rem;flex:1;">${Utils.escapeHtml(h.query)}</span>
        <span class="history-time">${Utils.timeAgo(h.timestamp)}</span>
      </div>
    `).join('')}</div>`;
  },

  deleteCase(id) {
    if (!confirm('Delete this case?')) return;
    Storage.deleteCase(id);
    document.getElementById('cases-list').innerHTML = this.renderCases();
    App.showToast('Case deleted', 'info');
  },

  init() {
    // Save case
    const saveBtn = document.getElementById('save-case-btn');
    if (saveBtn) saveBtn.addEventListener('click', () => {
      const name = document.getElementById('case-name').value.trim();
      if (!name) { App.showToast('Case name is required', 'warning'); return; }
      Storage.saveCase({
        name,
        target: document.getElementById('case-target').value.trim(),
        type: document.getElementById('case-type').value,
        description: document.getElementById('case-desc').value.trim()
      });
      document.getElementById('cases-list').innerHTML = this.renderCases();
      ['case-name','case-target','case-desc'].forEach(id => { const el = document.getElementById(id); if(el) el.value=''; });
      App.showToast('Case saved!', 'success');
    });

    // History filter
    const histFilter = document.getElementById('hist-filter');
    if (histFilter) histFilter.addEventListener('change', () => {
      document.getElementById('history-list').innerHTML = this.renderHistory(histFilter.value || 'all');
    });

    // Clear history
    const clearHistBtn = document.getElementById('clear-history-btn');
    if (clearHistBtn) clearHistBtn.addEventListener('click', () => {
      if (!confirm('Clear all search history?')) return;
      Storage.clearHistory();
      document.getElementById('history-list').innerHTML = this.renderHistory('all');
      App.showToast('History cleared', 'info');
    });

    // Notes auto-save
    const notesEl = document.getElementById('global-notes');
    const notesSavedLabel = document.getElementById('notes-saved-label');
    const notesStats = document.getElementById('notes-stats');
    if (notesEl) {
      const updateStats = () => {
        const text = notesEl.value;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        if (notesStats) notesStats.textContent = `${words} words, ${text.length} chars`;
      };
      updateStats();
      const saveNotes = Utils.debounce(() => {
        Storage.saveNotes(notesEl.value);
        if (notesSavedLabel) notesSavedLabel.textContent = 'Saved ' + new Date().toLocaleTimeString();
      }, 1000);
      notesEl.addEventListener('input', () => { updateStats(); saveNotes(); });
    }

    // Clear notes
    const clearNotesBtn = document.getElementById('clear-notes-btn');
    if (clearNotesBtn) clearNotesBtn.addEventListener('click', () => {
      if (!confirm('Clear all notes?')) return;
      Storage.saveNotes('');
      if (notesEl) notesEl.value = '';
      App.showToast('Notes cleared', 'info');
    });

    // Export buttons
    document.getElementById('export-cases-btn')?.addEventListener('click', () => {
      Storage.downloadJSON(Storage.getCases(), 'osint-genius-cases.json');
      App.showToast('Cases exported!', 'success');
    });
    document.getElementById('export-history-btn')?.addEventListener('click', () => {
      Storage.downloadJSON(Storage.getHistory(), 'osint-genius-history.json');
      App.showToast('History exported!', 'success');
    });
    document.getElementById('export-all-btn')?.addEventListener('click', () => {
      Storage.downloadJSON(Storage.exportAll(), 'osint-genius-export.json');
      App.showToast('Full export done!', 'success');
    });
    document.getElementById('export-report-btn')?.addEventListener('click', () => {
      Report.openReport();
      App.showToast('Report generated!', 'success');
    });

    // Populate guest access checkboxes (Admin only)
    if (window.App.currentUser === 'admin') {
      const guestList = document.getElementById('guest-access-list');
      if (guestList) {
        const allowed = Storage.getSettings().guest_modules || ['dashboard'];
        guestList.innerHTML = this.QUICK_MODULES.map(m => `
          <div class="flex items-center gap-8" style="font-size:.85rem; padding: 4px 0;">
            <input type="checkbox" id="check-${m.id}" value="${m.id}" ${allowed.includes(m.id) ? 'checked' : ''} style="accent-color: var(--cyan); cursor: pointer;" />
            <label for="check-${m.id}" style="cursor:pointer; color: var(--text-primary); font-weight: 500;">${m.label}</label>
          </div>`).join('');
      }

      // Save Clearance Permissions
      document.getElementById('save-clearance-btn')?.addEventListener('click', () => {
        const checked = ['dashboard'];
        this.QUICK_MODULES.forEach(m => {
          const cb = document.getElementById(`check-${m.id}`);
          if (cb && cb.checked) checked.push(m.id);
        });
        Storage.saveSetting('guest_modules', checked);
        window.App.updateSidebarClearance();
        App.showToast('Guest permissions updated!', 'success');
      });

      // Update Admin Password
      document.getElementById('change-admin-pwd-btn')?.addEventListener('click', () => {
        const curr = document.getElementById('admin-curr-pwd').value.trim();
        const newPwd = document.getElementById('admin-new-pwd').value.trim();
        const conf = document.getElementById('admin-conf-pwd').value.trim();

        const storedPwd = Storage.getSettings().admin_password || '12345';
        if (curr !== storedPwd) { App.showToast('Incorrect current password', 'error'); return; }
        if (!newPwd) { App.showToast('New password cannot be empty', 'warning'); return; }
        if (newPwd !== conf) { App.showToast('Passwords do not match', 'error'); return; }

        Storage.saveSetting('admin_password', newPwd);
        document.getElementById('admin-curr-pwd').value = '';
        document.getElementById('admin-new-pwd').value = '';
        document.getElementById('admin-conf-pwd').value = '';
        App.showToast('Admin password changed successfully!', 'success');
      });
    }
  }
};
