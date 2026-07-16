/* OSINT GENIUS — Threat Intelligence Module */
window.ThreatModule = {
  id: 'threat', name: 'Threat Intelligence',

  THREAT_FEED: [
    { type:'IP', value:'185.234.218.55', threat:'Scanner', confidence:92, country:'RU', last_seen:'2h ago' },
    { type:'IP', value:'45.141.84.120', threat:'Malware C2', confidence:88, country:'NL', last_seen:'4h ago' },
    { type:'Domain', value:'secure-login.net-update.xyz', threat:'Phishing', confidence:97, country:'US', last_seen:'1h ago' },
    { type:'IP', value:'194.165.16.101', threat:'Botnet', confidence:81, country:'DE', last_seen:'6h ago' },
    { type:'Hash', value:'5f4dcc3b5aa765d61d8327deb882cf99', threat:'Trojan', confidence:99, country:'--', last_seen:'8h ago' },
    { type:'Domain', value:'paypal-secure-verify.com', threat:'Phishing', confidence:95, country:'CN', last_seen:'3h ago' },
    { type:'IP', value:'91.219.29.18', threat:'Ransomware', confidence:85, country:'UA', last_seen:'12h ago' },
    { type:'Email', value:'noreply@microsoft-secure.tk', threat:'Spam', confidence:76, country:'--', last_seen:'2d ago' },
    { type:'IP', value:'23.26.58.107', threat:'Scanner', confidence:72, country:'US', last_seen:'1d ago' },
    { type:'Hash', value:'e10adc3949ba59abbe56e057f20f883e', threat:'PUP', confidence:68, country:'--', last_seen:'3d ago' },
    { type:'Domain', value:'update-windows-patch.info', threat:'Malware', confidence:91, country:'RU', last_seen:'5h ago' },
    { type:'IP', value:'66.240.236.119', threat:'Scanner', confidence:88, country:'US', last_seen:'30m ago' },
    { type:'Domain', value:'amazon-prime-verify.site', threat:'Phishing', confidence:93, country:'BR', last_seen:'7h ago' },
    { type:'IP', value:'176.10.104.240', threat:'VPN/Tor', confidence:78, country:'CH', last_seen:'2h ago' },
    { type:'Hash', value:'098f6bcd4621d373cade4e832627b4f6', threat:'Trojan.Dropper', confidence:96, country:'--', last_seen:'1h ago' },
    { type:'IP', value:'80.82.77.33', threat:'Brute Force', confidence:84, country:'NL', last_seen:'45m ago' },
    { type:'Domain', value:'crypto-wallet-connect.net', threat:'Crypto Scam', confidence:89, country:'KY', last_seen:'9h ago' },
    { type:'Email', value:'support@apple-id-verify.ru', threat:'Phishing', confidence:94, country:'RU', last_seen:'4h ago' },
    { type:'IP', value:'62.210.180.229', threat:'Spam Source', confidence:73, country:'FR', last_seen:'6h ago' },
    { type:'Domain', value:'free-bitcoin-generator.io', threat:'Crypto Scam', confidence:87, country:'MH', last_seen:'1d ago' },
  ],

  APT_GROUPS: [
    { name:'APT28 (Fancy Bear)', alias:'Sofacy, IRON TWILIGHT', country:'🇷🇺 Russia', targets:'NATO, Government, Defense', ttps:'Spearphishing, credential harvesting, custom malware (X-Agent, Sofacy)', mitre:'G0007', status:'Active' },
    { name:'APT29 (Cozy Bear)', alias:'The Dukes, YTTRIUM', country:'🇷🇺 Russia', targets:'Government, Think Tanks, NGOs, COVID-19 research', ttps:'Supply chain attacks, SUNBURST, phishing', mitre:'G0016', status:'Active' },
    { name:'Lazarus Group', alias:'HIDDEN COBRA, APT38', country:'🇰🇵 North Korea', targets:'Finance, Crypto, Defense, Healthcare', ttps:'Spearphishing, WannaCry, custom RATs, crypto theft', mitre:'G0032', status:'Active' },
    { name:'Sandworm Team', alias:'IRIDIUM, Voodoo Bear', country:'🇷🇺 Russia', targets:'Ukraine, Energy, Industrial', ttps:'NotPetya, Industroyer, destructive wipers', mitre:'G0034', status:'Active' },
    { name:'APT41', alias:'Double Dragon, Wicked Panda', country:'🇨🇳 China', targets:'Healthcare, Telecom, Tech, Gaming', ttps:'Both espionage and financially motivated', mitre:'G0096', status:'Active' },
    { name:'Kimsuky', alias:'Black Banshee, Velvet Chollima', country:'🇰🇵 North Korea', targets:'Government, Research, Media, Crypto', ttps:'Watering hole, phishing, BabyShark malware', mitre:'G0094', status:'Active' },
    { name:'REvil (Sodinokibi)', alias:'Gold Southfield', country:'🇷🇺 Russia', targets:'MSPs, Healthcare, Legal (RaaS)', ttps:'Ransomware-as-a-Service, Kaseya attack', mitre:'G0115', status:'Inactive' },
    { name:'DarkSide', alias:'Carbon Spider', country:'🇷🇺 Russia', targets:'Critical infrastructure, Energy', ttps:'Colonial Pipeline attack, RaaS model', mitre:'', status:'Inactive' },
    { name:'LockBit', alias:'ABCD Group', country:'🇷🇺 Russia', targets:'Government, Finance, Healthcare', ttps:'Fastest encrypting ransomware, LockBit 3.0', mitre:'G1033', status:'Active' },
    { name:'Equation Group', alias:'EQGRP, Tilded Team', country:'🇺🇸 US-linked', targets:'Iran, Russia, Pakistan, global', ttps:'DoubleFantasy, UNITEDDRAKE, NSA tooling leaks', mitre:'G0020', status:'Unknown' },
  ],

  MALWARE: [
    { name:'Emotet', type:'Trojan', level:'CRITICAL', status:'Active', desc:'Modular malware that spreads via email, can download other payloads like TrickBot.', year:2014, targets:'Orgs via phishing', spreading:'Email attachment macros' },
    { name:'TrickBot', type:'Banking Trojan', level:'CRITICAL', status:'Partially Dismantled', desc:'Modular banking trojan that pivots to deliver ransomware. Worked with Ryuk.', year:2016, targets:'Banks, enterprises', spreading:'Emotet downloads' },
    { name:'Ryuk', type:'Ransomware', level:'CRITICAL', status:'Active (variants)', desc:'Big-game hunting ransomware targeting hospitals and enterprises for high ransoms.', year:2018, targets:'Healthcare, Government', spreading:'TrickBot, manual deployment' },
    { name:'WannaCry', type:'Ransomware Worm', level:'HIGH', status:'Contained', desc:'Used NSA\'s EternalBlue exploit. Infected 200,000+ systems in 150 countries.', year:2017, targets:'Global / NHS UK', spreading:'SMB EternalBlue (CVE-2017-0144)' },
    { name:'NotPetya', type:'Wiper', level:'CRITICAL', status:'Contained', desc:'Disguised as ransomware but designed to destroy. Caused $10B+ in damages.', year:2017, targets:'Ukraine, global collateral', spreading:'MeDoc update, EternalBlue' },
    { name:'Mirai', type:'Botnet', level:'HIGH', status:'Active variants', desc:'IoT botnet famous for record DDoS attacks. Source code leaked, many variants exist.', year:2016, targets:'IoT devices (routers, cameras)', spreading:'Default credentials brute force' },
    { name:'QakBot (QBot)', type:'Trojan', level:'CRITICAL', status:'Active', desc:'Banking trojan evolved into ransomware delivery vehicle. Dismantled by FBI in 2023 but reemerged.', year:2007, targets:'Enterprises, banks', spreading:'Phishing emails, thread hijacking' },
    { name:'Cobalt Strike', type:'Red Team Framework', level:'HIGH', status:'Abused by threat actors', desc:'Legitimate pen-testing tool frequently cracked and used by APTs for C2 operations.', year:2012, targets:'Enterprise networks', spreading:'Post-exploitation persistence' },
    { name:'RedLine Stealer', type:'Infostealer', level:'HIGH', status:'Active', desc:'Steals passwords, crypto wallets, credit cards. Sold as MaaS for $150/month.', year:2020, targets:'Individual users', spreading:'Fake software, YouTube links' },
    { name:'BlackMatter', type:'Ransomware', level:'CRITICAL', status:'Shutdown 2021', desc:'RaaS targeting critical infrastructure. Claimed to be successor to DarkSide.', year:2021, targets:'Critical infra, agriculture', spreading:'Valid accounts, spearphishing' },
  ],

  render() {
    return `<div class="module-area animate-fadeInUp">
      <div class="module-header">
        <div class="module-icon-title">
          <div class="module-icon-wrap icon-red"><i class="fas fa-radiation"></i></div>
          <div><div class="module-title">Threat Intelligence</div><div class="module-subtitle">IOC lookup, live feed, APT groups & malware intel</div></div>
        </div>
      </div>
      <div class="tab-bar">
        <button class="tab-btn active" data-tab="ti-ioc"><i class="fas fa-crosshairs"></i> IOC Lookup</button>
        <button class="tab-btn" data-tab="ti-feed"><i class="fas fa-rss"></i> Live Feed</button>
        <button class="tab-btn" data-tab="ti-apt"><i class="fas fa-user-ninja"></i> APT Groups</button>
        <button class="tab-btn" data-tab="ti-malware"><i class="fas fa-virus"></i> Malware Intel</button>
      </div>
      <div>
        <!-- IOC Lookup -->
        <div class="tab-panel active" data-panel="ti-ioc">
          <div class="card mb-12">
            <div class="grid-2" style="gap:12px;">
              <div>
                <label class="form-label">IOC Value</label>
                <input class="form-input" id="ioc-input" placeholder="IP, domain, hash, or email..." />
              </div>
              <div>
                <label class="form-label">Type</label>
                <select class="form-select w-full" id="ioc-type">
                  <option value="auto">Auto-detect</option>
                  <option value="ip">IP Address</option>
                  <option value="domain">Domain</option>
                  <option value="hash">File Hash</option>
                  <option value="email">Email</option>
                  <option value="url">URL</option>
                </select>
              </div>
            </div>
            <button class="btn btn-primary mt-12" id="ioc-lookup-btn"><i class="fas fa-crosshairs"></i> Lookup IOC</button>
          </div>
          <div id="ioc-results"></div>
        </div>

        <!-- Live Feed -->
        <div class="tab-panel" data-panel="ti-feed">
          <div class="flex items-center gap-12 mb-12">
            <div class="live-indicator"><span class="live-dot"></span>LIVE THREAT FEED</div>
            <select class="form-select" id="feed-type-filter" style="max-width:200px;">
              <option value="">All Types</option>
              <option value="IP">IP Indicators</option>
              <option value="Domain">Domains</option>
              <option value="Hash">File Hashes</option>
              <option value="Email">Email IOCs</option>
            </select>
          </div>
          <div id="threat-feed-list">${this.renderFeed('')}</div>
        </div>

        <!-- APT Groups -->
        <div class="tab-panel" data-panel="ti-apt">
          <div class="flex-col gap-10">${this.APT_GROUPS.map(g => `
            <div class="threat-actor-card">
              <div class="flex justify-between items-start mb-8">
                <div>
                  <div style="font-weight:700;font-size:.95rem;">${g.name}</div>
                  <div class="text-secondary" style="font-size:.78rem;">${g.alias}</div>
                </div>
                <div class="flex gap-4">
                  <span class="badge badge-${g.status==='Active'?'red':g.status==='Inactive'?'muted':'amber'}">${g.status}</span>
                  <span>${g.country}</span>
                </div>
              </div>
              <div class="data-row"><span class="data-label">Targets</span><span class="data-value">${g.targets}</span></div>
              <div class="data-row"><span class="data-label">TTPs</span><span class="data-value text-secondary">${g.ttps}</span></div>
              ${g.mitre ? `<div class="mt-8"><a class="btn btn-secondary btn-sm" href="https://attack.mitre.org/groups/${g.mitre}/" target="_blank"><i class="fas fa-external-link-alt"></i> MITRE ATT&CK</a></div>` : ''}
            </div>`).join('')}
          </div>
        </div>

        <!-- Malware Intel -->
        <div class="tab-panel" data-panel="ti-malware">
          <div class="grid-2">${this.MALWARE.map(m => `
            <div class="card">
              <div class="card-header">
                <div class="card-title"><i class="fas fa-virus text-red"></i> ${m.name}</div>
                <div class="flex gap-4">
                  <span class="badge sev-${m.level.toLowerCase()}">${m.level}</span>
                  <span class="badge badge-${m.status==='Active'?'red':m.status.includes('Active')?'amber':'muted'}">${m.status.includes('Active')?'Active':m.status}</span>
                </div>
              </div>
              <div class="data-row"><span class="data-label">Type</span><span class="data-value">${m.type}</span></div>
              <div class="data-row"><span class="data-label">First Seen</span><span class="data-value">${m.year}</span></div>
              <div class="data-row"><span class="data-label">Spreading</span><span class="data-value text-secondary">${m.spreading}</span></div>
              <p style="font-size:.78rem;color:var(--text-secondary);margin-top:8px;">${m.desc}</p>
            </div>`).join('')}
          </div>
        </div>
      </div>
    </div>`;
  },

  renderFeed(filter) {
    const items = filter ? this.THREAT_FEED.filter(f=>f.type===filter) : this.THREAT_FEED;
    const typeColors = { IP:'cyan', Domain:'red', Hash:'amber', Email:'purple', URL:'green' };
    return `<div class="flex-col gap-6">${items.map(f=>`
      <div class="paste-item">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-8">
            <span class="badge badge-${typeColors[f.type]||'muted'}">${f.type}</span>
            <span class="mono" style="font-size:.82rem;">${Utils.escapeHtml(f.value)}</span>
          </div>
          <div class="flex items-center gap-8">
            <span class="text-muted" style="font-size:.72rem;">${f.last_seen}</span>
            ${f.country !== '--' ? `<span>${Utils.countryFlag(f.country)}</span>` : ''}
          </div>
        </div>
        <div class="flex gap-6 mt-6">
          <span class="badge badge-red">${f.threat}</span>
          <div class="flex items-center gap-4" style="font-size:.72rem;color:var(--text-muted);">
            Confidence: <span style="color:${f.confidence>=90?'var(--red)':f.confidence>=70?'var(--amber)':'var(--green)'};">${f.confidence}%</span>
          </div>
        </div>
      </div>`).join('')}
    </div>`;
  },

  init() {
    document.getElementById('ioc-lookup-btn').addEventListener('click', () => this.lookupIOC());
    document.getElementById('ioc-input').addEventListener('keydown', e => { if(e.key==='Enter') this.lookupIOC(); });
    document.getElementById('feed-type-filter').addEventListener('change', e => {
      document.getElementById('threat-feed-list').innerHTML = this.renderFeed(e.target.value);
    });
  },

  async lookupIOC() {
    const val = document.getElementById('ioc-input').value.trim();
    if (!val) { App.showToast('Enter an IOC value', 'warning'); return; }
    let type = document.getElementById('ioc-type').value;
    if (type === 'auto') {
      if (Utils.isValidIP(val)) type = 'ip';
      else if (/^[0-9a-fA-F]{32,64}$/.test(val)) type = 'hash';
      else if (Utils.isValidEmail(val)) type = 'email';
      else if (Utils.isValidDomain(val)) type = 'domain';
      else type = 'url';
    }
    const res = document.getElementById('ioc-results');
    res.innerHTML = `<div class="loader"><div class="spinner"></div><span>Looking up ${type.toUpperCase()} IOC...</span></div>`;
    App.addToHistory('threat', `IOC: ${val}`);
    try {
      let content = '';
      if (type === 'ip') {
        const [geo, idb] = await Promise.allSettled([API.ipGeo(val), API.shodanInternetDB(val)]);
        const g = geo.status==='fulfilled' ? geo.value : null;
        const s = idb.status==='fulfilled' ? idb.value : null;
        const score = Math.min(100, (s?.ports?.length||0)*5 + (s?.cves?.length||0)*15 + (g?.proxy?20:0));
        content = `
          <div class="data-row"><span class="data-label">Country</span><span class="data-value">${g?Utils.countryFlag(g.countryCode)+'  '+g.country:'N/A'}</span></div>
          <div class="data-row"><span class="data-label">ISP</span><span class="data-value">${g?.isp||'N/A'}</span></div>
          <div class="data-row"><span class="data-label">ASN</span><span class="data-value text-purple">${g?.as||'N/A'}</span></div>
          <div class="data-row"><span class="data-label">Open Ports</span><span class="data-value text-amber">${s?.ports?.join(', ')||'None found'}</span></div>
          <div class="data-row"><span class="data-label">CVEs</span><span class="data-value text-red">${s?.cves?.join(', ')||'None'}</span></div>
          <div class="data-row"><span class="data-label">Threat Score</span><span class="data-value text-${score>=70?'red':score>=40?'amber':'green'}">${score}/100</span></div>`;
      } else if (type === 'hash') {
        const hashType = /^[0-9a-fA-F]{32}$/.test(val)?'MD5':/^[0-9a-fA-F]{40}$/.test(val)?'SHA-1':/^[0-9a-fA-F]{64}$/.test(val)?'SHA-256':'Unknown';
        content = `
          <div class="data-row"><span class="data-label">Hash Type</span><span class="data-value text-cyan">${hashType}</span></div>
          <div class="data-row"><span class="data-label">Length</span><span class="data-value">${val.length} chars</span></div>
          <div class="data-row"><span class="data-label">Check Online</span><span class="data-value"><a class="btn btn-secondary btn-sm" href="https://www.virustotal.com/gui/file/${val}" target="_blank"><i class="fas fa-shield-virus"></i> VirusTotal</a></span></div>`;
      } else if (type === 'domain') {
        const dns = await API.dnsQuery(val, 'A');
        const ips = dns?.Answer?.map(a=>a.data)||[];
        content = `
          <div class="data-row"><span class="data-label">Resolved IPs</span><span class="data-value text-cyan">${ips.join(', ')||'Could not resolve'}</span></div>
          <div class="data-row"><span class="data-label">Check</span><span class="data-value"><a class="btn btn-secondary btn-sm" href="https://www.virustotal.com/gui/domain/${val}" target="_blank"><i class="fas fa-shield-virus"></i> VirusTotal</a></span></div>`;
      } else {
        content = `<div class="data-row"><span class="data-label">Value</span><span class="data-value mono">${Utils.escapeHtml(val)}</span></div>
          <div class="data-row"><span class="data-label">Type</span><span class="data-value">${type.toUpperCase()}</span></div>`;
      }
      res.innerHTML = `<div class="card animate-fadeInUp">
        <div class="card-header"><div class="card-title"><i class="fas fa-crosshairs text-red"></i> IOC Report: ${Utils.escapeHtml(val.substring(0,50))}</div></div>
        <div class="flex gap-8 mb-12">
          <span class="badge badge-red">${type.toUpperCase()}</span>
          <span class="badge badge-amber">Analysis Complete</span>
        </div>
        ${content}
      </div>`;
    } catch(e) {
      res.innerHTML = `<div class="alert alert-danger">${Utils.escapeHtml(e.message)}</div>`;
    }
  }
};
