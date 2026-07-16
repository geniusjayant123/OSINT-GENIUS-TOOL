/* OSINT GENIUS — Hash & Crypto Tools Module */
window.CryptoModule = {
  id: 'crypto', name: 'Hash & Crypto Tools',

  render() {
    return `<div class="module-area animate-fadeInUp">
      <div class="module-header">
        <div class="module-icon-title">
          <div class="module-icon-wrap icon-amber"><i class="fas fa-hashtag"></i></div>
          <div><div class="module-title">Hash &amp; Crypto Tools</div><div class="module-subtitle">Generate, identify, encode/decode &amp; check password breaches</div></div>
        </div>
      </div>
      <div class="tab-bar">
        <button class="tab-btn active" data-tab="c-hash"><i class="fas fa-lock"></i> Hash Generator</button>
        <button class="tab-btn" data-tab="c-identify"><i class="fas fa-fingerprint"></i> Hash Identifier</button>
        <button class="tab-btn" data-tab="c-encode"><i class="fas fa-code"></i> Encoder/Decoder</button>
        <button class="tab-btn" data-tab="c-password"><i class="fas fa-key"></i> Password Checker</button>
      </div>
      <div>
        <!-- Hash Generator -->
        <div class="tab-panel active" data-panel="c-hash">
          <div class="card mb-12">
            <label class="form-label">Input Text</label>
            <textarea class="form-textarea" id="hash-input" placeholder="Type or paste text to hash..."></textarea>
            <div class="flex gap-8 mt-8" style="font-size:.75rem;color:var(--text-muted);">
              <span id="hash-char-count">0 chars</span>
              <span id="hash-word-count">0 words</span>
              <span id="hash-byte-count">0 bytes</span>
            </div>
          </div>
          <div id="hash-results">
            <div class="empty-state"><i class="fas fa-hashtag"></i><p>Start typing to generate hashes</p></div>
          </div>
        </div>

        <!-- Hash Identifier -->
        <div class="tab-panel" data-panel="c-identify">
          <div class="card mb-12">
            <label class="form-label">Paste a Hash String</label>
            <div class="input-group">
              <input class="form-input flex-1" id="hash-identify-input" placeholder="e.g. 5f4dcc3b5aa765d61d8327deb882cf99" />
              <button class="btn btn-primary" id="hash-identify-btn"><i class="fas fa-search"></i> Identify</button>
            </div>
          </div>
          <div id="hash-identify-results"></div>
        </div>

        <!-- Encoder/Decoder -->
        <div class="tab-panel" data-panel="c-encode">
          <div class="card mb-12">
            <label class="form-label">Input</label>
            <textarea class="form-textarea" id="encode-input" placeholder="Enter text to encode/decode..."></textarea>
            <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;">
              <button class="btn btn-secondary btn-sm" data-op="b64enc">Base64 Encode</button>
              <button class="btn btn-secondary btn-sm" data-op="b64dec">Base64 Decode</button>
              <button class="btn btn-secondary btn-sm" data-op="hexenc">Hex Encode</button>
              <button class="btn btn-secondary btn-sm" data-op="hexdec">Hex Decode</button>
              <button class="btn btn-secondary btn-sm" data-op="urlenc">URL Encode</button>
              <button class="btn btn-secondary btn-sm" data-op="urldec">URL Decode</button>
              <button class="btn btn-secondary btn-sm" data-op="rot13">ROT13</button>
              <button class="btn btn-secondary btn-sm" data-op="htmlenc">HTML Encode</button>
              <button class="btn btn-secondary btn-sm" data-op="htmldec">HTML Decode</button>
              <button class="btn btn-secondary btn-sm" data-op="binenc">Binary Encode</button>
              <button class="btn btn-secondary btn-sm" data-op="bindec">Binary Decode</button>
              <button class="btn btn-secondary btn-sm" data-op="rev">Reverse</button>
              <button class="btn btn-secondary btn-sm" data-op="upper">UPPERCASE</button>
              <button class="btn btn-secondary btn-sm" data-op="lower">lowercase</button>
            </div>
          </div>
          <div class="card">
            <div class="card-header"><div class="card-title"><i class="fas fa-arrow-right"></i> Output</div><button class="copy-btn" onclick="copyToClipboard(document.getElementById('encode-output').textContent)">Copy</button></div>
            <div class="encode-output" id="encode-output">Output will appear here...</div>
          </div>
        </div>

        <!-- Password Checker -->
        <div class="tab-panel" data-panel="c-password">
          <div class="card mb-12">
            <label class="form-label">Password</label>
            <div class="input-group">
              <input class="form-input flex-1" id="pwd-input" type="password" placeholder="Enter password to analyze..." />
              <button class="btn btn-secondary btn-sm" id="pwd-show-btn"><i class="fas fa-eye"></i></button>
            </div>
          </div>
          <div id="pwd-results"></div>
        </div>
      </div>
    </div>`;
  },

  init() {
    // Hash generator
    const hashInput = document.getElementById('hash-input');
    const updateHashes = Utils.debounce(async () => {
      const text = hashInput.value;
      const chars = text.length;
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const bytes = new TextEncoder().encode(text).length;
      document.getElementById('hash-char-count').textContent = `${chars} chars`;
      document.getElementById('hash-word-count').textContent = `${words} words`;
      document.getElementById('hash-byte-count').textContent = `${bytes} bytes`;
      if (!text) { document.getElementById('hash-results').innerHTML = `<div class="empty-state"><i class="fas fa-hashtag"></i><p>Start typing to generate hashes</p></div>`; return; }
      const [md5h, sha1h, sha256h, sha512h] = await Promise.all([
        Promise.resolve(Utils.md5(text)),
        Utils.sha1(text), Utils.sha256(text), Utils.sha512(text)
      ]);
      document.getElementById('hash-results').innerHTML = `<div class="flex-col gap-8">
        ${[['MD5',md5h,'amber'],['SHA-1',sha1h,'cyan'],['SHA-256',sha256h,'green'],['SHA-512',sha512h,'purple']].map(([alg,hash,col])=>`
        <div class="card" style="padding:14px;">
          <div class="flex justify-between items-center mb-6">
            <span class="badge badge-${col}">${alg}</span>
            <button class="copy-btn" onclick="copyToClipboard('${hash}')">Copy</button>
          </div>
          <div class="hash-result" style="margin:0;">${hash}</div>
        </div>`).join('')}
      </div>`;
    }, 300);
    hashInput.addEventListener('input', updateHashes);

    // Identifier
    document.getElementById('hash-identify-btn').addEventListener('click', () => this.identifyHash());
    document.getElementById('hash-identify-input').addEventListener('keydown', e => { if(e.key==='Enter') this.identifyHash(); });

    // Encoder
    document.querySelectorAll('[data-op]').forEach(btn => {
      btn.addEventListener('click', () => this.encode(btn.dataset.op));
    });

    // Password
    document.getElementById('pwd-input').addEventListener('input', () => this.checkPassword());
    document.getElementById('pwd-show-btn').addEventListener('click', () => {
      const el = document.getElementById('pwd-input');
      const isPass = el.type === 'password';
      el.type = isPass ? 'text' : 'password';
      document.getElementById('pwd-show-btn').innerHTML = `<i class="fas fa-eye${isPass?'-slash':''}"></i>`;
    });
  },

  identifyHash() {
    const h = document.getElementById('hash-identify-input').value.trim();
    if (!h) { App.showToast('Enter a hash string', 'warning'); return; }
    const res = document.getElementById('hash-identify-results');
    const isHex = /^[0-9a-fA-F]+$/.test(h);
    const isB64 = /^[A-Za-z0-9+/=]+$/.test(h);
    const types = [];
    if (isHex) {
      const l = h.length;
      if (l===32) types.push({name:'MD5',confidence:95,desc:'128-bit hash. Common for file integrity. NOT secure for passwords.',color:'amber'},{name:'NTLM',confidence:60,desc:'Windows password hash (NTLM v1). Same length as MD5.',color:'amber'});
      else if (l===40) types.push({name:'SHA-1',confidence:95,desc:'160-bit hash. Deprecated for security use.',color:'cyan'},{name:'RIPEMD-160',confidence:40,desc:'Less common 160-bit hash.',color:'muted'});
      else if (l===56) types.push({name:'SHA-224',confidence:95,desc:'224-bit truncated SHA-2.',color:'green'});
      else if (l===64) types.push({name:'SHA-256',confidence:90,desc:'256-bit SHA-2. Industry standard.',color:'green'},{name:'Keccak-256',confidence:30,desc:'Used in Ethereum.',color:'purple'});
      else if (l===96) types.push({name:'SHA-384',confidence:95,desc:'384-bit SHA-2.',color:'green'});
      else if (l===128) types.push({name:'SHA-512',confidence:95,desc:'512-bit SHA-2. Most secure SHA-2.',color:'green'});
      else types.push({name:'Unknown Hex',confidence:20,desc:`${l} hex chars = ${l*4} bits`,color:'muted'});
    }
    if (h.startsWith('$2a$')||h.startsWith('$2b$')) types.unshift({name:'bcrypt',confidence:99,desc:'Adaptive password hash. Includes salt+cost factor. Secure.',color:'green'});
    if (h.startsWith('$1$')) types.unshift({name:'MD5crypt',confidence:99,desc:'Legacy Unix password hash.',color:'amber'});
    if (h.startsWith('$5$')) types.unshift({name:'SHA-256crypt',confidence:99,desc:'Unix shadow password format.',color:'green'});
    if (h.startsWith('$6$')) types.unshift({name:'SHA-512crypt',confidence:99,desc:'Unix shadow password format.',color:'green'});
    if (!types.length) types.push({name:'Unknown',confidence:5,desc:'Could not identify hash type.',color:'muted'});
    res.innerHTML = `<div class="card animate-fadeInUp">
      <div class="card-header"><div class="card-title"><i class="fas fa-fingerprint"></i> Hash Analysis</div></div>
      <div class="data-row"><span class="data-label">Length</span><span class="data-value mono">${h.length} chars</span></div>
      <div class="data-row"><span class="data-label">Charset</span><span class="data-value">${isHex?'Hexadecimal':isB64?'Base64':'Mixed'}</span></div>
      <div class="mt-12">
        ${types.map(t=>`<div class="card mb-8" style="padding:12px;border-left:3px solid var(--${t.color});">
          <div class="flex justify-between items-center mb-4">
            <span class="badge badge-${t.color}">${t.name}</span>
            <span style="font-size:.72rem;color:var(--text-muted);">${t.confidence}% confidence</span>
          </div>
          <div class="risk-bar-track mb-4"><div class="risk-bar-fill" style="width:${t.confidence}%;background:var(--${t.color});"></div></div>
          <p style="font-size:.78rem;color:var(--text-secondary);">${t.desc}</p>
        </div>`).join('')}
      </div>
      <a class="btn btn-secondary btn-sm mt-8" href="https://www.google.com/search?q=${encodeURIComponent(h.substring(0,20))}+hash+cracking" target="_blank"><i class="fas fa-external-link-alt"></i> Search Hash Online</a>
    </div>`;
  },

  encode(op) {
    const input = document.getElementById('encode-input').value;
    const out = document.getElementById('encode-output');
    try {
      let result = '';
      switch(op) {
        case 'b64enc': result = btoa(unescape(encodeURIComponent(input))); break;
        case 'b64dec': result = decodeURIComponent(escape(atob(input))); break;
        case 'hexenc': result = [...new TextEncoder().encode(input)].map(b=>b.toString(16).padStart(2,'0')).join(''); break;
        case 'hexdec': result = decodeURIComponent(input.replace(/../g,'%$&')); break;
        case 'urlenc': result = encodeURIComponent(input); break;
        case 'urldec': result = decodeURIComponent(input); break;
        case 'rot13': result = input.replace(/[a-zA-Z]/g, c => String.fromCharCode(c.charCodeAt(0)+(c<='Z'?65:97)<=90+65?13:-13+c.charCodeAt(0)-(c<='Z'?65:97)<=12?13:-13)); result = input.replace(/[a-zA-Z]/g, c => { const base=c<='Z'?65:97; return String.fromCharCode(((c.charCodeAt(0)-base+13)%26)+base); }); break;
        case 'htmlenc': result = input.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); break;
        case 'htmldec': const tmp=document.createElement('textarea'); tmp.innerHTML=input; result=tmp.value; break;
        case 'binenc': result = [...new TextEncoder().encode(input)].map(b=>b.toString(2).padStart(8,'0')).join(' '); break;
        case 'bindec': result = input.trim().split(/\s+/).map(b=>String.fromCharCode(parseInt(b,2))).join(''); break;
        case 'rev': result = [...input].reverse().join(''); break;
        case 'upper': result = input.toUpperCase(); break;
        case 'lower': result = input.toLowerCase(); break;
      }
      out.textContent = result;
      out.style.color = 'var(--text-code)';
    } catch(e) {
      out.textContent = '⚠ Error: ' + e.message;
      out.style.color = 'var(--red)';
    }
  },

  async checkPassword() {
    const pwd = document.getElementById('pwd-input').value;
    const res = document.getElementById('pwd-results');
    if (!pwd) { res.innerHTML = ''; return; }
    const checks = [
      { label:'Minimum 8 characters', pass: pwd.length >= 8 },
      { label:'12+ characters (recommended)', pass: pwd.length >= 12 },
      { label:'Uppercase letter (A-Z)', pass: /[A-Z]/.test(pwd) },
      { label:'Lowercase letter (a-z)', pass: /[a-z]/.test(pwd) },
      { label:'Number (0-9)', pass: /\d/.test(pwd) },
      { label:'Special character (!@#$...)', pass: /[^a-zA-Z0-9]/.test(pwd) },
    ];
    const score = checks.filter(c=>c.pass).length;
    const strengthLabel = ['Very Weak','Weak','Fair','Good','Strong','Very Strong'][score];
    const strengthColor = ['red','red','amber','amber','green','green'][score];
    const charsetSize = (/[a-z]/.test(pwd)?26:0)+(/[A-Z]/.test(pwd)?26:0)+(/\d/.test(pwd)?10:0)+(/[^a-zA-Z0-9]/.test(pwd)?32:0);
    const entropy = (charsetSize > 0 && pwd.length > 0) ? Math.round(Math.log2(Math.pow(charsetSize, pwd.length))) : 0;
    const crackTime = entropy >= 80 ? 'Centuries' : entropy >= 60 ? 'Years' : entropy >= 40 ? 'Months' : entropy >= 30 ? 'Days' : entropy >= 20 ? 'Hours' : 'Minutes';

    res.innerHTML = `<div class="card animate-fadeInUp">
      <div class="card-header"><div class="card-title"><i class="fas fa-shield-alt"></i> Password Analysis</div></div>
      <div class="flex items-center gap-12 mb-16">
        <div style="flex:1;">
          <div class="flex justify-between mb-4" style="font-size:.78rem;">
            <span style="color:var(--${strengthColor});font-weight:700;">${strengthLabel}</span>
            <span class="text-muted">${score}/6 criteria met</span>
          </div>
          <div class="risk-bar-track"><div class="risk-bar-fill" style="width:${score*16.7}%;background:var(--${strengthColor});"></div></div>
        </div>
      </div>
      <div class="grid-3 mb-16">
        <div class="stat-card"><div class="stat-label">Length</div><div class="stat-value text-cyan">${pwd.length}</div></div>
        <div class="stat-card"><div class="stat-label">Entropy</div><div class="stat-value text-${strengthColor}">${entropy} bits</div></div>
        <div class="stat-card"><div class="stat-label">Crack Time Est.</div><div class="stat-value" style="font-size:.85rem;">${crackTime}</div></div>
      </div>
      <div class="flex-col gap-4 mb-16">
        ${checks.map(c=>`<div class="flex items-center gap-8" style="font-size:.82rem;">
          <i class="fas fa-${c.pass?'check-circle text-green':'times-circle text-red'}" style="width:16px;"></i>
          <span style="color:${c.pass?'var(--text-primary)':'var(--text-secondary)'};">${c.label}</span>
        </div>`).join('')}
      </div>
      <button class="btn btn-primary w-full" id="breach-pwd-check-btn"><i class="fas fa-skull-crossbones"></i> Check if Breached (HIBP)</button>
      <div id="pwd-breach-result" class="mt-12"></div>
    </div>`;

    document.getElementById('breach-pwd-check-btn')?.addEventListener('click', async () => {
      const bRes = document.getElementById('pwd-breach-result');
      bRes.innerHTML = `<div class="loader"><div class="spinner"></div><span>Checking breach database...</span></div>`;
      try {
        const hash = await Utils.sha1(pwd);
        const prefix = hash.substring(0,5).toUpperCase();
        const suffix = hash.substring(5).toUpperCase();
        const data = await API.getText(`https://api.pwnedpasswords.com/range/${prefix}`);
        const match = data.split('\n').find(l=>l.split(':')[0]===suffix);
        const count = match ? parseInt(match.split(':')[1]) : 0;
        bRes.innerHTML = count > 0
          ? `<div class="alert alert-danger"><i class="fas fa-skull-crossbones"></i> This password appeared in <strong>${count.toLocaleString()}</strong> known breaches! CHANGE IT NOW.</div>`
          : `<div class="alert alert-success"><i class="fas fa-check-circle"></i> Not found in known breach databases.</div>`;
      } catch(e) {
        bRes.innerHTML = `<div class="alert alert-warning"><i class="fas fa-exclamation-triangle"></i> CORS blocked. Check at <a href="https://haveibeenpwned.com/Passwords" target="_blank" class="text-cyan">haveibeenpwned.com</a></div>`;
      }
    });
  }
};
