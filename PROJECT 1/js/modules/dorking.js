/* OSINT GENIUS — Google Dorking Module */
window.DorkingModule = {
  id: 'dorking', name: 'Google Dorking',
  _favorites: [],
  _currentCategory: null,

  OPERATORS: [
    { op:'site:', desc:'Restrict results to a specific site or domain' },
    { op:'intitle:', desc:'Search for pages with specific text in their title' },
    { op:'inurl:', desc:'Search for pages with specific text in their URL' },
    { op:'filetype:', desc:'Search for specific file types (pdf, doc, xls, etc.)' },
    { op:'intext:', desc:'Search for text within the page content' },
    { op:'cache:', desc:'View Google\'s cached version of a page' },
    { op:'related:', desc:'Find sites similar to a specific URL' },
    { op:'ext:', desc:'Alias for filetype:' },
    { op:'before:', desc:'Find pages indexed before a specific date' },
    { op:'after:', desc:'Find pages indexed after a specific date' },
  ],

  CATEGORIES: {
    'LOGIN_PAGES': { icon:'fa-sign-in-alt', color:'cyan', dorks:['intitle:"login"','intitle:"admin login"','inurl:wp-login.php','inurl:admin/login','inurl:/signin','intitle:"Login" inurl:admin','inurl:login.aspx','intitle:"Member Login"'] },
    'CONFIG_FILES': { icon:'fa-cog', color:'amber', dorks:['filetype:env','filetype:config','filetype:cfg','filetype:ini','intitle:"index of" .env','filetype:xml inurl:config','filetype:yml inurl:docker','filetype:conf apache'] },
    'EXPOSED_DB': { icon:'fa-database', color:'red', dorks:['filetype:sql','intitle:"index of" db.sql','filetype:mdb','inurl:phpmyadmin','intitle:phpMyAdmin','filetype:dbf','inurl:mysql/data','filetype:sql intext:password'] },
    'WEBCAMS': { icon:'fa-video', color:'green', dorks:['inurl:view.shtml','intitle:"Live View"','inurl:CgiStart?page=','intitle:"Network Camera"','inurl:/view/index.shtml','intitle:"webcamXP"','inurl:8080 intext:"camera"','intitle:"Axis 2100"'] },
    'SENSITIVE_DOCS': { icon:'fa-file-pdf', color:'red', dorks:['filetype:pdf confidential','filetype:xls intext:password','filetype:doc intext:"internal use"','filetype:ppt confidential','intitle:"index of" passwords.txt','filetype:xlsx intext:ssn','filetype:csv intext:credit','filetype:txt intext:"api_key"'] },
    'ADMIN_PANELS': { icon:'fa-tachometer-alt', color:'purple', dorks:['intitle:"admin panel"','inurl:admin/dashboard','inurl:controlpanel','intitle:"Dashboard" inurl:admin','inurl:wp-admin','inurl:administrator','inurl:phpmyadmin','intitle:"Webmin"'] },
    'API_KEYS': { icon:'fa-key', color:'amber', dorks:['intext:"api_key" filetype:js','intext:"secret_key" filetype:env','intext:"AWS_ACCESS_KEY"','intext:"PRIVATE_KEY" filetype:pem','intext:"Authorization: Bearer" filetype:log','intext:"api_secret" filetype:json','intext:"client_secret" filetype:py','github.com intext:"api_key"'] },
    'GIT_REPOS': { icon:'fa-git-alt', color:'cyan', dorks:['intitle:"index of" .git','inurl:.git/config','intitle:"GitLab"','inurl:repository','filetype:git','intext:"[core]" filetype:gitconfig','inurl:bitbucket intext:password','intitle:"Index of /.git"'] },
    'EMAIL_LISTS': { icon:'fa-envelope', color:'green', dorks:['filetype:xls email','filetype:csv email','intitle:"index of" email.txt','filetype:txt intext:"@gmail.com"','filetype:sql intext:email','intext:"mailto:" filetype:csv','filetype:xlsx intext:"email"','filetype:mbox'] },
    'VULNERABLE': { icon:'fa-bug', color:'red', dorks:['inurl:?id= intext:sql','inurl:php?page=','intitle:"error" intext:sql','inurl:index.php?cat=','intext:"Warning: mysql_"','inurl:?q= intext:"XSS"','inurl:search?q=','inurl:.php?file='] },
    'SOCIAL_MEDIA': { icon:'fa-share-alt', color:'cyan', dorks:['site:linkedin.com/in','site:twitter.com','site:instagram.com','site:facebook.com/groups','inurl:pinterest.com','site:reddit.com/r','inurl:tiktok.com/@','site:github.com'] },
    'CLOUD_STORAGE': { icon:'fa-cloud', color:'purple', dorks:['site:s3.amazonaws.com','site:blob.core.windows.net','site:storage.googleapis.com','inurl:s3.amazonaws.com filetype:pdf','site:dropbox.com/s/','site:drive.google.com','site:onedrive.live.com','site:box.com/shared'] },
  },

  render() {
    return `<div class="module-area animate-fadeInUp">
      <div class="module-header">
        <div class="module-icon-title">
          <div class="module-icon-wrap icon-purple"><i class="fas fa-search"></i></div>
          <div><div class="module-title">Google Dorking</div><div class="module-subtitle">12 categories · 96 dorks · Custom builder · Multi-engine launch</div></div>
        </div>
      </div>
      <div class="alert alert-warning mb-16">
        <i class="fas fa-gavel"></i>
        <div><strong>Legal Reminder:</strong> Use Google Dorking only on systems you own or have explicit permission to test. Unauthorized access is illegal.</div>
      </div>
      <div class="card mb-16">
        <div class="grid-2" style="gap:12px;">
          <div><label class="form-label">Target Domain (optional)</label><input class="form-input" id="dork-target" placeholder="example.com" /></div>
          <div><label class="form-label">Custom Query Builder</label>
            <div class="flex gap-4">
              <select class="form-select" id="dork-op-select" style="max-width:150px;">${this.OPERATORS.map(o=>`<option value="${o.op}">${o.op}</option>`).join('')}</select>
              <input class="form-input flex-1" id="dork-op-value" placeholder="value..." />
              <button class="btn btn-secondary btn-sm" id="dork-build-btn"><i class="fas fa-plus"></i></button>
            </div>
          </div>
        </div>
        <div class="mt-8">
          <label class="form-label">Built Query</label>
          <div class="flex gap-4">
            <input class="form-input flex-1" id="dork-built-query" placeholder="Your custom dork query..." />
            <button class="btn btn-primary btn-sm" id="dork-launch-custom"><i class="fas fa-rocket"></i> Launch</button>
            <button class="btn btn-secondary btn-sm" id="dork-clear-query"><i class="fas fa-times"></i></button>
          </div>
        </div>
      </div>

      <!-- Category Grid -->
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px;margin-bottom:16px;">
        ${Object.entries(this.CATEGORIES).map(([name, cat]) => `
          <button class="dork-category-btn" data-cat="${name}" style="border-color:var(--${cat.color});">
            <i class="fas ${cat.icon} text-${cat.color}"></i>
            <span>${name.replace(/_/g,' ')}</span>
          </button>`).join('')}
      </div>

      <!-- Dork Results -->
      <div id="dork-results">
        <div class="empty-state"><i class="fas fa-search"></i><p>Select a category to load dorks, or use the custom builder above.</p></div>
      </div>

      <!-- Operator Reference -->
      <div class="card mt-16">
        <div class="card-header"><div class="card-title"><i class="fas fa-book"></i> Operator Reference</div></div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px;">
          ${this.OPERATORS.map(o=>`<div class="card" style="padding:10px;">
            <div class="text-cyan mono" style="font-size:.82rem;font-weight:700;">${o.op}</div>
            <div class="text-secondary" style="font-size:.72rem;margin-top:4px;">${o.desc}</div>
          </div>`).join('')}
        </div>
      </div>
    </div>`;
  },

  renderDorks(catName) {
    const cat = this.CATEGORIES[catName];
    const target = document.getElementById('dork-target')?.value.trim() || '';
    const targetPrefix = target ? `site:${target} ` : '';
    return `<div class="card">
      <div class="card-header">
        <div class="card-title"><i class="fas ${cat.icon} text-${cat.color}"></i> ${catName.replace(/_/g,' ')} (${cat.dorks.length} dorks)</div>
      </div>
      ${cat.dorks.map(dork => {
        const query = targetPrefix + dork;
        const gUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        const bUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
        const dUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
        return `<div class="dork-result-item">
          <div class="dork-query">${Utils.escapeHtml(query)}</div>
          <div class="flex gap-4">
            <a class="btn btn-primary btn-sm" href="${gUrl}" target="_blank" title="Google"><i class="fab fa-google"></i></a>
            <a class="btn btn-secondary btn-sm" href="${bUrl}" target="_blank" title="Bing"><i class="fas fa-search"></i></a>
            <a class="btn btn-secondary btn-sm" href="${dUrl}" target="_blank" title="DuckDuckGo"><i class="fas fa-duck"></i></a>
            <button class="btn btn-secondary btn-sm" onclick="copyToClipboard('${dork.replace(/'/g,"\\'")}')"><i class="fas fa-copy"></i></button>
            <button class="btn btn-secondary btn-sm" onclick="document.getElementById('dork-built-query').value+=(' ${dork.replace(/'/g,"\\'")}')"><i class="fas fa-plus"></i></button>
          </div>
        </div>`;
      }).join('')}
    </div>`;
  },

  init() {
    document.querySelectorAll('.dork-category-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.dork-category-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this._currentCategory = btn.dataset.cat;
        document.getElementById('dork-results').innerHTML = this.renderDorks(btn.dataset.cat);
      });
    });

    document.getElementById('dork-build-btn').addEventListener('click', () => {
      const op = document.getElementById('dork-op-select').value;
      const val = document.getElementById('dork-op-value').value.trim();
      if (!val) return;
      const query = document.getElementById('dork-built-query');
      query.value += (query.value ? ' ' : '') + op + val;
      document.getElementById('dork-op-value').value = '';
    });

    document.getElementById('dork-launch-custom').addEventListener('click', () => {
      const query = document.getElementById('dork-built-query').value.trim();
      if (!query) { App.showToast('Build a query first', 'warning'); return; }
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
      App.addToHistory('dorking', query);
    });

    document.getElementById('dork-clear-query').addEventListener('click', () => {
      document.getElementById('dork-built-query').value = '';
    });

    document.getElementById('dork-target').addEventListener('change', () => {
      if (this._currentCategory) document.getElementById('dork-results').innerHTML = this.renderDorks(this._currentCategory);
    });
  }
};
