/* OSINT GENIUS — Domain Intelligence Module */
window.DomainModule = {
  id: 'domain', name: 'Domain Intelligence',

  render() {
    return `<div class="module-area animate-fadeInUp">
      <div class="module-header">
        <div class="module-icon-title">
          <div class="module-icon-wrap icon-cyan"><i class="fas fa-globe"></i></div>
          <div><div class="module-title">Domain Intelligence</div><div class="module-subtitle">DNS, subdomains, SSL certs, Wayback Machine & tech detection</div></div>
        </div>
      </div>
      <div class="card mb-16">
        <div class="input-group">
          <div class="input-wrap flex-1">
            <i class="fas fa-globe input-icon"></i>
            <input class="form-input has-icon" id="domain-input" placeholder="Enter domain (e.g. example.com)" />
          </div>
          <button class="btn btn-primary" id="domain-analyze-btn"><i class="fas fa-search"></i> Analyze</button>
        </div>
      </div>
      <div id="domain-results" class="hidden"></div>
    </div>`;
  },

  init() {
    document.getElementById('domain-analyze-btn').addEventListener('click', () => {
      const d = document.getElementById('domain-input').value.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      if (!d) { App.showToast('Enter a domain name', 'warning'); return; }
      this.analyze(d);
    });
    document.getElementById('domain-input').addEventListener('keydown', e => { if(e.key==='Enter') document.getElementById('domain-analyze-btn').click(); });
  },

  async analyze(domain) {
    const res = document.getElementById('domain-results');
    res.classList.remove('hidden');
    res.innerHTML = `<div class="loader"><div class="spinner spinner-lg"></div><span>Analyzing ${domain}...</span></div>`;

    const [dnsA, dnsMX, dnsTXT, dnsNS, dnsCNAME, crtData, wayback] = await Promise.allSettled([
      API.dnsQuery(domain, 'A'),
      API.dnsQuery(domain, 'MX'),
      API.dnsQuery(domain, 'TXT'),
      API.dnsQuery(domain, 'NS'),
      API.dnsQuery(domain, 'CNAME'),
      API.crtSh(domain),
      API.wayback(domain)
    ]);

    App.addToHistory('domain', domain);
    this.renderResults(domain, { dnsA, dnsMX, dnsTXT, dnsNS, dnsCNAME, crtData, wayback });
  },

  renderDNS(data, type) {
    if (data.status !== 'fulfilled' || !data.value?.Answer) return `<div class="text-muted" style="font-size:.8rem;">No ${type} records found</div>`;
    return data.value.Answer.map(r => `
      <div class="dns-record-row">
        <span class="dns-type dns-${type}">${type}</span>
        <span class="text-muted" style="font-size:.75rem;">${r.TTL}s</span>
        <span class="mono text-primary" style="word-break:break-all;">${Utils.escapeHtml(r.data)}</span>
      </div>`).join('');
  },

  renderSubdomains(crtData) {
    if (crtData.status !== 'fulfilled') return `<div class="alert alert-warning"><i class="fas fa-exclamation-triangle"></i> Failed to fetch certificate data</div>`;
    const certs = crtData.value || [];
    const subs = new Set();
    certs.forEach(c => {
      (c.name_value || '').split('\n').forEach(n => {
        n = n.trim().replace(/^\*\./, '');
        if (n && n.includes('.')) subs.add(n.toLowerCase());
      });
    });
    const sorted = [...subs].sort();
    return sorted.length ? sorted.map(s => `
      <div class="subdomain-item">
        <span class="mono text-cyan">${Utils.escapeHtml(s)}</span>
        <div class="flex gap-4">
          <button class="copy-btn" onclick="copyToClipboard('${s}')">copy</button>
          <a class="btn btn-secondary btn-sm" href="http://${s}" target="_blank"><i class="fas fa-external-link-alt"></i></a>
        </div>
      </div>`).join('') : `<div class="text-muted" style="font-size:.8rem;">No subdomains found via certificate transparency</div>`;
  },

  renderCerts(crtData) {
    if (crtData.status !== 'fulfilled') return `<div class="alert alert-warning">Certificate data unavailable</div>`;
    const certs = (crtData.value || []).slice(0, 20);
    return certs.map(c => `
      <div class="card mb-8" style="padding:12px;">
        <div class="flex justify-between items-center mb-8">
          <span class="mono text-cyan" style="font-size:.82rem;">${Utils.escapeHtml(c.common_name || '')}</span>
          <span class="badge badge-green">Valid</span>
        </div>
        <div class="data-row"><span class="data-label">Issuer</span><span class="data-value" style="font-size:.75rem;">${Utils.escapeHtml(c.issuer_name || 'N/A')}</span></div>
        <div class="data-row"><span class="data-label">Not Before</span><span class="data-value">${c.not_before ? new Date(c.not_before).toLocaleDateString() : 'N/A'}</span></div>
        <div class="data-row"><span class="data-label">Not After</span><span class="data-value">${c.not_after ? new Date(c.not_after).toLocaleDateString() : 'N/A'}</span></div>
      </div>`).join('') || `<div class="text-muted">No certificates found</div>`;
  },

  renderWayback(wayback) {
    if (wayback.status !== 'fulfilled') return `<div class="alert alert-warning">Wayback Machine unavailable</div>`;
    const rows = (wayback.value || []).slice(1); // skip header
    return rows.length ? rows.map(r => {
      const [ts, url, code] = r;
      const date = ts ? `${ts.slice(0,4)}-${ts.slice(4,6)}-${ts.slice(6,8)} ${ts.slice(8,10)}:${ts.slice(10,12)}` : '';
      const codeColor = code === '200' ? 'green' : code?.startsWith('3') ? 'amber' : 'red';
      return `<div class="wayback-item">
        <span class="wayback-date">${date}</span>
        <span class="badge badge-${codeColor}" style="min-width:42px;text-align:center;">${code}</span>
        <a href="https://web.archive.org/web/${ts}/${url}" target="_blank" class="text-cyan" style="font-size:.78rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;">${Utils.escapeHtml(url)}</a>
      </div>`;
    }).join('') : `<div class="text-muted">No Wayback Machine snapshots found</div>`;
  },

  detectTech(txts, nss) {
    const techs = [];
    const txtData = txts.status === 'fulfilled' ? (txts.value?.Answer || []).map(a => a.data).join(' ') : '';
    const nsData = nss.status === 'fulfilled' ? (nss.value?.Answer || []).map(a => a.data).join(' ') : '';
    if (txtData.includes('v=spf1')) techs.push({ name:'SPF Configured', icon:'fa-envelope-open-text', color:'green' });
    if (txtData.includes('v=DKIM')) techs.push({ name:'DKIM Enabled', icon:'fa-key', color:'green' });
    if (txtData.includes('_dmarc') || txtData.includes('v=DMARC')) techs.push({ name:'DMARC Protected', icon:'fa-shield-alt', color:'green' });
    if (txtData.includes('google-site-verification')) techs.push({ name:'Google Services', icon:'fa-google', color:'cyan' });
    if (txtData.includes('facebook-domain-verification')) techs.push({ name:'Facebook Connected', icon:'fa-facebook', color:'cyan' });
    if (nsData.includes('cloudflare')) techs.push({ name:'Cloudflare CDN', icon:'fa-cloud', color:'amber' });
    if (nsData.includes('awsdns')) techs.push({ name:'Amazon AWS', icon:'fa-aws', color:'amber' });
    if (nsData.includes('googledomains') || nsData.includes('google.com')) techs.push({ name:'Google Domains', icon:'fa-google', color:'cyan' });
    if (!techs.length) techs.push({ name:'No specific tech detected', icon:'fa-question-circle', color:'muted' });
    return techs.map(t => `<div class="card" style="padding:12px;display:flex;align-items:center;gap:10px;">
      <div class="module-icon-wrap icon-${t.color}" style="width:32px;height:32px;font-size:.8rem;flex-shrink:0;"><i class="fas ${t.icon}"></i></div>
      <span style="font-size:.85rem;font-weight:500;">${t.name}</span>
    </div>`).join('');
  },

  renderResults(domain, data) {
    const allDNS = [
      this.renderDNS(data.dnsA, 'A'),
      this.renderDNS(data.dnsMX, 'MX'),
      this.renderDNS(data.dnsTXT, 'TXT'),
      this.renderDNS(data.dnsNS, 'NS'),
      this.renderDNS(data.dnsCNAME, 'CNAME')
    ].join('');

    document.getElementById('domain-results').innerHTML = `
      <div class="tab-bar mb-16">
        <button class="tab-btn active" data-tab="d-dns"><i class="fas fa-server"></i> DNS</button>
        <button class="tab-btn" data-tab="d-subs"><i class="fas fa-sitemap"></i> Subdomains</button>
        <button class="tab-btn" data-tab="d-ssl"><i class="fas fa-lock"></i> SSL Certs</button>
        <button class="tab-btn" data-tab="d-wayback"><i class="fas fa-history"></i> Wayback</button>
        <button class="tab-btn" data-tab="d-tech"><i class="fas fa-microchip"></i> Tech Stack</button>
      </div>
      <div>
        <div class="tab-panel active animate-fadeInUp" data-panel="d-dns">
          <div class="card"><div class="card-header"><div class="card-title"><i class="fas fa-server"></i> DNS Records — ${Utils.escapeHtml(domain)}</div></div>
            ${allDNS || '<div class="text-muted">No DNS records found</div>'}
          </div>
        </div>
        <div class="tab-panel" data-panel="d-subs">
          <div class="card"><div class="card-header"><div class="card-title"><i class="fas fa-sitemap"></i> Subdomains via Certificate Transparency</div></div>
            ${this.renderSubdomains(data.crtData)}
          </div>
        </div>
        <div class="tab-panel" data-panel="d-ssl">
          <div class="card"><div class="card-header"><div class="card-title"><i class="fas fa-lock"></i> SSL/TLS Certificates</div></div>
            ${this.renderCerts(data.crtData)}
          </div>
        </div>
        <div class="tab-panel" data-panel="d-wayback">
          <div class="card"><div class="card-header"><div class="card-title"><i class="fas fa-history"></i> Wayback Machine Snapshots</div></div>
            ${this.renderWayback(data.wayback)}
          </div>
        </div>
        <div class="tab-panel" data-panel="d-tech">
          <div class="card"><div class="card-header"><div class="card-title"><i class="fas fa-microchip"></i> Technology Indicators</div></div>
            <div class="grid-2">${this.detectTech(data.dnsTXT, data.dnsNS)}</div>
          </div>
        </div>
      </div>`;
    App.bindTabs(document.getElementById('domain-results'));
  }
};
