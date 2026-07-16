/* OSINT GENIUS — Network Tools Module */
window.NetworkModule = {
  id: 'network', name: 'Network Tools',

  COMMON_OUIS: {
    '005056': 'VMware, Inc.', '000C29': 'VMware, Inc.', '080027': 'Oracle VirtualBox',
    '001A11': 'Google Inc.', 'DCA632': 'Raspberry Pi Foundation', 'B827EB': 'Raspberry Pi Foundation',
    '001788': 'Philips Lighting BV', 'AC9E17': 'Apple, Inc.', '3C5AB4': 'Google Inc.',
    'FCFBFB': 'Cisco Systems', '001B63': 'Apple, Inc.', 'E4956E': 'Cisco Systems',
    'D850E6': 'Samsung Electronics', '2C3326': 'Hewlett Packard'
  },

  PORTS: [
    {port:20,proto:'TCP',name:'FTP Data',risk:'High',desc:'FTP data transfer — insecure, should not be exposed'},
    {port:21,proto:'TCP',name:'FTP Control',risk:'High',desc:'File Transfer Protocol — sends credentials in plaintext'},
    {port:22,proto:'TCP',name:'SSH',risk:'Medium',desc:'Secure Shell — encrypted, but can be brute-forced'},
    {port:23,proto:'TCP',name:'Telnet',risk:'Critical',desc:'Unencrypted remote terminal — should never be exposed'},
    {port:25,proto:'TCP',name:'SMTP',risk:'Medium',desc:'Email sending — can be used for spam relay if misconfigured'},
    {port:53,proto:'TCP/UDP',name:'DNS',risk:'Low',desc:'Domain Name System — can be abused for amplification DDoS'},
    {port:67,proto:'UDP',name:'DHCP Server',risk:'Medium',desc:'Dynamic Host Configuration — rogue DHCP is a LAN attack'},
    {port:68,proto:'UDP',name:'DHCP Client',risk:'Low',desc:'DHCP client — receives IP configuration'},
    {port:69,proto:'UDP',name:'TFTP',risk:'High',desc:'Trivial FTP — no authentication, often used for firmware'},
    {port:80,proto:'TCP',name:'HTTP',risk:'Medium',desc:'Unencrypted web traffic — susceptible to interception'},
    {port:110,proto:'TCP',name:'POP3',risk:'High',desc:'Plaintext email retrieval — outdated'},
    {port:123,proto:'UDP',name:'NTP',risk:'Low',desc:'Network Time Protocol — can be abused for DDoS amplification'},
    {port:135,proto:'TCP',name:'MS RPC',risk:'High',desc:'Microsoft RPC — frequent attack vector, should be firewalled'},
    {port:139,proto:'TCP',name:'NetBIOS',risk:'High',desc:'NetBIOS Session Service — file/printer sharing, legacy'},
    {port:143,proto:'TCP',name:'IMAP',risk:'Medium',desc:'Email retrieval — plaintext in basic mode'},
    {port:161,proto:'UDP',name:'SNMP',risk:'High',desc:'Network management — default community strings are a risk'},
    {port:389,proto:'TCP',name:'LDAP',risk:'High',desc:'Lightweight Directory Access Protocol — auth data'},
    {port:443,proto:'TCP',name:'HTTPS',risk:'Low',desc:'Encrypted web traffic — standard and expected'},
    {port:445,proto:'TCP',name:'SMB',risk:'Critical',desc:'Server Message Block — EternalBlue/WannaCry target'},
    {port:465,proto:'TCP',name:'SMTPS',risk:'Low',desc:'Encrypted SMTP submission'},
    {port:500,proto:'UDP',name:'IKE/IPsec',risk:'Medium',desc:'VPN key exchange — can leak IKE fingerprints'},
    {port:514,proto:'UDP',name:'Syslog',risk:'Medium',desc:'Log aggregation — should be secured'},
    {port:587,proto:'TCP',name:'SMTP TLS',risk:'Low',desc:'Encrypted email submission'},
    {port:636,proto:'TCP',name:'LDAPS',risk:'Low',desc:'Encrypted LDAP'},
    {port:993,proto:'TCP',name:'IMAPS',risk:'Low',desc:'Encrypted IMAP'},
    {port:995,proto:'TCP',name:'POP3S',risk:'Low',desc:'Encrypted POP3'},
    {port:1080,proto:'TCP',name:'SOCKS Proxy',risk:'High',desc:'Often used by malware for tunneling'},
    {port:1194,proto:'UDP',name:'OpenVPN',risk:'Low',desc:'VPN — encrypted tunnel'},
    {port:1433,proto:'TCP',name:'MSSQL',risk:'Critical',desc:'Microsoft SQL Server — should never be public-facing'},
    {port:1521,proto:'TCP',name:'Oracle DB',risk:'Critical',desc:'Oracle Database — should never be public-facing'},
    {port:1723,proto:'TCP',name:'PPTP VPN',risk:'Medium',desc:'VPN — older protocol with known weaknesses'},
    {port:2049,proto:'TCP',name:'NFS',risk:'High',desc:'Network File System — filesystem shares, should be firewalled'},
    {port:3306,proto:'TCP',name:'MySQL',risk:'Critical',desc:'MySQL Database — should never be public-facing'},
    {port:3389,proto:'TCP',name:'RDP',risk:'Critical',desc:'Remote Desktop — BlueKeep (CVE-2019-0708), brute force target'},
    {port:4444,proto:'TCP',name:'Metasploit',risk:'Critical',desc:'Default Metasploit handler — indicates active compromise'},
    {port:5432,proto:'TCP',name:'PostgreSQL',risk:'Critical',desc:'PostgreSQL Database — should never be public-facing'},
    {port:5900,proto:'TCP',name:'VNC',risk:'Critical',desc:'Virtual Network Computing — often has weak auth or no auth'},
    {port:5985,proto:'TCP',name:'WinRM HTTP',risk:'High',desc:'Windows Remote Management — lateral movement vector'},
    {port:6379,proto:'TCP',name:'Redis',risk:'Critical',desc:'Redis cache — no auth by default, mass exploitation targets'},
    {port:6667,proto:'TCP',name:'IRC',risk:'Medium',desc:'Internet Relay Chat — often used for botnet C2'},
    {port:8080,proto:'TCP',name:'HTTP Alt',risk:'Medium',desc:'Alternative HTTP — often dev/admin panels'},
    {port:8443,proto:'TCP',name:'HTTPS Alt',risk:'Medium',desc:'Alternative HTTPS — web admin interfaces'},
    {port:8888,proto:'TCP',name:'Jupyter',risk:'High',desc:'Jupyter Notebook — full code exec if exposed'},
    {port:9200,proto:'TCP',name:'Elasticsearch',risk:'Critical',desc:'Elasticsearch — billions of records leaked due to no auth'},
    {port:27017,proto:'TCP',name:'MongoDB',risk:'Critical',desc:'MongoDB — many instances exposed with no authentication'},
  ],

  render() {
    return `<div class="module-area animate-fadeInUp">
      <div class="module-header">
        <div class="module-icon-title">
          <div class="module-icon-wrap icon-green"><i class="fas fa-project-diagram"></i></div>
          <div><div class="module-title">Network Tools</div><div class="module-subtitle">MAC lookup, ASN/BGP, CIDR calc, port reference & VPN detect</div></div>
        </div>
      </div>
      <div class="tab-bar">
        <button class="tab-btn active" data-tab="n-mac"><i class="fas fa-ethernet"></i> MAC Lookup</button>
        <button class="tab-btn" data-tab="n-asn"><i class="fas fa-route"></i> ASN / BGP</button>
        <button class="tab-btn" data-tab="n-cidr"><i class="fas fa-calculator"></i> CIDR Calc</button>
        <button class="tab-btn" data-tab="n-ports"><i class="fas fa-door-open"></i> Port Reference</button>
        <button class="tab-btn" data-tab="n-vpn"><i class="fas fa-mask"></i> VPN/Proxy Detect</button>
      </div>
      <div>
        <!-- MAC Lookup -->
        <div class="tab-panel active" data-panel="n-mac">
          <div class="card mb-12">
            <div class="input-group">
              <div class="input-wrap flex-1"><i class="fas fa-ethernet input-icon"></i>
                <input class="form-input has-icon" id="mac-input" placeholder="00:1A:2B:3C:4D:5E  or  001A2B3C4D5E" />
              </div>
              <button class="btn btn-primary" id="mac-lookup-btn"><i class="fas fa-search"></i> Lookup</button>
            </div>
          </div>
          <div id="mac-results"></div>
        </div>

        <!-- ASN -->
        <div class="tab-panel" data-panel="n-asn">
          <div class="card mb-12">
            <div class="input-group">
              <div class="input-wrap flex-1"><i class="fas fa-route input-icon"></i>
                <input class="form-input has-icon" id="asn-input" placeholder="AS15169 or 15169" />
              </div>
              <button class="btn btn-primary" id="asn-lookup-btn"><i class="fas fa-search"></i> Lookup</button>
            </div>
          </div>
          <div id="asn-results"></div>
        </div>

        <!-- CIDR -->
        <div class="tab-panel" data-panel="n-cidr">
          <div class="card mb-12">
            <div class="input-group">
              <div class="input-wrap flex-1"><i class="fas fa-calculator input-icon"></i>
                <input class="form-input has-icon" id="cidr-input" placeholder="192.168.1.0/24" />
              </div>
              <button class="btn btn-primary" id="cidr-calc-btn"><i class="fas fa-calculator"></i> Calculate</button>
            </div>
          </div>
          <div id="cidr-results"></div>
        </div>

        <!-- Port Reference -->
        <div class="tab-panel" data-panel="n-ports">
          <div class="card mb-12">
            <div class="flex gap-8">
              <div class="input-wrap flex-1"><i class="fas fa-search input-icon"></i>
                <input class="form-input has-icon" id="port-search" placeholder="Search port number or service name..." />
              </div>
              <select class="form-select" id="port-risk-filter">
                <option value="">All Risk Levels</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
          <div id="port-list">${this.renderPortList('','')}</div>
        </div>

        <!-- VPN/Proxy Detect -->
        <div class="tab-panel" data-panel="n-vpn">
          <div class="card mb-12">
            <div class="input-group">
              <div class="input-wrap flex-1"><i class="fas fa-network-wired input-icon"></i>
                <input class="form-input has-icon" id="proxy-ip-input" placeholder="IP address (leave blank for your IP)" />
              </div>
              <button class="btn btn-primary" id="proxy-check-btn"><i class="fas fa-search"></i> Check</button>
              <button class="btn btn-secondary" id="proxy-myip-btn"><i class="fas fa-crosshairs"></i> My IP</button>
            </div>
          </div>
          <div id="proxy-results"></div>
        </div>
      </div>
    </div>`;
  },

  renderPortList(search, riskFilter) {
    let ports = this.PORTS;
    if (search) ports = ports.filter(p => p.port.toString().includes(search) || p.name.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase()));
    if (riskFilter) ports = ports.filter(p => p.risk === riskFilter);
    const riskColors = { Critical:'red', High:'amber', Medium:'cyan', Low:'green' };
    return `<div class="card"><div style="overflow-x:auto;">
      <table class="data-table">
        <thead><tr><th>Port</th><th>Proto</th><th>Service</th><th>Risk</th><th>Description</th></tr></thead>
        <tbody>${ports.map(p=>`<tr>
          <td class="text-cyan mono">${p.port}</td>
          <td><span class="badge badge-muted">${p.proto}</span></td>
          <td><strong>${p.name}</strong></td>
          <td><span class="badge badge-${riskColors[p.risk]||'muted'}">${p.risk}</span></td>
          <td class="text-secondary" style="font-size:.78rem;">${p.desc}</td>
        </tr>`).join('')}
        </tbody>
      </table>
    </div></div>`;
  },

  init() {
    document.getElementById('mac-lookup-btn').addEventListener('click', () => this.macLookup());
    document.getElementById('mac-input').addEventListener('keydown', e => { if(e.key==='Enter') this.macLookup(); });
    document.getElementById('asn-lookup-btn').addEventListener('click', () => this.asnLookup());
    document.getElementById('asn-input').addEventListener('keydown', e => { if(e.key==='Enter') this.asnLookup(); });
    document.getElementById('cidr-calc-btn').addEventListener('click', () => this.cidrCalc());
    document.getElementById('cidr-input').addEventListener('keydown', e => { if(e.key==='Enter') this.cidrCalc(); });
    document.getElementById('proxy-check-btn').addEventListener('click', () => this.proxyCheck());
    document.getElementById('proxy-myip-btn').addEventListener('click', () => { document.getElementById('proxy-ip-input').value=''; this.proxyCheck(); });

    // Port search
    const portSearch = Utils.debounce(() => {
      const s = document.getElementById('port-search').value;
      const r = document.getElementById('port-risk-filter').value;
      document.getElementById('port-list').innerHTML = this.renderPortList(s,r);
    }, 300);
    document.getElementById('port-search').addEventListener('input', portSearch);
    document.getElementById('port-risk-filter').addEventListener('change', portSearch);
  },

  async macLookup() {
    const raw = document.getElementById('mac-input').value.trim();
    const mac = raw.replace(/[^a-fA-F0-9]/g,'').toUpperCase();
    if (mac.length < 6) { App.showToast('Enter a valid MAC address', 'warning'); return; }
    const formatted = mac.match(/.{1,2}/g).join(':').substring(0,17);
    const oui = mac.substring(0,6);
    const res = document.getElementById('mac-results');
    res.innerHTML = `<div class="loader"><div class="spinner"></div><span>Looking up vendor...</span></div>`;
    App.addToHistory('network', `MAC: ${formatted}`);
    let vendor = this.COMMON_OUIS[oui] || null;
    if (!vendor) {
      try { vendor = await API.macVendor(oui); } catch {}
    }
    const firstOctet = parseInt(mac.substring(0,2),16);
    const isMulticast = (firstOctet & 1) === 1;
    const isLocalAdmin = (firstOctet & 2) === 2;
    res.innerHTML = `<div class="card animate-fadeInUp">
      <div class="card-header"><div class="card-title"><i class="fas fa-ethernet"></i> MAC Address Analysis</div></div>
      <div class="data-row"><span class="data-label">Full MAC</span><span class="data-value mono text-cyan">${formatted}<button class="copy-btn ms-1" onclick="copyToClipboard('${formatted}')">copy</button></span></div>
      <div class="data-row"><span class="data-label">OUI (First 3 Octets)</span><span class="data-value mono">${oui.match(/.{1,2}/g).join(':')}</span></div>
      <div class="data-row"><span class="data-label">Vendor</span><span class="data-value text-green">${vendor || '<span class="text-muted">Unknown vendor</span>'}</span></div>
      <div class="data-row"><span class="data-label">Unicast/Multicast</span><span class="data-value"><span class="badge badge-${isMulticast?'amber':'cyan'}">${isMulticast?'Multicast':'Unicast'}</span></span></div>
      <div class="data-row"><span class="data-label">Admin Type</span><span class="data-value"><span class="badge badge-${isLocalAdmin?'amber':'green'}">${isLocalAdmin?'Locally Administered':'Globally Unique'}</span></span></div>
    </div>`;
  },

  async asnLookup() {
    const raw = document.getElementById('asn-input').value.trim().replace(/^AS/i,'');
    if (!raw || isNaN(raw)) { App.showToast('Enter a valid ASN', 'warning'); return; }
    const res = document.getElementById('asn-results');
    res.innerHTML = `<div class="loader"><div class="spinner"></div><span>Querying BGP data...</span></div>`;
    App.addToHistory('network', `ASN: ${raw}`);
    try {
      const [asnData, prefixData] = await Promise.all([API.bgpASN(raw), API.bgpPrefixes(raw)]);
      const asn = asnData.data || {};
      const prefixes = prefixData.data || {};
      res.innerHTML = `<div class="animate-fadeInUp">
        <div class="card mb-12">
          <div class="card-header"><div class="card-title"><i class="fas fa-route"></i> ASN${raw} — ${asn.name||'Unknown'}</div></div>
          <div class="data-row"><span class="data-label">ASN</span><span class="data-value text-cyan">AS${asn.asn||raw}</span></div>
          <div class="data-row"><span class="data-label">Name</span><span class="data-value">${asn.name||'N/A'}</span></div>
          <div class="data-row"><span class="data-label">Description</span><span class="data-value">${asn.description_short||asn.description_full||'N/A'}</span></div>
          <div class="data-row"><span class="data-label">Country</span><span class="data-value">${asn.country_code?Utils.countryFlag(asn.country_code)+'  '+asn.country_code:'N/A'}</span></div>
          <div class="data-row"><span class="data-label">Website</span><span class="data-value">${asn.website?`<a href="${asn.website}" target="_blank" class="text-cyan">${asn.website}</a>`:'N/A'}</span></div>
          <div class="data-row"><span class="data-label">RIR</span><span class="data-value"><span class="badge badge-purple">${asn.rir_allocation?.rir_name||'Unknown'}</span></span></div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title"><i class="fas fa-list"></i> IP Prefixes (${(prefixes.ipv4_prefixes||[]).length} IPv4, ${(prefixes.ipv6_prefixes||[]).length} IPv6)</div></div>
          ${(prefixes.ipv4_prefixes||[]).slice(0,10).map(p=>`<div class="data-row"><span class="data-label mono">${p.prefix}</span><span class="data-value text-secondary" style="font-size:.78rem;">${p.name||p.description||''}</span></div>`).join('')}
          ${(prefixes.ipv4_prefixes||[]).length > 10 ? `<div class="text-muted" style="font-size:.75rem;padding:8px;">... and ${(prefixes.ipv4_prefixes||[]).length - 10} more prefixes</div>` : ''}
        </div>
      </div>`;
    } catch(e) {
      res.innerHTML = `<div class="alert alert-danger">${Utils.escapeHtml(e.message)}</div>`;
    }
  },

  cidrCalc() {
    const input = document.getElementById('cidr-input').value.trim();
    const res = document.getElementById('cidr-results');
    if (!input.includes('/')) { App.showToast('Use CIDR notation like 192.168.1.0/24', 'warning'); return; }
    try {
      const [ip, prefixStr] = input.split('/');
      const prefix = parseInt(prefixStr);
      if (prefix < 0 || prefix > 32) throw new Error('Prefix must be 0-32');
      const parts = ip.split('.').map(Number);
      if (parts.length !== 4 || parts.some(p=>p<0||p>255)) throw new Error('Invalid IP address');
      const ipInt = parts.reduce((acc,p)=>(acc<<8)|p, 0) >>> 0;
      const mask = prefix === 0 ? 0 : (0xFFFFFFFF << (32-prefix)) >>> 0;
      const network = (ipInt & mask) >>> 0;
      const broadcast = (network | (~mask >>> 0)) >>> 0;
      const toIP = n => [(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255].join('.');
      const hostCount = Math.pow(2, 32-prefix);
      const isPrivate = (toIP(network).startsWith('10.') || (/^172\.(1[6-9]|2\d|3[01])\./.test(toIP(network))) || toIP(network).startsWith('192.168.'));
      const ipClass = parts[0]<128?'A':parts[0]<192?'B':parts[0]<224?'C':parts[0]<240?'D':'E';
      const toBin = n => [(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255].map(o=>o.toString(2).padStart(8,'0')).join('.');
      App.addToHistory('network', `CIDR: ${input}`);
      res.innerHTML = `<div class="card animate-fadeInUp">
        <div class="card-header"><div class="card-title"><i class="fas fa-calculator"></i> CIDR Results for ${Utils.escapeHtml(input)}</div></div>
        <div class="grid-2">
          <div>
            <div class="data-row"><span class="data-label">Network Address</span><span class="data-value text-cyan mono">${toIP(network)}</span></div>
            <div class="data-row"><span class="data-label">Broadcast Address</span><span class="data-value mono">${toIP(broadcast)}</span></div>
            <div class="data-row"><span class="data-label">First Usable Host</span><span class="data-value text-green mono">${prefix<=30?toIP(network+1):'N/A'}</span></div>
            <div class="data-row"><span class="data-label">Last Usable Host</span><span class="data-value text-green mono">${prefix<=30?toIP(broadcast-1):'N/A'}</span></div>
            <div class="data-row"><span class="data-label">Subnet Mask</span><span class="data-value mono">${toIP(mask)}</span></div>
            <div class="data-row"><span class="data-label">Wildcard Mask</span><span class="data-value mono">${toIP(~mask>>>0)}</span></div>
          </div>
          <div>
            <div class="data-row"><span class="data-label">Total Hosts</span><span class="data-value text-cyan">${hostCount.toLocaleString()}</span></div>
            <div class="data-row"><span class="data-label">Usable Hosts</span><span class="data-value text-green">${Math.max(0,hostCount-2).toLocaleString()}</span></div>
            <div class="data-row"><span class="data-label">IP Class</span><span class="data-value"><span class="badge badge-purple">Class ${ipClass}</span></span></div>
            <div class="data-row"><span class="data-label">Scope</span><span class="data-value"><span class="badge badge-${isPrivate?'green':'amber'}">${isPrivate?'Private (RFC 1918)':'Public'}</span></span></div>
            <div class="data-row"><span class="data-label">Prefix Length</span><span class="data-value mono">/${prefix}</span></div>
          </div>
        </div>
        <div class="card mt-12" style="background:rgba(0,0,0,.3);">
          <div class="card-header"><div class="card-title"><i class="fas fa-code"></i> Binary Representation</div></div>
          <div class="terminal-output" style="margin:0;font-size:.72rem;">
Network:   ${toBin(network)}
Mask:      ${toBin(mask)}
Broadcast: ${toBin(broadcast)}</div>
        </div>
      </div>`;
    } catch(e) {
      res.innerHTML = `<div class="alert alert-danger"><i class="fas fa-times-circle"></i> ${Utils.escapeHtml(e.message)}</div>`;
    }
  },

  async proxyCheck() {
    const ip = document.getElementById('proxy-ip-input').value.trim();
    const res = document.getElementById('proxy-results');
    res.innerHTML = `<div class="loader"><div class="spinner"></div><span>Checking anonymization status...</span></div>`;
    try {
      const g = await API.ipGeo(ip);
      if (g.status === 'fail') throw new Error(g.message);
      App.addToHistory('network', `Proxy check: ${g.query}`);
      const isAnon = g.proxy || g.hosting;
      res.innerHTML = `<div class="card animate-fadeInUp" style="border-color:var(--${isAnon?'red':'green'});">
        <div class="card-header">
          <div class="card-title"><i class="fas fa-mask text-${isAnon?'red':'green'}"></i> ${isAnon?'ANONYMIZED CONNECTION DETECTED':'CLEAN IP ADDRESS'}</div>
          ${isAnon?'<span class="badge badge-red">ANONYMOUS</span>':'<span class="badge badge-green">CLEAN</span>'}
        </div>
        <div class="grid-2">
          <div>
            <div class="data-row"><span class="data-label">IP Address</span><span class="data-value text-cyan">${g.query}</span></div>
            <div class="data-row"><span class="data-label">Country</span><span class="data-value">${Utils.countryFlag(g.countryCode)} ${g.country}</span></div>
            <div class="data-row"><span class="data-label">City</span><span class="data-value">${g.city}, ${g.regionName}</span></div>
            <div class="data-row"><span class="data-label">ISP</span><span class="data-value">${g.isp}</span></div>
            <div class="data-row"><span class="data-label">Organisation</span><span class="data-value">${g.org}</span></div>
          </div>
          <div>
            <div class="data-row"><span class="data-label">Proxy/VPN</span><span class="data-value"><span class="badge badge-${g.proxy?'red':'green'}">${g.proxy?'DETECTED':'Clean'}</span></span></div>
            <div class="data-row"><span class="data-label">Hosting/Datacenter</span><span class="data-value"><span class="badge badge-${g.hosting?'amber':'muted'}">${g.hosting?'YES':'No'}</span></span></div>
            <div class="data-row"><span class="data-label">Mobile Network</span><span class="data-value"><span class="badge badge-${g.mobile?'amber':'muted'}">${g.mobile?'YES':'No'}</span></span></div>
            <div class="data-row"><span class="data-label">Confidence</span><span class="data-value text-${isAnon?'red':'green'}">${isAnon?'High (80-95%)':'Low threat'}</span></div>
          </div>
        </div>
        ${isAnon?`<div class="alert alert-warning mt-12"><i class="fas fa-exclamation-triangle"></i> This IP is detected as a proxy, VPN, or datacenter. Real origin may be hidden.</div>`:''}
      </div>`;
    } catch(e) {
      res.innerHTML = `<div class="alert alert-danger">${Utils.escapeHtml(e.message)}</div>`;
    }
  }
};
