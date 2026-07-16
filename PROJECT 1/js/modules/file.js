/* OSINT GENIUS — File Intelligence Module */
window.FileModule = {
  id: 'file', name: 'File Intelligence',

  MAGIC: [
    { sig:[0xFF,0xD8,0xFF], name:'JPEG Image', ext:'.jpg', icon:'fa-file-image', color:'green' },
    { sig:[0x89,0x50,0x4E,0x47], name:'PNG Image', ext:'.png', icon:'fa-file-image', color:'green' },
    { sig:[0x47,0x49,0x46], name:'GIF Image', ext:'.gif', icon:'fa-file-image', color:'green' },
    { sig:[0x25,0x50,0x44,0x46], name:'PDF Document', ext:'.pdf', icon:'fa-file-pdf', color:'red' },
    { sig:[0x50,0x4B,0x03,0x04], name:'ZIP Archive / Office Document', ext:'.zip', icon:'fa-file-archive', color:'amber' },
    { sig:[0x4D,0x5A], name:'Windows Executable (EXE/DLL)', ext:'.exe', icon:'fa-cog', color:'red' },
    { sig:[0x7F,0x45,0x4C,0x46], name:'ELF Executable (Linux)', ext:'', icon:'fa-terminal', color:'purple' },
    { sig:[0x52,0x61,0x72,0x21], name:'RAR Archive', ext:'.rar', icon:'fa-file-archive', color:'amber' },
    { sig:[0x37,0x7A,0xBC,0xAF], name:'7-Zip Archive', ext:'.7z', icon:'fa-file-archive', color:'amber' },
    { sig:[0x1F,0x8B], name:'GZIP Compressed', ext:'.gz', icon:'fa-file-archive', color:'amber' },
    { sig:[0x42,0x5A,0x68], name:'BZIP2 Compressed', ext:'.bz2', icon:'fa-file-archive', color:'amber' },
    { sig:[0x49,0x44,0x33], name:'MP3 Audio', ext:'.mp3', icon:'fa-file-audio', color:'cyan' },
    { sig:[0x4F,0x67,0x67,0x53], name:'OGG Audio/Video', ext:'.ogg', icon:'fa-file-audio', color:'cyan' },
    { sig:[0xD0,0xCF,0x11,0xE0], name:'Microsoft Office Document (Legacy)', ext:'.doc', icon:'fa-file-word', color:'cyan' },
    { sig:[0x66,0x74,0x79,0x70], name:'MP4/MOV Video', ext:'.mp4', icon:'fa-file-video', color:'purple' },
  ],

  render() {
    return `<div class="module-area animate-fadeInUp">
      <div class="module-header">
        <div class="module-icon-title">
          <div class="module-icon-wrap icon-green"><i class="fas fa-file-alt"></i></div>
          <div><div class="module-title">File Intelligence</div><div class="module-subtitle">Metadata, hashes, hex dump, magic bytes & string extractor</div></div>
        </div>
      </div>
      <div id="file-drop-area">
        <div class="drop-zone" id="file-drop">
          <i class="fas fa-cloud-upload-alt"></i>
          <p><strong>Drop any file here</strong> or click to select</p>
          <p style="font-size:.75rem;color:var(--text-muted);margin-top:6px;">Supports all file types &mdash; analyzed locally, never uploaded</p>
          <input type="file" id="file-input" style="display:none;" />
        </div>
      </div>
      <div id="file-results" class="hidden"></div>
    </div>`;
  },

  init() {
    const drop = document.getElementById('file-drop');
    const input = document.getElementById('file-input');
    drop.addEventListener('click', () => input.click());
    drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('drag-over'); });
    drop.addEventListener('dragleave', () => drop.classList.remove('drag-over'));
    drop.addEventListener('drop', e => { e.preventDefault(); drop.classList.remove('drag-over'); const f=e.dataTransfer.files[0]; if(f) this.analyze(f); });
    input.addEventListener('change', e => { const f=e.target.files[0]; if(f) this.analyze(f); });
  },

  async analyze(file) {
    const res = document.getElementById('file-results');
    res.classList.remove('hidden');
    res.innerHTML = `<div class="loader"><div class="spinner spinner-lg"></div><span>Analyzing file...</span></div>`;
    App.addToHistory('file', file.name);

    const buf = await file.arrayBuffer();
    const bytes = new Uint8Array(buf);

    // Magic bytes detection
    let magic = { name: 'Unknown / Binary', icon: 'fa-file', color: 'muted' };
    for (const m of this.MAGIC) {
      if (m.sig.every((b, i) => bytes[i] === b)) { magic = m; break; }
    }

    // Hashes
    const [sha256, sha1] = await Promise.all([
      crypto.subtle.digest('SHA-256', buf).then(h => Array.from(new Uint8Array(h)).map(b=>b.toString(16).padStart(2,'0')).join('')),
      crypto.subtle.digest('SHA-1', buf).then(h => Array.from(new Uint8Array(h)).map(b=>b.toString(16).padStart(2,'0')).join(''))
    ]);

    // Hex dump (first 256 bytes)
    const hexDump = this.buildHexDump(bytes.slice(0, 256));

    // String extractor
    const strings = this.extractStrings(bytes);

    // Text preview
    let textPreview = '';
    if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.csv') || file.name.endsWith('.json')) {
      try { textPreview = new TextDecoder().decode(bytes.slice(0, 2000)); } catch {}
    }

    const fileTypeIcon = { 'image':'fa-file-image', 'video':'fa-file-video', 'audio':'fa-file-audio', 'text':'fa-file-alt', 'application/pdf':'fa-file-pdf' };
    const ftIcon = Object.entries(fileTypeIcon).find(([k])=>file.type.startsWith(k))?.[1] || 'fa-file';

    res.innerHTML = `
      <div class="flex justify-between items-center mb-16">
        <div class="flex items-center gap-12">
          <div class="module-icon-wrap icon-${magic.color}" style="width:50px;height:50px;font-size:1.3rem;"><i class="fas ${magic.icon}"></i></div>
          <div>
            <div style="font-weight:700;font-size:1rem;">${Utils.escapeHtml(file.name)}</div>
            <div class="text-secondary" style="font-size:.8rem;">${magic.name}</div>
          </div>
        </div>
        <div class="flex gap-8">
          <button class="btn btn-secondary btn-sm" onclick="FileModule.exportMetadata(${JSON.stringify({name:file.name,size:file.size,type:file.type,sha256,sha1}).replace(/'/g,"\\'")},'${file.name}')"><i class="fas fa-download"></i> Export JSON</button>
          <button class="btn btn-secondary btn-sm" onclick="document.getElementById('file-results').classList.add('hidden');document.getElementById('file-drop-area').querySelector('.drop-zone').style.display='flex';"><i class="fas fa-times"></i> Clear</button>
        </div>
      </div>

      <div class="grid-2 mb-16">
        <div class="card">
          <div class="card-header"><div class="card-title"><i class="fas fa-info-circle"></i> File Metadata</div></div>
          <div class="data-row"><span class="data-label">Filename</span><span class="data-value">${Utils.escapeHtml(file.name)}</span></div>
          <div class="data-row"><span class="data-label">Size</span><span class="data-value text-cyan">${Utils.formatBytes(file.size)}</span></div>
          <div class="data-row"><span class="data-label">MIME Type</span><span class="data-value mono">${file.type || 'Unknown'}</span></div>
          <div class="data-row"><span class="data-label">Extension</span><span class="data-value">${file.name.includes('.')?'.'+file.name.split('.').pop():'None'}</span></div>
          <div class="data-row"><span class="data-label">Last Modified</span><span class="data-value">${Utils.formatDate(new Date(file.lastModified).toISOString())}</span></div>
          <div class="data-row"><span class="data-label">Magic Bytes</span><span class="data-value"><span class="badge badge-${magic.color}">${magic.name}</span></span></div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title"><i class="fas fa-hashtag"></i> Cryptographic Hashes</div></div>
          <div class="data-row"><span class="data-label">SHA-256</span><span class="data-value mono" style="font-size:.7rem;word-break:break-all;">${sha256}<button class="copy-btn ms-1" onclick="copyToClipboard('${sha256}')">copy</button></span></div>
          <div class="data-row"><span class="data-label">SHA-1</span><span class="data-value mono" style="font-size:.7rem;word-break:break-all;">${sha1}<button class="copy-btn ms-1" onclick="copyToClipboard('${sha1}')">copy</button></span></div>
          <div class="mt-12 flex gap-8">
            <a class="btn btn-secondary btn-sm" href="https://www.virustotal.com/gui/file/${sha256}" target="_blank"><i class="fas fa-shield-virus"></i> VirusTotal</a>
            <a class="btn btn-secondary btn-sm" href="https://www.hybrid-analysis.com/search?query=${sha256}" target="_blank"><i class="fas fa-microscope"></i> Hybrid Analysis</a>
          </div>
        </div>
      </div>

      <div class="tab-bar mb-16">
        <button class="tab-btn active" data-tab="f-hex"><i class="fas fa-code"></i> Hex Dump</button>
        <button class="tab-btn" data-tab="f-strings"><i class="fas fa-font"></i> Strings (${strings.length})</button>
        ${textPreview ? `<button class="tab-btn" data-tab="f-text"><i class="fas fa-file-alt"></i> Text Preview</button>` : ''}
      </div>
      <div>
        <div class="tab-panel active" data-panel="f-hex">
          <div class="card" style="padding:0;overflow:hidden;">
            <div class="card-header" style="padding:12px 16px;"><div class="card-title"><i class="fas fa-memory"></i> Hex Dump (first 256 bytes)</div></div>
            <div class="file-hex-view">${hexDump}</div>
          </div>
        </div>
        <div class="tab-panel" data-panel="f-strings">
          <div class="card">
            <div class="card-header"><div class="card-title"><i class="fas fa-font"></i> Extracted Strings (${strings.length} found)</div></div>
            <div class="terminal-output" style="max-height:400px;overflow-y:auto;">${strings.map(s=>`<div class="t-green">${Utils.escapeHtml(s)}</div>`).join('')||'<span class="t-gray">No printable strings found (min length 4)</span>'}</div>
          </div>
        </div>
        ${textPreview ? `<div class="tab-panel" data-panel="f-text">
          <div class="card"><div class="card-header"><div class="card-title"><i class="fas fa-file-alt"></i> Text Preview (first 2000 chars)</div></div>
          <div class="terminal-output" style="max-height:500px;overflow-y:auto;white-space:pre-wrap;">${Utils.escapeHtml(textPreview)}</div></div>
        </div>` : ''}
      </div>`;

    App.bindTabs(res);
  },

  buildHexDump(bytes) {
    let html = '';
    for (let i = 0; i < bytes.length; i += 16) {
      const row = bytes.slice(i, i+16);
      const offset = i.toString(16).padStart(8, '0');
      const hex = Array.from(row).map(b=>b.toString(16).padStart(2,'0')).join(' ').padEnd(47,' ');
      const ascii = Array.from(row).map(b => (b >= 32 && b < 127) ? String.fromCharCode(b) : '.').join('');
      html += `<div class="hex-row"><span class="hex-offset">${offset}</span><span class="hex-bytes">${Utils.escapeHtml(hex)}</span><span class="hex-ascii">${Utils.escapeHtml(ascii)}</span></div>`;
    }
    return html;
  },

  extractStrings(bytes) {
    const strings = [];
    let current = '';
    for (const b of bytes) {
      if (b >= 32 && b < 127) current += String.fromCharCode(b);
      else { if (current.length >= 4) strings.push(current); current = ''; }
    }
    if (current.length >= 4) strings.push(current);
    return strings.slice(0, 50);
  },

  exportMetadata(meta, filename) {
    Storage.downloadJSON(meta, `${filename}-metadata.json`);
    App.showToast('Metadata exported!', 'success');
  }
};
