/* OSINT GENIUS — URL Analyzer Module */
window.URLAnalyzerModule = {
  id: 'urlanalyzer', name: 'URL Analyzer',

  render() {
    return `<div class="module-area animate-fadeInUp">
      <div class="module-header">
        <div class="module-icon-title">
          <div class="module-icon-wrap icon-amber"><i class="fas fa-link"></i></div>
          <div><div class="module-title">URL Analyzer</div><div class="module-subtitle">Parse, redirect tracing, safety scoring & QR decoding</div></div>
        </div>
      </div>
      <div class="tab-bar">
        <button class="tab-btn active" data-tab="url-parse"><i class="fas fa-code"></i> URL Parser</button>
        <button class="tab-btn" data-tab="url-redirect"><i class="fas fa-route"></i> Redirect Chain</button>
        <button class="tab-btn" data-tab="url-safety"><i class="fas fa-shield-alt"></i> Safety Check</button>
        <button class="tab-btn" data-tab="url-qr"><i class="fas fa-qrcode"></i> QR Decoder</button>
      </div>
      <div>
        <!-- URL Parser -->
        <div class="tab-panel active" data-panel="url-parse">
          <div class="card mb-12">
            <div class="input-group">
              <div class="input-wrap flex-1"><i class="fas fa-link input-icon"></i>
                <input class="form-input has-icon" id="url-parse-input" placeholder="https://example.com/path?key=value#section" />
              </div>
              <button class="btn btn-primary" id="url-parse-btn"><i class="fas fa-cogs"></i> Parse</button>
            </div>
          </div>
          <div id="url-parse-results"></div>
        </div>

        <!-- Redirect Chain -->
        <div class="tab-panel" data-panel="url-redirect">
          <div class="card mb-12">
            <div class="input-group">
              <div class="input-wrap flex-1"><i class="fas fa-link input-icon"></i>
                <input class="form-input has-icon" id="url-redirect-input" placeholder="https://bit.ly/shortened-url" />
              </div>
              <button class="btn btn-primary" id="url-redirect-btn"><i class="fas fa-route"></i> Trace Redirects</button>
            </div>
          </div>
          <div id="url-redirect-results"></div>
        </div>

        <!-- Safety Check -->
        <div class="tab-panel" data-panel="url-safety">
          <div class="card mb-12">
            <div class="input-group">
              <div class="input-wrap flex-1"><i class="fas fa-link input-icon"></i>
                <input class="form-input has-icon" id="url-safety-input" placeholder="https://suspicious-site.xyz" />
              </div>
              <button class="btn btn-primary" id="url-safety-btn"><i class="fas fa-shield-alt"></i> Check Safety</button>
            </div>
          </div>
          <div id="url-safety-results"></div>
        </div>

        <!-- QR Decoder -->
        <div class="tab-panel" data-panel="url-qr">
          <div class="alert alert-info mb-12">
            <i class="fas fa-info-circle"></i>
            <div>Upload an image containing a QR code to decode it locally in your browser.</div>
          </div>
          <div class="drop-zone" id="qr-drop">
            <i class="fas fa-qrcode"></i>
            <p><strong>Drop QR code image here</strong> or click to select</p>
            <p style="font-size:.75rem;color:var(--text-muted);margin-top:4px;">JPEG, PNG supported</p>
            <input type="file" id="qr-file-input" accept="image/*" style="display:none;" />
          </div>
          <canvas id="qr-canvas" style="display:none;"></canvas>
          <div id="qr-results" class="mt-12"></div>
        </div>
      </div>
    </div>`;
  },

  SUSPICIOUS_TLDS: ['.xyz','.tk','.ml','.ga','.cf','.gq','.top','.pw','.click','.link','.work'],

  analyzeURL(urlStr) {
    let parsed;
    try { parsed = new URL(urlStr.startsWith('http')?urlStr:'https://'+urlStr); }
    catch { return null; }
    const warnings = [];
    if (/^\d{1,3}(\.\d{1,3}){3}/.test(parsed.hostname)) warnings.push({ icon:'fa-exclamation-triangle', text:'IP-based URL — no domain name', level:'danger' });
    const nonStdPort = parsed.port && !['80','443',''].includes(parsed.port);
    if (nonStdPort) warnings.push({ icon:'fa-exclamation-triangle', text:`Non-standard port: ${parsed.port}`, level:'warn' });
    const subdomainDepth = (parsed.hostname.match(/\./g)||[]).length;
    if (subdomainDepth > 3) warnings.push({ icon:'fa-layer-group', text:`Excessive subdomains (${subdomainDepth} levels)`, level:'warn' });
    if (this.SUSPICIOUS_TLDS.some(tld=>parsed.hostname.endsWith(tld))) warnings.push({ icon:'fa-flag', text:'Suspicious TLD detected', level:'danger' });
    if (urlStr.length > 200) warnings.push({ icon:'fa-text-width', text:`Very long URL (${urlStr.length} chars)`, level:'warn' });
    const params = [...parsed.searchParams.entries()];
    return { parsed, warnings, params };
  },

  init() {
    document.getElementById('url-parse-btn').addEventListener('click', () => this.parseURL());
    document.getElementById('url-parse-input').addEventListener('keydown', e => { if(e.key==='Enter') this.parseURL(); });
    document.getElementById('url-redirect-btn').addEventListener('click', () => this.traceRedirects());
    document.getElementById('url-redirect-input').addEventListener('keydown', e => { if(e.key==='Enter') this.traceRedirects(); });
    document.getElementById('url-safety-btn').addEventListener('click', () => this.safetyCheck());
    document.getElementById('url-safety-input').addEventListener('keydown', e => { if(e.key==='Enter') this.safetyCheck(); });

    // QR setup
    const qrDrop = document.getElementById('qr-drop');
    const qrInput = document.getElementById('qr-file-input');
    qrDrop.addEventListener('click', () => qrInput.click());
    qrDrop.addEventListener('dragover', e => { e.preventDefault(); qrDrop.classList.add('drag-over'); });
    qrDrop.addEventListener('dragleave', () => qrDrop.classList.remove('drag-over'));
    qrDrop.addEventListener('drop', e => { e.preventDefault(); qrDrop.classList.remove('drag-over'); const f=e.dataTransfer.files[0]; if(f) this.decodeQR(f); });
    qrInput.addEventListener('change', e => { const f=e.target.files[0]; if(f) this.decodeQR(f); });

    // Load jsQR
    if (!window.jsQR) {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js';
      document.head.appendChild(s);
    }
  },

  parseURL() {
    const input = document.getElementById('url-parse-input').value.trim();
    if (!input) { App.showToast('Enter a URL', 'warning'); return; }
    const analysis = this.analyzeURL(input);
    if (!analysis) { App.showToast('Invalid URL format', 'error'); return; }
    const { parsed, warnings, params } = analysis;
    App.addToHistory('urlanalyzer', input);
    const parts = [
      ['Protocol', parsed.protocol.replace(':',''), 'cyan'],
      ['Hostname', parsed.hostname, 'green'],
      ['Port', parsed.port||'(default)','muted'],
      ['Pathname', parsed.pathname||'/','primary'],
      ['Search', parsed.search||'(none)','amber'],
      ['Hash', parsed.hash||'(none)','purple'],
      ['Origin', parsed.origin,'cyan'],
      ['TLD', '.'+parsed.hostname.split('.').pop(),'green'],
    ];
    document.getElementById('url-parse-results').innerHTML = `<div class="animate-fadeInUp">
      ${warnings.length ? warnings.map(w=>`<div class="alert alert-${w.level==='danger'?'danger':'warning'} mb-8"><i class="fas ${w.icon}"></i> ${w.text}</div>`).join('') : '<div class="alert alert-success mb-12"><i class="fas fa-check-circle"></i> No suspicious patterns detected</div>'}
      <div class="grid-2 gap-10 mb-12">
        <div class="card">
          <div class="card-header"><div class="card-title"><i class="fas fa-code"></i> URL Components</div></div>
          ${parts.map(([k,v,c])=>`<div class="data-row"><span class="data-label">${k}</span><span class="data-value text-${c} mono" style="word-break:break-all;">${Utils.escapeHtml(v)}</span></div>`).join('')}
        </div>
        <div>
          <div class="card mb-10">
            <div class="card-header"><div class="card-title"><i class="fas fa-chart-bar"></i> URL Stats</div></div>
            <div class="data-row"><span class="data-label">Total Length</span><span class="data-value">${input.length} chars</span></div>
            <div class="data-row"><span class="data-label">Query Params</span><span class="data-value">${params.length}</span></div>
            <div class="data-row"><span class="data-label">Path Depth</span><span class="data-value">${(parsed.pathname.match(/\//g)||[]).length - 1}</span></div>
            <div class="data-row"><span class="data-label">Subdomain Depth</span><span class="data-value">${(parsed.hostname.match(/\./g)||[]).length}</span></div>
          </div>
          ${params.length ? `<div class="card">
            <div class="card-header"><div class="card-title"><i class="fas fa-list"></i> Query Parameters</div></div>
            <table style="width:100%;font-size:.78rem;">
              <thead><tr style="color:var(--text-muted);"><th style="text-align:left;padding:4px;">Key</th><th style="text-align:left;padding:4px;">Value</th></tr></thead>
              <tbody>${params.map(([k,v])=>`<tr><td style="padding:4px;color:var(--cyan);">${Utils.escapeHtml(k)}</td><td style="padding:4px;">${Utils.escapeHtml(v)}</td></tr>`).join('')}</tbody>
            </table>
          </div>` : ''}
        </div>
      </div>
    </div>`;
  },

  async traceRedirects() {
    const input = document.getElementById('url-redirect-input').value.trim();
    if (!input) { App.showToast('Enter a URL', 'warning'); return; }
    const res = document.getElementById('url-redirect-results');
    res.innerHTML = `<div class="loader"><div class="spinner"></div><span>Tracing redirects...</span></div>`;
    App.addToHistory('urlanalyzer', `redirect: ${input}`);
    try {
      const data = await API.get(`https://api.allorigins.win/get?url=${encodeURIComponent(input)}`);
      const finalUrl = data.status?.url || input;
      const hops = finalUrl !== input ? [
        { url: input, code: 301 },
        { url: finalUrl, code: 200 }
      ] : [{ url: input, code: 200 }];
      res.innerHTML = `<div class="card animate-fadeInUp">
        <div class="card-header"><div class="card-title"><i class="fas fa-route"></i> Redirect Chain (${hops.length} hop${hops.length!==1?'s':''})</div></div>
        <div class="redirect-chain">${hops.map((h,i)=>`
          <div class="redirect-hop ${i===hops.length-1?'final':''}">
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-8">
                <div class="hop-num">${i+1}</div>
                <span class="mono" style="font-size:.78rem;word-break:break-all;">${Utils.escapeHtml(h.url)}</span>
              </div>
              <span class="badge badge-${h.code===200?'green':h.code<400?'amber':'red'}">${h.code}</span>
            </div>
          </div>`).join('')}
        </div>
        ${finalUrl !== input ? `<div class="alert alert-info mt-12"><i class="fas fa-flag"></i> Final destination: <span class="text-cyan">${Utils.escapeHtml(finalUrl)}</span></div>` : ''}
      </div>`;
    } catch {
      res.innerHTML = `<div class="card animate-fadeInUp">
        <div class="card-header"><div class="card-title"><i class="fas fa-route"></i> Simulated Redirect Chain</div></div>
        <div class="alert alert-warning mb-12"><i class="fas fa-info-circle"></i> Live redirect tracing blocked by CORS. Showing analysis only.</div>
        <div class="redirect-chain">
          <div class="redirect-hop"><div class="flex justify-between"><span class="mono" style="font-size:.78rem;">${Utils.escapeHtml(input.substring(0,80))}</span><span class="badge badge-amber">302</span></div></div>
          <div class="redirect-hop final"><div class="flex justify-between"><span class="mono text-cyan" style="font-size:.78rem;">(final destination requires server-side check)</span><span class="badge badge-green">200</span></div></div>
        </div>
        <div class="mt-12"><a class="btn btn-secondary" href="https://httpstatus.io/?u=${encodeURIComponent(input)}" target="_blank"><i class="fas fa-external-link-alt"></i> Check on httpstatus.io</a></div>
      </div>`;
    }
  },

  safetyCheck() {
    const input = document.getElementById('url-safety-input').value.trim();
    if (!input) { App.showToast('Enter a URL', 'warning'); return; }
    const analysis = this.analyzeURL(input);
    if (!analysis) { App.showToast('Invalid URL', 'error'); return; }
    const { parsed, warnings } = analysis;
    App.addToHistory('urlanalyzer', `safety: ${input}`);

    let score = 0;
    const checks = [
      { label:'HTTPS Protocol', pass: parsed.protocol === 'https:', score:30 },
      { label:'Known Safe TLD (.com/.org/.gov/.edu)', pass: ['.com','.org','.gov','.edu','.net','.io'].some(t=>parsed.hostname.endsWith(t)), score:20 },
      { label:'No IP-based hostname', pass: !/^\d{1,3}(\.\d{1,3}){3}/.test(parsed.hostname), score:15 },
      { label:'No suspicious TLD', pass: !this.SUSPICIOUS_TLDS.some(t=>parsed.hostname.endsWith(t)), score:15 },
      { label:'Reasonable URL length', pass: input.length <= 200, score:10 },
      { label:'Standard port', pass: !parsed.port || ['80','443'].includes(parsed.port), score:5 },
      { label:'No excessive subdomains', pass: (parsed.hostname.match(/\./g)||[]).length <= 2, score:5 },
    ];
    checks.forEach(c => { if (c.pass) score += c.score; });
    const scoreColor = score >= 70 ? 'green' : score >= 40 ? 'amber' : 'red';
    const scoreLabel = score >= 70 ? 'Likely Safe' : score >= 40 ? 'Suspicious' : 'Dangerous';
    const res = document.getElementById('url-safety-results');
    res.innerHTML = `<div class="animate-fadeInUp">
      <div class="card mb-12">
        <div class="card-header"><div class="card-title"><i class="fas fa-shield-alt"></i> Safety Score</div></div>
        <div class="flex items-center gap-16 mb-12">
          <div style="width:80px;height:80px;border-radius:50%;border:4px solid var(--${scoreColor});display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <span style="font-size:1.5rem;font-weight:700;color:var(--${scoreColor});">${score}</span>
          </div>
          <div><div style="font-size:1.2rem;font-weight:700;color:var(--${scoreColor});">${scoreLabel}</div><div class="text-secondary" style="font-size:.82rem;">${Utils.escapeHtml(input.substring(0,80))}</div></div>
        </div>
        <div class="risk-bar-track mb-16"><div class="risk-bar-fill" style="width:${score}%;background:var(--${scoreColor});"></div></div>
        <div class="flex-col gap-6">
          ${checks.map(c=>`<div class="flex items-center gap-8">
            <i class="fas fa-${c.pass?'check-circle text-green':'times-circle text-red'}" style="width:16px;"></i>
            <span style="font-size:.82rem;color:${c.pass?'var(--text-primary)':'var(--text-secondary)'};">${c.label}</span>
            <span class="ms-auto text-muted" style="font-size:.72rem;">+${c.score} pts</span>
          </div>`).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fas fa-external-link-alt"></i> External Scanners</div></div>
        <div class="flex gap-8 flex-wrap">
          <a class="btn btn-secondary" href="https://www.virustotal.com/gui/url/${encodeURIComponent(input)}" target="_blank"><i class="fas fa-shield-virus"></i> VirusTotal</a>
          <a class="btn btn-secondary" href="https://urlvoid.com/scan/${encodeURIComponent(parsed.hostname)}" target="_blank"><i class="fas fa-search"></i> URLVoid</a>
          <a class="btn btn-secondary" href="https://transparencyreport.google.com/safe-browsing/search?url=${encodeURIComponent(input)}" target="_blank"><i class="fab fa-google"></i> Google Safe Browsing</a>
          <a class="btn btn-secondary" href="https://phishtank.com/?q=${encodeURIComponent(input)}" target="_blank"><i class="fas fa-fish"></i> PhishTank</a>
        </div>
      </div>
    </div>`;
  },

  decodeQR(file) {
    const res = document.getElementById('qr-results');
    res.innerHTML = `<div class="loader"><div class="spinner"></div><span>Decoding QR code...</span></div>`;
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.getElementById('qr-canvas');
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      if (!window.jsQR) {
        res.innerHTML = `<div class="alert alert-warning"><i class="fas fa-exclamation-triangle"></i> jsQR library still loading. Please try again in a moment.</div>`; return;
      }
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (code) {
        const decoded = code.data;
        const isUrl = decoded.startsWith('http://') || decoded.startsWith('https://');
        res.innerHTML = `<div class="card animate-fadeInUp">
          <div class="card-header"><div class="card-title text-green"><i class="fas fa-check-circle"></i> QR Code Decoded</div></div>
          <div class="terminal-output" style="margin:0;">${Utils.escapeHtml(decoded)}</div>
          <div class="flex gap-8 mt-12">
            <button class="btn btn-secondary btn-sm" onclick="copyToClipboard('${decoded.replace(/'/g,"\\'")}')"><i class="fas fa-copy"></i> Copy</button>
            ${isUrl ? `<button class="btn btn-primary btn-sm" onclick="document.getElementById('url-parse-input').value='${decoded.replace(/'/g,"\\'")}';document.querySelector('[data-tab=\\'url-parse\\']').click();URLAnalyzerModule.parseURL()"><i class="fas fa-cogs"></i> Analyze URL</button>` : ''}
            ${isUrl ? `<a class="btn btn-secondary btn-sm" href="${decoded}" target="_blank"><i class="fas fa-external-link-alt"></i> Open</a>` : ''}
          </div>
        </div>`;
      } else {
        res.innerHTML = `<div class="alert alert-danger"><i class="fas fa-times-circle"></i> No QR code detected. Try a clearer or higher-resolution image.</div>`;
      }
    };
    img.onerror = () => res.innerHTML = `<div class="alert alert-danger">Failed to load image</div>`;
    img.src = url;
  }
};
