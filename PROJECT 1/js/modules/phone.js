/* OSINT GENIUS — Phone Intelligence Module */
window.PhoneModule = {
  id: 'phone', name: 'Phone Intelligence', _map: null,

  CC: {
    '1':{'name':'United States','code':'US','flag':'🇺🇸','tz':'America/New_York','lat':38.9,'lon':-77},
    '7':{'name':'Russia','code':'RU','flag':'🇷🇺','tz':'Europe/Moscow','lat':55.75,'lon':37.6},
    '20':{'name':'Egypt','code':'EG','flag':'🇪🇬','tz':'Africa/Cairo','lat':30.06,'lon':31.24},
    '27':{'name':'South Africa','code':'ZA','flag':'🇿🇦','tz':'Africa/Johannesburg','lat':-25.74,'lon':28.19},
    '30':{'name':'Greece','code':'GR','flag':'🇬🇷','tz':'Europe/Athens','lat':37.98,'lon':23.73},
    '31':{'name':'Netherlands','code':'NL','flag':'🇳🇱','tz':'Europe/Amsterdam','lat':52.37,'lon':4.9},
    '32':{'name':'Belgium','code':'BE','flag':'🇧🇪','tz':'Europe/Brussels','lat':50.85,'lon':4.35},
    '33':{'name':'France','code':'FR','flag':'🇫🇷','tz':'Europe/Paris','lat':48.86,'lon':2.35},
    '34':{'name':'Spain','code':'ES','flag':'🇪🇸','tz':'Europe/Madrid','lat':40.42,'lon':-3.7},
    '36':{'name':'Hungary','code':'HU','flag':'🇭🇺','tz':'Europe/Budapest','lat':47.5,'lon':19.04},
    '39':{'name':'Italy','code':'IT','flag':'🇮🇹','tz':'Europe/Rome','lat':41.9,'lon':12.5},
    '40':{'name':'Romania','code':'RO','flag':'🇷🇴','tz':'Europe/Bucharest','lat':44.44,'lon':26.1},
    '41':{'name':'Switzerland','code':'CH','flag':'🇨🇭','tz':'Europe/Zurich','lat':47.37,'lon':8.55},
    '43':{'name':'Austria','code':'AT','flag':'🇦🇹','tz':'Europe/Vienna','lat':48.21,'lon':16.37},
    '44':{'name':'United Kingdom','code':'GB','flag':'🇬🇧','tz':'Europe/London','lat':51.51,'lon':-0.13},
    '45':{'name':'Denmark','code':'DK','flag':'🇩🇰','tz':'Europe/Copenhagen','lat':55.68,'lon':12.57},
    '46':{'name':'Sweden','code':'SE','flag':'🇸🇪','tz':'Europe/Stockholm','lat':59.33,'lon':18.07},
    '47':{'name':'Norway','code':'NO','flag':'🇳🇴','tz':'Europe/Oslo','lat':59.91,'lon':10.75},
    '48':{'name':'Poland','code':'PL','flag':'🇵🇱','tz':'Europe/Warsaw','lat':52.23,'lon':21.01},
    '49':{'name':'Germany','code':'DE','flag':'🇩🇪','tz':'Europe/Berlin','lat':52.52,'lon':13.41},
    '51':{'name':'Peru','code':'PE','flag':'🇵🇪','tz':'America/Lima','lat':-12.05,'lon':-77.04},
    '52':{'name':'Mexico','code':'MX','flag':'🇲🇽','tz':'America/Mexico_City','lat':19.43,'lon':-99.13},
    '55':{'name':'Brazil','code':'BR','flag':'🇧🇷','tz':'America/Sao_Paulo','lat':-15.78,'lon':-47.93},
    '56':{'name':'Chile','code':'CL','flag':'🇨🇱','tz':'America/Santiago','lat':-33.46,'lon':-70.65},
    '57':{'name':'Colombia','code':'CO','flag':'🇨🇴','tz':'America/Bogota','lat':4.71,'lon':-74.07},
    '61':{'name':'Australia','code':'AU','flag':'🇦🇺','tz':'Australia/Sydney','lat':-35.28,'lon':149.13},
    '62':{'name':'Indonesia','code':'ID','flag':'🇮🇩','tz':'Asia/Jakarta','lat':-6.21,'lon':106.85},
    '63':{'name':'Philippines','code':'PH','flag':'🇵🇭','tz':'Asia/Manila','lat':14.6,'lon':120.98},
    '64':{'name':'New Zealand','code':'NZ','flag':'🇳🇿','tz':'Pacific/Auckland','lat':-41.29,'lon':174.78},
    '65':{'name':'Singapore','code':'SG','flag':'🇸🇬','tz':'Asia/Singapore','lat':1.35,'lon':103.82},
    '66':{'name':'Thailand','code':'TH','flag':'🇹🇭','tz':'Asia/Bangkok','lat':13.75,'lon':100.52},
    '81':{'name':'Japan','code':'JP','flag':'🇯🇵','tz':'Asia/Tokyo','lat':35.69,'lon':139.69},
    '82':{'name':'South Korea','code':'KR','flag':'🇰🇷','tz':'Asia/Seoul','lat':37.57,'lon':126.98},
    '84':{'name':'Vietnam','code':'VN','flag':'🇻🇳','tz':'Asia/Ho_Chi_Minh','lat':21.03,'lon':105.85},
    '86':{'name':'China','code':'CN','flag':'🇨🇳','tz':'Asia/Shanghai','lat':39.91,'lon':116.39},
    '90':{'name':'Turkey','code':'TR','flag':'🇹🇷','tz':'Europe/Istanbul','lat':39.93,'lon':32.86},
    '91':{'name':'India','code':'IN','flag':'🇮🇳','tz':'Asia/Kolkata','lat':28.61,'lon':77.21},
    '92':{'name':'Pakistan','code':'PK','flag':'🇵🇰','tz':'Asia/Karachi','lat':33.72,'lon':73.04},
    '93':{'name':'Afghanistan','code':'AF','flag':'🇦🇫','tz':'Asia/Kabul','lat':34.52,'lon':69.18},
    '94':{'name':'Sri Lanka','code':'LK','flag':'🇱🇰','tz':'Asia/Colombo','lat':6.93,'lon':79.85},
    '98':{'name':'Iran','code':'IR','flag':'🇮🇷','tz':'Asia/Tehran','lat':35.69,'lon':51.42},
  },

  render() {
    return `<div class="module-area animate-fadeInUp">
      <div class="module-header">
        <div class="module-icon-title">
          <div class="module-icon-wrap icon-green"><i class="fas fa-mobile-alt"></i></div>
          <div><div class="module-title">Phone Intelligence</div><div class="module-subtitle">Country, carrier, line type, timezone & geolocation</div></div>
        </div>
      </div>
      <div class="card mb-16">
        <div class="input-group">
          <div class="input-wrap flex-1">
            <i class="fas fa-phone input-icon"></i>
            <input class="form-input has-icon" id="phone-input" placeholder="+1 555 123 4567  or  +44 20 7946 0958" />
          </div>
          <button class="btn btn-primary" id="phone-analyze-btn"><i class="fas fa-search"></i> Analyze</button>
        </div>
      </div>
      <div id="phone-results" class="hidden"></div>
    </div>`;
  },

  init() {
    document.getElementById('phone-analyze-btn').addEventListener('click', () => this.analyze());
    document.getElementById('phone-input').addEventListener('keydown', e => { if(e.key==='Enter') this.analyze(); });
  },

  parsePhone(raw) {
    const digits = raw.replace(/\D/g, '');
    const hasPlus = raw.trim().startsWith('+');
    if (!digits.length) return null;

    // Detect country code from E.164 format or guess from length
    let cc = null, local = digits;
    if (hasPlus || digits.length > 10) {
      for (const code of Object.keys(this.CC).sort((a,b)=>b.length-a.length)) {
        if (digits.startsWith(code)) { cc = code; local = digits.substring(code.length); break; }
      }
    }
    if (!cc) cc = '1'; // default US

    // Normalise to ensure full has country prefix
    let full = digits;
    if (cc === '1' && !digits.startsWith('1') && digits.length === 10) {
      full = '1' + digits;
      local = digits;
    } else if (cc && digits.startsWith(cc)) {
      local = digits.substring(cc.length);
    }

    const lineType = /^1800|^1888|^1877|^1866|^1855/.test(digits) ? 'Toll-Free'
      : /^1900/.test(digits) ? 'Premium'
      : local.length >= 10 ? 'Mobile'
      : 'Landline';

    return { cc, local, full, e164: `+${full}`, national: `0${local}`, lineType, info: this.CC[cc] };
  },

  analyze() {
    const raw = document.getElementById('phone-input').value.trim();
    if (!raw) { App.showToast('Enter a phone number', 'warning'); return; }
    const parsed = this.parsePhone(raw);
    if (!parsed) { App.showToast('Could not parse phone number', 'error'); return; }
    App.addToHistory('phone', raw);
    this.renderResult(parsed);
  },

  renderResult(p) {
    const info = p.info || {};
    const now = info.tz ? new Date().toLocaleString('en-US', { timeZone: info.tz, hour12: false }) : 'N/A';
    const riskLevel = p.lineType === 'Premium' ? 'high' : p.lineType === 'Toll-Free' ? 'medium' : 'safe';
    const riskLabel = riskLevel === 'high' ? 'High Risk' : riskLevel === 'medium' ? 'Medium Risk' : 'Low Risk';
    const riskIcon = riskLevel === 'high' ? 'fa-exclamation-triangle' : riskLevel === 'medium' ? 'fa-info-circle' : 'fa-shield-alt';

    const res = document.getElementById('phone-results');
    res.classList.remove('hidden');
    res.innerHTML = `<div class="animate-fadeInUp">
      <!-- Phone Display -->
      <div class="card mb-16" style="text-align:center;">
        <div class="phone-display">${Utils.escapeHtml(p.e164)}</div>
        <div style="font-size:2rem;">${info.flag||'🌐'} <span style="font-size:1rem;font-weight:600;">${info.name||'Unknown Country'}</span></div>
      </div>

      <div class="grid-2 gap-16">
        <div>
          <!-- Info Card -->
          <div class="card mb-12">
            <div class="card-header"><div class="card-title"><i class="fas fa-info-circle"></i> Number Details</div></div>
            <div class="data-row"><span class="data-label">Country Code</span><span class="data-value text-cyan">+${p.cc}</span></div>
            <div class="data-row"><span class="data-label">Local Number</span><span class="data-value mono">${p.local}</span></div>
            <div class="data-row"><span class="data-label">Line Type</span><span class="data-value"><span class="badge badge-${p.lineType==='Mobile'?'green':p.lineType==='Toll-Free'?'amber':'cyan'}">${p.lineType}</span></span></div>
            <div class="data-row"><span class="data-label">Country</span><span class="data-value">${info.name||'Unknown'}</span></div>
            <div class="data-row"><span class="data-label">Timezone</span><span class="data-value">${info.tz||'Unknown'}</span></div>
            <div class="data-row"><span class="data-label">Local Time</span><span class="data-value text-green">${now}</span></div>
          </div>

          <!-- Formats -->
          <div class="card mb-12">
            <div class="card-header"><div class="card-title"><i class="fas fa-list"></i> Number Formats</div></div>
            <div class="phone-formats">
              <div class="phone-format-row"><span class="text-muted">E.164</span><span class="text-cyan">${p.e164}</span><button class="copy-btn" onclick="copyToClipboard('${p.e164}')">copy</button></div>
              <div class="phone-format-row"><span class="text-muted">National</span><span>${p.national}</span></div>
              <div class="phone-format-row"><span class="text-muted">International</span><span>+${p.cc} ${p.local}</span></div>
              <div class="phone-format-row"><span class="text-muted">Digits Only</span><span>${p.full}</span></div>
              <div class="phone-format-row"><span class="text-muted">RFC 3966</span><span>tel:${p.e164}</span></div>
            </div>
          </div>

          <!-- Risk -->
          <div class="phone-risk-indicator ${riskLevel}">
            <i class="fas ${riskIcon}" style="font-size:1.2rem;"></i>
            <div><div style="font-weight:700;">${riskLabel}</div><div style="font-size:.75rem;opacity:.8;">${p.lineType} number from ${info.name||'unknown country'}</div></div>
          </div>
        </div>

        <div>
          <!-- Map -->
          <div class="card mb-12">
            <div class="card-header"><div class="card-title"><i class="fas fa-map-marker-alt"></i> Origin Location</div></div>
            <div id="phone-mini-map" style="height:200px;border-radius:8px;"></div>
          </div>

          <!-- Social Hints -->
          <div class="card mb-12">
            <div class="card-header"><div class="card-title"><i class="fas fa-share-alt"></i> Social Media Hints</div></div>
            <div class="flex-col gap-8">
              <a class="btn btn-secondary" href="https://wa.me/${p.full}" target="_blank"><i class="fab fa-whatsapp"></i> Check WhatsApp</a>
              <a class="btn btn-secondary" href="https://t.me/${p.e164}" target="_blank"><i class="fab fa-telegram"></i> Check Telegram</a>
              <a class="btn btn-secondary" href="https://www.truecaller.com/search/${(info.code || 'US').toLowerCase()}/${p.local}" target="_blank"><i class="fas fa-phone-alt"></i> Truecaller Lookup</a>
            </div>
          </div>

          <!-- Stats -->
          <div class="grid-2">
            <div class="stat-card"><div class="stat-label">Digits</div><div class="stat-value text-cyan">${p.full.length}</div></div>
            <div class="stat-card"><div class="stat-label">CC Length</div><div class="stat-value text-green">${p.cc.length}</div></div>
          </div>
        </div>
      </div>
    </div>`;

    setTimeout(() => {
      try {
        if (this._map) { this._map.remove(); this._map = null; }
        if (info.lat && info.lon) {
          this._map = App.createDarkMap('phone-mini-map', info.lat, info.lon, 5);
          L.circleMarker([info.lat, info.lon], { radius:12, fillColor:'#00ff88', color:'#00ff88', fillOpacity:0.6, weight:2 })
            .addTo(this._map)
            .bindPopup(`<strong>${info.flag} ${info.name}</strong><br>+${p.cc} region`).openPopup();
        }
      } catch(e) {}
    }, 200);
  }
};
