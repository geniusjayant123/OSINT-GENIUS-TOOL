/* OSINT GENIUS — Email OSINT Module */
window.EmailModule = {
  id: 'email', name: 'Email OSINT',
  DISPOSABLE: ['mailinator.com','tempmail.com','guerrillamail.com','10minutemail.com','throwaway.email','yopmail.com','fakeinbox.com','trashmail.com','sharklasers.com','getairmail.com','dispostable.com','maildrop.cc','spamgourmet.com','tempinbox.com','throwam.com'],

  render() {
    return `<div class="module-area animate-fadeInUp">
      <div class="module-header">
        <div class="module-icon-title">
          <div class="module-icon-wrap icon-green"><i class="fas fa-envelope"></i></div>
          <div><div class="module-title">Email OSINT</div><div class="module-subtitle">Lookup, header analysis & breach exposure check</div></div>
        </div>
      </div>
      <div class="tab-bar">
        <button class="tab-btn active" data-tab="em-lookup"><i class="fas fa-search"></i> Email Lookup</button>
        <button class="tab-btn" data-tab="em-header"><i class="fas fa-code"></i> Header Analyzer</button>
        <button class="tab-btn" data-tab="em-breach"><i class="fas fa-skull-crossbones"></i> Breach Check</button>
      </div>
      <div>
        <!-- Lookup -->
        <div class="tab-panel active animate-fadeInUp" data-panel="em-lookup">
          <div class="card mb-12">
            <div class="input-group">
              <div class="input-wrap flex-1">
                <i class="fas fa-envelope input-icon"></i>
                <input class="form-input has-icon" id="email-input" placeholder="target@example.com" />
              </div>
              <button class="btn btn-primary" id="email-lookup-btn"><i class="fas fa-search"></i> Analyze</button>
            </div>
          </div>
          <div id="email-results"></div>
        </div>

        <!-- Header Analyzer -->
        <div class="tab-panel" data-panel="em-header">
          <div class="card mb-12">
            <label class="form-label">Paste Raw Email Headers</label>
            <textarea class="form-textarea" id="header-input" placeholder="Received: from mail.example.com...&#10;From: sender@example.com&#10;To: recipient@example.com&#10;..." style="min-height:180px;"></textarea>
            <div class="flex gap-8 mt-8">
              <button class="btn btn-primary" id="parse-header-btn"><i class="fas fa-cogs"></i> Parse Headers</button>
              <button class="btn btn-secondary" id="clear-header-btn"><i class="fas fa-times"></i> Clear</button>
            </div>
          </div>
          <div id="header-results"></div>
        </div>

        <!-- Breach Check -->
        <div class="tab-panel" data-panel="em-breach">
          <div class="card mb-12">
            <div class="alert alert-info mb-12">
              <i class="fas fa-shield-alt"></i>
              <div>Uses k-anonymity model — only first 5 characters of your SHA-1 hash are sent. Your full email is never transmitted.</div>
            </div>
            <div class="input-group">
              <div class="input-wrap flex-1">
                <i class="fas fa-envelope input-icon"></i>
                <input class="form-input has-icon" id="breach-email" placeholder="email@example.com" />
              </div>
              <button class="btn btn-primary" id="breach-check-btn"><i class="fas fa-skull-crossbones"></i> Check Breaches</button>
            </div>
          </div>
          <div id="breach-results"></div>
        </div>
      </div>
    </div>`;
  },

  init() {
    document.getElementById('email-lookup-btn').addEventListener('click', () => this.lookupEmail());
    document.getElementById('email-input').addEventListener('keydown', e => { if(e.key==='Enter') this.lookupEmail(); });
    document.getElementById('parse-header-btn').addEventListener('click', () => this.parseHeaders());
    document.getElementById('clear-header-btn').addEventListener('click', () => { document.getElementById('header-input').value=''; document.getElementById('header-results').innerHTML=''; });
    document.getElementById('breach-check-btn').addEventListener('click', () => this.checkBreach());
    document.getElementById('breach-email').addEventListener('keydown', e => { if(e.key==='Enter') this.checkBreach(); });
  },

  async lookupEmail() {
    const email = document.getElementById('email-input').value.trim();
    if (!Utils.isValidEmail(email)) { App.showToast('Enter a valid email address', 'warning'); return; }
    const res = document.getElementById('email-results');
    res.innerHTML = `<div class="loader"><div class="spinner"></div><span>Analyzing ${email}...</span></div>`;
    const domain = email.split('@')[1];
    const isDisposable = this.DISPOSABLE.includes(domain.toLowerCase());
    try {
      const mx = await API.dnsQuery(domain, 'MX');
      const mxRecords = mx?.Answer || [];
      App.addToHistory('email', email);
      res.innerHTML = `<div class="card scan-result animate-fadeInUp">
        <div class="card-header"><div class="card-title"><i class="fas fa-envelope"></i> Email Analysis: ${Utils.escapeHtml(email)}</div></div>
        <div class="grid-2 mb-16">
          <div class="stat-card"><div class="stat-label">Format</div><div class="stat-value text-green"><i class="fas fa-check"></i></div><div class="stat-sub">Valid email format</div></div>
          <div class="stat-card"><div class="stat-label">Disposable</div><div class="stat-value ${isDisposable?'text-red':'text-green'}">${isDisposable?'YES':'NO'}</div><div class="stat-sub">${isDisposable?'Temporary email service':'Looks legitimate'}</div></div>
        </div>
        ${isDisposable ? `<div class="alert alert-warning mb-12"><i class="fas fa-exclamation-triangle"></i><div><strong>Disposable Email Detected!</strong> This domain (${domain}) is a known temporary email provider.</div></div>` : ''}
        <div class="card-header mt-12"><div class="card-title"><i class="fas fa-server"></i> MX Records (${mxRecords.length})</div></div>
        ${mxRecords.length ? mxRecords.map(r => `<div class="data-row"><span class="data-label">MX ${r.data.split(' ')[0]}</span><span class="data-value text-cyan">${r.data.split(' ').slice(1).join(' ')}</span></div>`).join('') : '<div class="text-muted" style="font-size:.8rem;">No MX records — domain may not accept email</div>'}
        <div class="mt-16 flex gap-8">
          <a class="btn btn-secondary btn-sm" href="https://mxtoolbox.com/EmailHeaders.aspx?email=${encodeURIComponent(email)}" target="_blank"><i class="fas fa-tools"></i> MXToolbox</a>
          <a class="btn btn-secondary btn-sm" href="https://haveibeenpwned.com/account/${encodeURIComponent(email)}" target="_blank"><i class="fas fa-skull-crossbones"></i> HIBP</a>
        </div>
      </div>`;
    } catch(e) {
      res.innerHTML = `<div class="alert alert-danger"><i class="fas fa-times-circle"></i> ${Utils.escapeHtml(e.message)}</div>`;
    }
  },

  parseHeaders() {
    const raw = document.getElementById('header-input').value.trim();
    if (!raw) { App.showToast('Paste email headers first', 'warning'); return; }
    const res = document.getElementById('header-results');
    const lines = raw.split('\n');
    const fields = {};
    let current = '';
    lines.forEach(line => {
      if (/^\S/.test(line)) { const [key,...rest] = line.split(':'); current=key.trim(); if (!fields[current]) fields[current]=[]; fields[current].push(rest.join(':').trim()); }
      else if (current && fields[current]) { fields[current][fields[current].length-1] += ' '+line.trim(); }
    });
    const received = Object.entries(fields).filter(([k]) => k.toLowerCase()==='received');
    const ipRegex = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;
    const importantFields = ['From','To','Subject','Date','Message-ID','MIME-Version','X-Spam-Score','X-Mailer','X-Originating-IP','DKIM-Signature','Received-SPF','Authentication-Results'];
    res.innerHTML = `<div class="card mb-12">
      <div class="card-header"><div class="card-title"><i class="fas fa-info-circle"></i> Key Headers</div></div>
      ${importantFields.map(f => {
        const val = fields[f]?.[0];
        return val ? `<div class="data-row"><span class="data-label">${f}</span><span class="data-value mono" style="font-size:.75rem;word-break:break-all;">${Utils.escapeHtml(val.substring(0,200))}</span></div>` : '';
      }).join('')}
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title"><i class="fas fa-route"></i> Email Hop Path (${received.length} hops)</div></div>
      ${received.map(([,vals],i) => {
        const val = vals[0] || '';
        const ips = [...new Set(val.match(ipRegex)||[])].filter(ip => !ip.startsWith('127.') && !ip.startsWith('10.') && !ip.startsWith('192.168.'));
        return `<div class="header-hop">
          <span class="header-hop-num">${received.length-i}</span>
          <span style="font-size:.75rem;color:var(--text-secondary);">${Utils.escapeHtml(val.substring(0,200))}</span>
          ${ips.length ? `<div class="mt-4">${ips.map(ip=>`<span class="badge badge-cyan" style="cursor:pointer;" onclick="document.getElementById('ip-input').value='${ip}';App.navigateTo('ip');">${ip}</span>`).join(' ')}</div>` : ''}
        </div>`;
      }).join('')}
    </div>`;
  },

  async checkBreach() {
    const email = document.getElementById('breach-email').value.trim();
    if (!Utils.isValidEmail(email)) { App.showToast('Enter a valid email address', 'warning'); return; }
    const res = document.getElementById('breach-results');
    res.innerHTML = `<div class="loader"><div class="spinner"></div><span>Checking breach databases...</span></div>`;
    try {
      const sha1 = await Utils.sha1(email.toLowerCase());
      const prefix = sha1.substring(0,5).toUpperCase();
      const suffix = sha1.substring(5).toUpperCase();
      const data = await API.getText(`https://api.pwnedpasswords.com/range/${prefix}`);
      const lines = data.split('\n');
      const found = lines.find(l => l.split(':')[0] === suffix);
      const count = found ? parseInt(found.split(':')[1]) : 0;
      App.addToHistory('email', `breach:${email}`);
      if (count > 0) {
        res.innerHTML = `<div class="card scan-result animate-fadeInUp" style="border-color:var(--red);">
          <div class="card-header"><div class="card-title text-red"><i class="fas fa-skull-crossbones"></i> ACCOUNT BREACHED</div></div>
          <div class="alert alert-danger mb-12"><i class="fas fa-exclamation-triangle"></i><div><strong>${email}</strong> was found in <strong>${count.toLocaleString()}</strong> data breach(es). Change your password immediately!</div></div>
          <div class="grid-3">
            <div class="stat-card"><div class="stat-label">Times Exposed</div><div class="stat-value text-red">${count.toLocaleString()}</div></div>
            <div class="stat-card"><div class="stat-label">Risk Level</div><div class="stat-value text-red">${count>10000?'CRITICAL':count>1000?'HIGH':'MEDIUM'}</div></div>
            <div class="stat-card"><div class="stat-label">Action</div><div class="stat-value" style="font-size:.9rem;">Change PWD</div></div>
          </div>
          <div class="mt-16"><a class="btn btn-danger" href="https://haveibeenpwned.com/account/${encodeURIComponent(email)}" target="_blank"><i class="fas fa-external-link-alt"></i> View Details on HIBP</a></div>
        </div>`;
      } else {
        res.innerHTML = `<div class="card scan-result animate-fadeInUp" style="border-color:var(--green);">
          <div class="card-header"><div class="card-title text-green"><i class="fas fa-shield-alt"></i> NO BREACHES FOUND</div></div>
          <div class="alert alert-success"><i class="fas fa-check-circle"></i><div><strong>${Utils.escapeHtml(email)}</strong> was not found in any known data breaches.</div></div>
          <div class="text-muted" style="font-size:.8rem;margin-top:8px;">Note: This only checks the HaveIBeenPwned database. Other breaches may exist.</div>
        </div>`;
      }
    } catch(e) {
      res.innerHTML = `<div class="alert alert-warning"><i class="fas fa-exclamation-triangle"></i> <strong>CORS Blocked:</strong> The HaveIBeenPwned API blocked this request from browser. Try using a CORS proxy or the <a href="https://haveibeenpwned.com/" target="_blank" class="text-cyan">HIBP website</a> directly. Error: ${Utils.escapeHtml(e.message)}</div>`;
    }
  }
};
