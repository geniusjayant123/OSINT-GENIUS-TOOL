/* OSINT GENIUS — CVE Intelligence Module */
window.CVEModule = {
  id: 'cve', name: 'CVE Intelligence',

  FALLBACK_CVES: [
    { id:'CVE-2024-3094', score:10.0, severity:'CRITICAL', desc:'Supply chain backdoor in XZ Utils (liblzma). Malicious code was inserted to allow unauthorized SSH access. Affected Fedora 41, Debian testing and certain rolling distros.', year:2024 },
    { id:'CVE-2024-1086', score:9.8, severity:'CRITICAL', desc:'Use-after-free vulnerability in the Linux kernel netfilter nf_tables component. Allows local privilege escalation to root.', year:2024 },
    { id:'CVE-2024-21762', score:9.6, severity:'CRITICAL', desc:'Fortinet FortiOS out-of-bounds write vulnerability in SSL-VPN. Unauthenticated RCE via crafted HTTP requests. Actively exploited.', year:2024 },
    { id:'CVE-2023-44487', score:7.5, severity:'HIGH', desc:'HTTP/2 Rapid Reset Attack. Novel DDoS technique abusing HTTP/2 stream cancellation. Affected NGINX, Apache, cloud load balancers.', year:2023 },
    { id:'CVE-2023-4863', score:8.8, severity:'HIGH', desc:'Heap buffer overflow in WebP codec (libwebp). Exploited in the wild. Affected Chrome, Firefox, Safari, Electron-based apps.', year:2023 },
    { id:'CVE-2023-36884', score:8.3, severity:'HIGH', desc:'Microsoft Office and Windows HTML RCE. Exploited by Russian APT RomCom. Used in phishing with malicious Office documents.', year:2023 },
    { id:'CVE-2022-44698', score:5.4, severity:'MEDIUM', desc:'Windows SmartScreen Security Feature Bypass. Attackers could craft malicious URLs that bypass Mark-of-the-Web protections.', year:2022 },
    { id:'CVE-2021-44228', score:10.0, severity:'CRITICAL', desc:'Log4Shell — Apache Log4j2 JNDI injection RCE. The most impactful vulnerability of 2021. Affected millions of Java applications worldwide.', year:2021 },
  ],

  render() {
    return `<div class="module-area animate-fadeInUp">
      <div class="module-header">
        <div class="module-icon-title">
          <div class="module-icon-wrap icon-red"><i class="fas fa-shield-alt"></i></div>
          <div><div class="module-title">CVE Intelligence</div><div class="module-subtitle">Live NVD feed · Search by ID or keyword · CVSS scoring</div></div>
        </div>
      </div>
      <div class="card mb-16">
        <div class="input-group">
          <div class="input-wrap flex-1">
            <i class="fas fa-search input-icon"></i>
            <input class="form-input has-icon" id="cve-search-input" placeholder="CVE-2024-1234 or search keyword (e.g. apache, ssh, windows)" />
          </div>
          <button class="btn btn-primary" id="cve-search-btn"><i class="fas fa-search"></i> Search</button>
          <button class="btn btn-secondary" id="cve-reload-btn"><i class="fas fa-sync"></i> Latest</button>
        </div>
        <div class="flex gap-8 mt-10">
          <select class="form-select" id="cve-sev-filter">
            <option value="">All Severities</option>
            <option value="CRITICAL">Critical (9.0+)</option>
            <option value="HIGH">High (7.0-8.9)</option>
            <option value="MEDIUM">Medium (4.0-6.9)</option>
            <option value="LOW">Low (0.1-3.9)</option>
          </select>
          <select class="form-select" id="cve-sort">
            <option value="date-desc">Latest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="score-desc">Highest Score</option>
            <option value="score-asc">Lowest Score</option>
          </select>
          <div class="live-indicator ms-auto"><span class="live-dot"></span>LIVE NVD FEED</div>
        </div>
      </div>
      <div id="cve-stats" class="grid-4 mb-16"></div>
      <div id="cve-results">
        <div class="loader"><div class="spinner spinner-lg"></div><span>Fetching latest critical CVEs from NVD...</span></div>
      </div>
    </div>`;
  },

  init() {
    document.getElementById('cve-search-btn').addEventListener('click', () => this.search());
    document.getElementById('cve-reload-btn').addEventListener('click', () => this.loadLatest());
    document.getElementById('cve-search-input').addEventListener('keydown', e => { if(e.key==='Enter') this.search(); });
    document.getElementById('cve-sev-filter').addEventListener('change', () => this.applyFilters());
    document.getElementById('cve-sort').addEventListener('change', () => this.applyFilters());
    this.loadLatest();
  },

  _allCVEs: [],

  async loadLatest() {
    document.getElementById('cve-results').innerHTML = `<div class="loader"><div class="spinner spinner-lg"></div><span>Fetching latest critical CVEs from NVD...</span></div>`;
    try {
      const data = await API.nvdCVE('', 'CRITICAL');
      const cves = (data.vulnerabilities || []).map(v => this.parseCVE(v));
      this._allCVEs = cves;
      this.updateStats(cves);
      this.renderCVEs(cves);
    } catch {
      this._allCVEs = this.FALLBACK_CVES;
      this.updateStats(this.FALLBACK_CVES);
      this.renderCVEs(this.FALLBACK_CVES);
      App.showToast('NVD API unavailable — showing cached CVEs', 'warning');
    }
  },

  async search() {
    const q = document.getElementById('cve-search-input').value.trim();
    if (!q) { this.loadLatest(); return; }
    document.getElementById('cve-results').innerHTML = `<div class="loader"><div class="spinner spinner-lg"></div><span>Searching for "${q}"...</span></div>`;
    App.addToHistory('cve', q);
    try {
      const data = await API.nvdCVE(q);
      const cves = (data.vulnerabilities || []).map(v => this.parseCVE(v));
      if (!cves.length) throw new Error('No results');
      this._allCVEs = cves;
      this.updateStats(cves);
      this.renderCVEs(cves);
    } catch {
      const fallback = this.FALLBACK_CVES.filter(c => c.id.includes(q.toUpperCase()) || c.desc.toLowerCase().includes(q.toLowerCase()));
      if (fallback.length) { this._allCVEs = fallback; this.updateStats(fallback); this.renderCVEs(fallback); }
      else { document.getElementById('cve-results').innerHTML = `<div class="empty-state"><i class="fas fa-search"></i><p>No CVEs found for "${Utils.escapeHtml(q)}"</p></div>`; }
    }
  },

  parseCVE(v) {
    const cve = v.cve || v;
    const id = cve.id || v.id || 'CVE-UNKNOWN';
    const desc = cve.descriptions?.find(d=>d.lang==='en')?.value || v.desc || 'No description available';
    const metrics = cve.metrics?.cvssMetricV31?.[0] || cve.metrics?.cvssMetricV30?.[0] || cve.metrics?.cvssMetricV2?.[0];
    const score = metrics?.cvssData?.baseScore || v.score || 0;
    const severity = metrics?.cvssData?.baseSeverity || (score>=9?'CRITICAL':score>=7?'HIGH':score>=4?'MEDIUM':'LOW');
    const published = cve.published || new Date().toISOString();
    const refs = (cve.references||[]).slice(0,2).map(r=>r.url||r);
    const year = new Date(published).getFullYear();
    return { id, desc, score, severity, published, refs, year };
  },

  updateStats(cves) {
    const cnt = { CRITICAL:0, HIGH:0, MEDIUM:0, LOW:0 };
    cves.forEach(c => { cnt[c.severity] = (cnt[c.severity]||0)+1; });
    document.getElementById('cve-stats').innerHTML = `
      <div class="stat-card"><div class="stat-label">Total Results</div><div class="stat-value text-cyan">${cves.length}</div></div>
      <div class="stat-card"><div class="stat-label">Critical</div><div class="stat-value text-red">${cnt.CRITICAL||0}</div></div>
      <div class="stat-card"><div class="stat-label">High</div><div class="stat-value text-amber">${cnt.HIGH||0}</div></div>
      <div class="stat-card"><div class="stat-label">Medium</div><div class="stat-value text-green">${cnt.MEDIUM||0}</div></div>`;
  },

  applyFilters() {
    let cves = [...this._allCVEs];
    const sev = document.getElementById('cve-sev-filter').value;
    const sort = document.getElementById('cve-sort').value;
    if (sev) cves = cves.filter(c => c.severity === sev);
    switch(sort) {
      case 'date-asc': cves.sort((a,b)=>new Date(a.published)-new Date(b.published)); break;
      case 'score-desc': cves.sort((a,b)=>b.score-a.score); break;
      case 'score-asc': cves.sort((a,b)=>a.score-b.score); break;
      default: cves.sort((a,b)=>new Date(b.published)-new Date(a.published));
    }
    this.renderCVEs(cves);
  },

  renderCVEs(cves) {
    if (!cves.length) { document.getElementById('cve-results').innerHTML = `<div class="empty-state"><i class="fas fa-shield-alt"></i><p>No CVEs to display</p></div>`; return; }
    document.getElementById('cve-results').innerHTML = `<div class="flex-col gap-10 stagger">${cves.map(c => {
      const sevColors = { CRITICAL:'red', HIGH:'amber', MEDIUM:'green', LOW:'cyan' };
      const sc = sevColors[c.severity] || 'muted';
      const scoreW = Math.min(100, (c.score/10)*100);
      const shortDesc = c.desc.length > 300 ? c.desc.substring(0,300) + '...' : c.desc;
      return `<div class="cve-card animate-fadeInUp">
        <div class="cve-card-header">
          <div class="flex items-center gap-10">
            <span class="cve-id">${c.id}</span>
            <span class="badge sev-${c.severity.toLowerCase()}">${c.severity}</span>
          </div>
          <span class="text-muted" style="font-size:.75rem;">${c.published ? new Date(c.published).toLocaleDateString() : ''}</span>
        </div>
        <div class="cve-score-bar mb-10">
          <div class="flex justify-between" style="font-size:.72rem;color:var(--text-muted);margin-bottom:3px;"><span>CVSS Score</span><span class="text-${sc}" style="font-weight:700;">${c.score.toFixed(1)}</span></div>
          <div class="risk-bar-track"><div class="risk-bar-fill" style="width:${scoreW}%;background:var(--${sc});"></div></div>
        </div>
        <p class="cve-desc">${Utils.escapeHtml(shortDesc)}</p>
        <div class="flex gap-6 mt-10 flex-wrap">
          <a class="btn btn-secondary btn-sm" href="https://nvd.nist.gov/vuln/detail/${c.id}" target="_blank"><i class="fas fa-external-link-alt"></i> NVD</a>
          <a class="btn btn-secondary btn-sm" href="https://cve.mitre.org/cgi-bin/cvename.cgi?name=${c.id}" target="_blank"><i class="fas fa-database"></i> MITRE</a>
          ${c.refs.map(r=>`<a class="btn btn-secondary btn-sm" href="${r}" target="_blank"><i class="fas fa-link"></i> Ref</a>`).join('')}
        </div>
      </div>`;
    }).join('')}</div>`;
  }
};
