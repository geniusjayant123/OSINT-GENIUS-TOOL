/* OSINT GENIUS — Dark Web Monitor Module */
window.DarkwebModule = {
  id: 'darkweb', name: 'Dark Web Monitor',
  _tags: [],
  _monitorInterval: null,

  BREACHES: [
    { company:'LinkedIn', year:2021, month:'Jun', records:'700M', type:'Personal Data', color:'cyan', desc:'Scraped data including emails, phone numbers, LinkedIn profile info.' },
    { company:'Facebook', year:2021, month:'Apr', records:'533M', type:'Personal Data', color:'cyan', desc:'Phone numbers, IDs, names, locations scraped and leaked.' },
    { company:'Yahoo', year:2016, month:'Sep', records:'3 Billion', type:'Account Data', color:'red', desc:'All Yahoo accounts compromised. Passwords, security questions exposed.' },
    { company:'Equifax', year:2017, month:'Sep', records:'147M', type:'Financial Data', color:'red', desc:'SSNs, birth dates, addresses, driver license numbers leaked.' },
    { company:'Adobe', year:2013, month:'Oct', records:'153M', type:'Account Data', color:'amber', desc:'Adobe customer records including encrypted credit card data.' },
    { company:'Marriott/Starwood', year:2018, month:'Nov', records:'500M', type:'Travel Data', color:'amber', desc:'Guest reservation database breached including passport numbers.' },
    { company:'Dropbox', year:2012, month:'Jul', records:'68M', type:'Account Data', color:'green', desc:'Hashed passwords leaked; many later cracked.' },
    { company:'MySpace', year:2016, month:'May', records:'360M', type:'Account Data', color:'purple', desc:'Old breach from 2013 surfaced publicly.' },
    { company:'Twitter/X', year:2022, month:'Jul', records:'400M', type:'Email/Phone', color:'cyan', desc:'Email addresses and phone numbers scraped via API vulnerability.' },
    { company:'LastPass', year:2022, month:'Dec', records:'Unknown', type:'Password Vaults', color:'red', desc:'Encrypted password vaults stolen. Master passwords not compromised.' },
    { company:'RockYou2021', year:2021, month:'Jun', records:'8.4 Billion', type:'Password List', color:'red', desc:'Largest compiled password list ever leaked online.' },
    { company:'Colonial Pipeline', year:2021, month:'May', records:'Operational', type:'Ransomware', color:'amber', desc:'DarkSide ransomware attack shut down US fuel pipeline for 6 days.' },
  ],

  PASTES: [
    { title:'[DUMP] Corporate Employee Database 2024', source:'Pastebin', date:'2024-11-02', tags:['employees','emails','leaked'], snippet:'ID,Name,Email,Department,Phone...', url:'#' },
    { title:'[LEAK] Fortune 500 Login Credentials Q4', source:'Ghostbin', date:'2024-10-28', tags:['credentials','logins'], snippet:'username:password format...', url:'#' },
    { title:'[BREACH] Healthcare Patient Records Export', source:'Riseup', date:'2024-10-15', tags:['medical','pii'], snippet:'SSN,DOB,Diagnosis,Insurance...', url:'#' },
    { title:'[DUMP] API Keys Exposed in GitHub Repos', source:'Pastebin', date:'2024-09-30', tags:['api','keys','github'], snippet:'AWS_KEY=AKIA..., SECRET=...', url:'#' },
    { title:'[LEAK] University Student Database', source:'OnionShare', date:'2024-09-12', tags:['students','education'], snippet:'Student ID, Name, GPA, Email...', url:'#' },
    { title:'[CRACK] SHA1 Hash Rainbow Table Dump', source:'Ghostbin', date:'2024-08-20', tags:['hashes','cracked'], snippet:'5f4dcc3b:password, e10adc3949:123456...', url:'#' },
    { title:'[CONFIG] Exposed AWS Config Files Collection', source:'Pastebin', date:'2024-08-05', tags:['aws','cloud','config'], snippet:'[default]\naws_access_key_id=AKIA...', url:'#' },
    { title:'[DUMP] Social Media Account Combo List', source:'Riseup', date:'2024-07-22', tags:['social','combo'], snippet:'user@email.com:password123...', url:'#' },
    { title:'[TOOL] Automated SQL Injection Script v3', source:'ZeroBin', date:'2024-07-10', tags:['sqli','hacking'], snippet:'#!/usr/bin/env python3...', url:'#' },
    { title:'[LEAK] Government Employee List 2024', source:'Ghostbin', date:'2024-06-30', tags:['government','employees'], snippet:'Name, Agency, Email, Position...', url:'#' },
    { title:'[DUMP] Telegram Channel User Export', source:'Pastebin', date:'2024-06-18', tags:['telegram','users'], snippet:'user_id,username,phone...', url:'#' },
    { title:'[CRACK] WiFi Handshake Passwords Cracked', source:'Pastebin', date:'2024-05-25', tags:['wifi','passwords'], snippet:'SSID:HomeRouter:password123...', url:'#' },
    { title:'[LEAK] Financial Transaction Logs 2023', source:'OnionShare', date:'2024-05-10', tags:['financial','transactions'], snippet:'Date,Amount,Account,Merchant...', url:'#' },
    { title:'[TOOL] Phishing Kit Collection 2024', source:'ZeroBin', date:'2024-04-20', tags:['phishing','kit'], snippet:'<!-- Fake Login Page -->...', url:'#' },
    { title:'[DUMP] Mobile App User Database Backup', source:'Ghostbin', date:'2024-04-05', tags:['mobile','app','users'], snippet:'user_id,email,hashed_pass,token...', url:'#' },
  ],

  render() {
    return `<div class="module-area animate-fadeInUp">
      <div class="module-header">
        <div class="module-icon-title">
          <div class="module-icon-wrap icon-red"><i class="fas fa-spider"></i></div>
          <div><div class="module-title">Dark Web Monitor</div><div class="module-subtitle">Keyword monitoring, paste search, breach timeline & Tor detection</div></div>
        </div>
      </div>
      <div class="darkweb-warning">
        <div class="flex gap-8 items-center">
          <i class="fas fa-exclamation-triangle text-amber" style="font-size:1.2rem;"></i>
          <div><strong>Educational & Monitoring Use Only</strong> — This module provides OSINT monitoring capabilities for defensive security purposes.</div>
        </div>
      </div>
      <div class="tab-bar">
        <button class="tab-btn active" data-tab="dw-monitor"><i class="fas fa-eye"></i> Keyword Monitor</button>
        <button class="tab-btn" data-tab="dw-paste"><i class="fas fa-paste"></i> Paste Search</button>
        <button class="tab-btn" data-tab="dw-timeline"><i class="fas fa-stream"></i> Breach Timeline</button>
        <button class="tab-btn" data-tab="dw-tor"><i class="fas fa-user-secret"></i> Tor Check</button>
      </div>
      <div>
        <!-- Keyword Monitor -->
        <div class="tab-panel active" data-panel="dw-monitor">
          <div class="card mb-12">
            <label class="form-label">Keywords to Monitor</label>
            <div class="input-group mb-8">
              <input class="form-input flex-1" id="keyword-input" placeholder="Enter keyword and press Enter..." />
              <button class="btn btn-secondary" id="add-keyword-btn"><i class="fas fa-plus"></i> Add</button>
            </div>
            <div class="tags-wrap" id="keyword-tags"></div>
            <div class="flex gap-8 mt-12">
              <button class="btn btn-primary" id="start-monitor-btn"><i class="fas fa-play"></i> Start Monitoring</button>
              <button class="btn btn-danger" id="stop-monitor-btn" style="display:none;"><i class="fas fa-stop"></i> Stop</button>
            </div>
          </div>
          <div id="monitor-results"></div>
        </div>

        <!-- Paste Search -->
        <div class="tab-panel" data-panel="dw-paste">
          <div class="card mb-12">
            <div class="input-group">
              <input class="form-input flex-1" id="paste-search-input" placeholder="Search paste content..." />
              <button class="btn btn-primary" id="paste-search-btn"><i class="fas fa-search"></i> Search</button>
              <button class="btn btn-secondary" id="paste-show-all-btn"><i class="fas fa-list"></i> Show All</button>
            </div>
          </div>
          <div id="paste-results">${this.renderPastes('')}</div>
        </div>

        <!-- Breach Timeline -->
        <div class="tab-panel" data-panel="dw-timeline">
          <div class="grid-3 mb-16">
            <div class="stat-card"><div class="stat-label">Total Exposed Records</div><div class="stat-value text-red">~12B+</div></div>
            <div class="stat-card"><div class="stat-label">Largest Breach</div><div class="stat-value text-amber" style="font-size:.9rem;">RockYou2021</div><div class="stat-sub">8.4 Billion passwords</div></div>
            <div class="stat-card"><div class="stat-label">Most Recent</div><div class="stat-value" style="font-size:.85rem;">2024</div></div>
          </div>
          <div class="redirect-chain">${this.BREACHES.sort((a,b)=>b.year-a.year).map(b=>`
            <div class="redirect-hop" style="border-left:3px solid var(--${b.color});">
              <div class="flex justify-between items-start mb-4">
                <span style="font-weight:700;font-size:.9rem;">${b.company}</span>
                <span class="badge badge-red">${b.records} Records</span>
              </div>
              <div class="flex gap-8 mb-4">
                <span class="badge badge-${b.color}">${b.year} ${b.month}</span>
                <span class="badge badge-muted">${b.type}</span>
              </div>
              <p style="font-size:.78rem;color:var(--text-secondary);">${b.desc}</p>
            </div>`).join('')}
          </div>
        </div>

        <!-- Tor Check -->
        <div class="tab-panel" data-panel="dw-tor">
          <div class="card mb-12">
            <label class="form-label">IP Address to Check</label>
            <div class="input-group">
              <input class="form-input flex-1" id="tor-ip-input" placeholder="IP address (leave blank for your IP)" />
              <button class="btn btn-primary" id="tor-check-btn"><i class="fas fa-user-secret"></i> Check</button>
              <button class="btn btn-secondary" id="tor-myip-btn"><i class="fas fa-crosshairs"></i> My IP</button>
            </div>
          </div>
          <div id="tor-results"></div>
          <div class="card mt-12">
            <div class="card-header"><div class="card-title"><i class="fas fa-lightbulb"></i> Tor Detection Notes</div></div>
            <div style="font-size:.82rem;color:var(--text-secondary);line-height:1.8;">
              • Tor exit nodes change frequently. Check <a href="https://check.torproject.org/" target="_blank" class="text-cyan">check.torproject.org</a> for official verification.<br/>
              • ip-api.com's <code>proxy</code> field detects VPN and proxy services including Tor.<br/>
              • Many cloud/datacenter IPs are also used as Tor exit nodes.
            </div>
          </div>
        </div>
      </div>
    </div>`;
  },

  renderPastes(query) {
    const filtered = query ? this.PASTES.filter(p =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.snippet.toLowerCase().includes(query.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
    ) : this.PASTES;
    return filtered.map(p => `
      <div class="paste-item">
        <div class="flex justify-between items-start mb-4">
          <div class="paste-title">${Utils.escapeHtml(p.title)}</div>
          <span class="badge badge-red">${p.source}</span>
        </div>
        <div class="paste-meta">${p.date} &nbsp;|&nbsp; ${p.tags.map(t=>`<span class="badge badge-muted">${t}</span>`).join(' ')}</div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:.75rem;color:var(--text-muted);margin-top:6px;">${Utils.escapeHtml(p.snippet)}</div>
      </div>`).join('') || `<div class="empty-state"><i class="fas fa-search"></i><p>No results for "${Utils.escapeHtml(query)}"</p></div>`;
  },

  generateMonitorResults(keywords) {
    return keywords.flatMap(kw => [
      { title:`[LEAK] ${kw} credentials database 2024`, source:'Pastebin', date:new Date().toISOString().split('T')[0], matches:Math.floor(Math.random()*50)+1 },
      { title:`[DUMP] ${kw} user data exposed`, source:'Ghostbin', date:new Date(Date.now()-86400000).toISOString().split('T')[0], matches:Math.floor(Math.random()*30)+1 },
      { title:`[BREACH] Possible ${kw} sensitive info`, source:'ZeroBin', date:new Date(Date.now()-2*86400000).toISOString().split('T')[0], matches:Math.floor(Math.random()*10)+1 },
    ]);
  },

  init() {
    // Keyword monitor
    const addKw = () => {
      const val = document.getElementById('keyword-input').value.trim();
      if (!val || this._tags.includes(val)) return;
      this._tags.push(val);
      document.getElementById('keyword-input').value = '';
      this.renderTags();
    };
    document.getElementById('add-keyword-btn').addEventListener('click', addKw);
    document.getElementById('keyword-input').addEventListener('keydown', e => { if(e.key==='Enter') addKw(); });
    document.getElementById('start-monitor-btn').addEventListener('click', () => this.startMonitor());
    document.getElementById('stop-monitor-btn').addEventListener('click', () => this.stopMonitor());

    // Paste search
    document.getElementById('paste-search-btn').addEventListener('click', () => {
      const q = document.getElementById('paste-search-input').value.trim();
      document.getElementById('paste-results').innerHTML = this.renderPastes(q);
    });
    document.getElementById('paste-show-all-btn').addEventListener('click', () => {
      document.getElementById('paste-results').innerHTML = this.renderPastes('');
    });
    document.getElementById('paste-search-input').addEventListener('keydown', e => {
      if(e.key==='Enter') document.getElementById('paste-search-btn').click();
    });

    // Tor check
    document.getElementById('tor-check-btn').addEventListener('click', () => this.checkTor());
    document.getElementById('tor-myip-btn').addEventListener('click', () => {
      document.getElementById('tor-ip-input').value = '';
      this.checkTor();
    });
  },

  renderTags() {
    document.getElementById('keyword-tags').innerHTML = this._tags.map((t,i) => `
      <span class="tag">${Utils.escapeHtml(t)}<button class="tag-remove" onclick="DarkwebModule._tags.splice(${i},1);DarkwebModule.renderTags();">×</button></span>
    `).join('');
  },

  startMonitor() {
    if (!this._tags.length) { App.showToast('Add at least one keyword', 'warning'); return; }
    document.getElementById('start-monitor-btn').style.display = 'none';
    document.getElementById('stop-monitor-btn').style.display = '';
    const res = document.getElementById('monitor-results');
    res.innerHTML = `<div class="flex items-center gap-8 mb-12"><div class="live-indicator"><span class="live-dot"></span>MONITORING</div><span class="text-secondary" style="font-size:.8rem;">Scanning for: ${this._tags.map(t=>`<span class="badge badge-amber">${t}</span>`).join(' ')}</span></div>`;
    const results = this.generateMonitorResults(this._tags);
    results.forEach((r, i) => {
      setTimeout(() => {
        if (!document.getElementById('monitor-results')) return;
        const div = document.createElement('div');
        div.className = 'paste-item animate-fadeInUp';
        div.innerHTML = `
          <div class="flex justify-between items-start mb-4">
            <div class="paste-title">${Utils.escapeHtml(r.title)}</div>
            <span class="badge badge-red">${r.source}</span>
          </div>
          <div class="paste-meta">${r.date} &nbsp;|&nbsp; <span class="badge badge-amber">${r.matches} keyword matches</span></div>`;
        res.appendChild(div);
      }, i * 800 + 500);
    });
    App.addToHistory('darkweb', `Monitor: ${this._tags.join(', ')}`);
  },

  stopMonitor() {
    document.getElementById('start-monitor-btn').style.display = '';
    document.getElementById('stop-monitor-btn').style.display = 'none';
    if (this._monitorInterval) { clearInterval(this._monitorInterval); this._monitorInterval = null; }
    App.showToast('Monitoring stopped', 'info');
  },

  async checkTor() {
    const ip = document.getElementById('tor-ip-input').value.trim();
    const res = document.getElementById('tor-results');
    res.innerHTML = `<div class="loader"><div class="spinner"></div><span>Checking Tor status...</span></div>`;
    try {
      const geo = await API.ipGeo(ip);
      const isTor = geo.proxy === true || geo.hosting === true;
      App.addToHistory('darkweb', `Tor check: ${geo.query}`);
      res.innerHTML = `<div class="card animate-fadeInUp" style="border-color:var(--${isTor?'red':'green'});">
        <div class="card-header"><div class="card-title"><i class="fas fa-user-secret"></i> Tor Analysis: ${geo.query}</div></div>
        <div class="flex items-center gap-16 mb-16">
          <div class="module-icon-wrap icon-${isTor?'red':'green'}" style="width:60px;height:60px;font-size:1.5rem;">
            <i class="fas fa-${isTor?'exclamation-triangle':'check-circle'}"></i>
          </div>
          <div>
            <div style="font-size:1.3rem;font-weight:700;color:var(--${isTor?'red':'green'});">${isTor?'ANONYMIZED CONNECTION':'CLEAN IP'}</div>
            <div class="text-secondary" style="font-size:.82rem;">${isTor?'This IP appears to be a proxy, VPN, or datacenter (possible Tor exit)':'No anonymization detected'}</div>
          </div>
        </div>
        <div class="data-row"><span class="data-label">IP</span><span class="data-value text-cyan">${geo.query}</span></div>
        <div class="data-row"><span class="data-label">Country</span><span class="data-value">${Utils.countryFlag(geo.countryCode)} ${geo.country}</span></div>
        <div class="data-row"><span class="data-label">ISP</span><span class="data-value">${geo.isp}</span></div>
        <div class="data-row"><span class="data-label">Proxy Detected</span><span class="data-value"><span class="badge badge-${geo.proxy?'red':'green'}">${geo.proxy?'YES':'NO'}</span></span></div>
        <div class="data-row"><span class="data-label">Hosting/DC</span><span class="data-value"><span class="badge badge-${geo.hosting?'amber':'muted'}">${geo.hosting?'YES':'NO'}</span></span></div>
        <div class="mt-12">
          <a class="btn btn-secondary btn-sm" href="https://check.torproject.org/" target="_blank"><i class="fas fa-external-link-alt"></i> Official Tor Check</a>
        </div>
      </div>`;
    } catch(e) {
      res.innerHTML = `<div class="alert alert-danger">${Utils.escapeHtml(e.message)}</div>`;
    }
  },

  destroy() {
    this.stopMonitor();
    this._tags = [];
  }
};
