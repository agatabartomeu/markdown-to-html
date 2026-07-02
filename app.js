document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const markdownInput = document.getElementById('markdownInput');
  const visualPreview = document.getElementById('visualPreview');
  const rawHtmlCode = document.getElementById('rawHtmlCode');
  
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const templateSelector = document.getElementById('templateSelector');
  const activeTemplateTag = document.getElementById('activeTemplateTag');
  
  const fileInput = document.getElementById('fileInput');
  const clearEditorBtn = document.getElementById('clearEditorBtn');
  
  const tabVisualBtn = document.getElementById('tabVisualBtn');
  const tabRawBtn = document.getElementById('tabRawBtn');
  const visualPreviewContainer = document.getElementById('visualPreview');
  const rawPreviewContainer = document.getElementById('rawPreview');
  
  const copyBtn = document.getElementById('copyBtn');
  const downloadDropdownBtn = document.getElementById('downloadDropdownBtn');
  const downloadDropdownMenu = document.getElementById('downloadDropdownMenu');
  const downloadCleanHtmlBtn = document.getElementById('downloadCleanHtmlBtn');
  const downloadStyledHtmlBtn = document.getElementById('downloadStyledHtmlBtn');
  
  const dragOverlay = document.getElementById('dragOverlay');
  
  const wordCountSpan = document.getElementById('wordCount');
  const charCountSpan = document.getElementById('charCount');
  const readTimeSpan = document.getElementById('readTime');
  
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');

  // App State
  let activeTab = 'visual'; // 'visual' or 'raw'
  let generatedHtml = '';

  // Configure Marked Options
  marked.setOptions({
    breaks: true,
    gfm: true,
    headerIds: true,
    mangle: false,
    highlight: function (code, lang) {
      if (Prism.languages[lang]) {
        return Prism.highlight(code, Prism.languages[lang], lang);
      }
      return code; // Return original if not supported
    }
  });

  // Init App
  function init() {
    // Check local storage for theme
    const savedTheme = localStorage.getItem('theme') || 'dark-theme';
    document.body.className = savedTheme;
    
    // Set default Markdown content from textarea if present, or initial render
    renderMarkdown();
    setupEventListeners();
  }

  // Setup Event Listeners
  function setupEventListeners() {
    // Input listener for live render
    markdownInput.addEventListener('input', () => {
      renderMarkdown();
      updateStats();
    });

    // Theme Toggle
    themeToggleBtn.addEventListener('click', toggleTheme);

    // Template Selector
    templateSelector.addEventListener('change', handleTemplateChange);

    // Clear Editor
    clearEditorBtn.addEventListener('click', () => {
      if (markdownInput.value.trim() !== '') {
        if (confirm('¿Estás seguro de que quieres borrar todo el contenido?')) {
          markdownInput.value = '';
          renderMarkdown();
          updateStats();
          showToast('Editor limpiado', 'info');
        }
      }
    });

    // File Upload handling
    fileInput.addEventListener('change', handleFileUpload);

    // Tab Switches
    tabVisualBtn.addEventListener('click', () => switchTab('visual'));
    tabRawBtn.addEventListener('click', () => switchTab('raw'));

    // Copy Content
    copyBtn.addEventListener('click', handleCopy);

    // Dropdown toggles
    downloadDropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      downloadDropdownMenu.classList.toggle('active');
    });

    document.addEventListener('click', () => {
      downloadDropdownMenu.classList.remove('active');
    });

    // Download handlers
    downloadCleanHtmlBtn.addEventListener('click', downloadCleanHtml);
    downloadStyledHtmlBtn.addEventListener('click', downloadStyledHtml);

    // Drag and Drop listeners
    window.addEventListener('dragenter', handleDragEnter);
    dragOverlay.addEventListener('dragover', handleDragOver);
    dragOverlay.addEventListener('dragleave', handleDragLeave);
    dragOverlay.addEventListener('drop', handleDrop);
  }

  // Render function
  function renderMarkdown() {
    const mdText = markdownInput.value;
    
    // Parse markdown using marked
    generatedHtml = marked.parse(mdText);
    
    // Set to visual preview
    visualPreview.innerHTML = generatedHtml;
    
    // Highlight syntax in visual preview
    if (typeof Prism !== 'undefined') {
      Prism.highlightAllUnder(visualPreview);
    }
    
    // Update raw HTML area (escaped text content)
    rawHtmlCode.textContent = generatedHtml;
    if (activeTab === 'raw' && typeof Prism !== 'undefined') {
      Prism.highlightElement(rawHtmlCode);
    }
  }

  // Update statistics
  function updateStats() {
    const text = markdownInput.value.trim();
    
    // Character count
    const chars = text.length;
    charCountSpan.textContent = chars;
    
    // Word count
    const words = text === '' ? 0 : text.split(/\s+/).filter(w => w.length > 0).length;
    wordCountSpan.textContent = words;
    
    // Estimated read time (200 words per minute average)
    const readTime = Math.ceil(words / 200);
    readTimeSpan.textContent = readTime;
  }

  // Theme Toggling
  function toggleTheme() {
    if (document.body.classList.contains('dark-theme')) {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
      localStorage.setItem('theme', 'light-theme');
      showToast('Modo claro activado', 'sun');
    } else {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark-theme');
      showToast('Modo oscuro activado', 'moon');
    }
    // Re-render because tables and syntax highlight adjust to theme variables
    renderMarkdown();
  }

  // Handle Template Changes
  function handleTemplateChange() {
    const selectedTemplate = templateSelector.value;
    
    // Remove existing template classes
    visualPreview.className = 'preview-content';
    visualPreview.classList.add(selectedTemplate);
    
    // Update footer tag text
    let templateName = 'Documentación';
    if (selectedTemplate === 'elegant-article') templateName = 'Artículo';
    if (selectedTemplate === 'minimalist') templateName = 'Minimalista';
    if (selectedTemplate === 'retro-terminal') templateName = 'Consola';
    
    activeTemplateTag.textContent = templateName;
    showToast(`Plantilla cambiada a: ${templateName}`, 'sparkles');
  }

  // Tab Switcher
  function switchTab(tab) {
    activeTab = tab;
    
    if (tab === 'visual') {
      tabVisualBtn.classList.add('active');
      tabRawBtn.classList.remove('active');
      visualPreviewContainer.style.display = 'block';
      rawPreviewContainer.style.display = 'none';
    } else {
      tabVisualBtn.classList.remove('active');
      tabRawBtn.classList.add('active');
      visualPreviewContainer.style.display = 'none';
      rawPreviewContainer.style.display = 'block';
      
      // Force highlighting on raw preview since it was hidden
      if (typeof Prism !== 'undefined') {
        Prism.highlightElement(rawHtmlCode);
      }
    }
  }

  // Handle Clipboard Copy
  function handleCopy() {
    let textToCopy = '';
    
    if (activeTab === 'raw') {
      textToCopy = generatedHtml;
    } else {
      // In visual tab, we can copy clean HTML
      textToCopy = generatedHtml;
    }
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast('Código HTML copiado al portapapeles', 'copy');
    }).catch(err => {
      console.error('Error al copiar: ', err);
      showToast('Error al copiar el contenido', 'error');
    });
  }

  // File Upload Logic
  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    readFile(file);
  }

  function readFile(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      markdownInput.value = e.target.result;
      renderMarkdown();
      updateStats();
      showToast(`Archivo importado: ${file.name}`, 'file');
    };
    
    reader.onerror = () => {
      showToast('Error al leer el archivo', 'error');
    };
    
    reader.readAsText(file);
  }

  // Drag and drop event handlers
  function handleDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
    dragOverlay.classList.add('active');
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    // Only remove if we leave the window or drag overlay
    if (e.target === dragOverlay) {
      dragOverlay.classList.remove('active');
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    dragOverlay.classList.remove('active');
    
    const dt = e.dataTransfer;
    const files = dt.files;
    
    if (files.length > 0) {
      const file = files[0];
      // Check file extension or content type
      if (file.name.endsWith('.md') || file.name.endsWith('.markdown') || file.name.endsWith('.txt') || file.type === 'text/plain') {
        readFile(file);
      } else {
        showToast('Formato de archivo no soportado. Usa .md o .txt', 'warning');
      }
    }
  }

  // File Downloader helpers
  function triggerDownload(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }

  function downloadCleanHtml() {
    if (!generatedHtml) {
      showToast('No hay contenido para exportar', 'warning');
      return;
    }
    triggerDownload(generatedHtml, 'documento-limpio.html', 'text/html');
    showToast('Descarga iniciada: HTML Limpio', 'download');
  }

  function downloadStyledHtml() {
    if (!generatedHtml) {
      showToast('No hay contenido para exportar', 'warning');
      return;
    }
    
    const template = templateSelector.value;
    const isDarkTheme = document.body.classList.contains('dark-theme');
    
    const fullHtml = getFullStyledTemplate(generatedHtml, template, isDarkTheme);
    triggerDownload(fullHtml, `documento-estilizado-${template}.html`, 'text/html');
    showToast('Descarga iniciada: HTML Estilizado', 'download');
  }

  // Toast System
  function showToast(message, type = 'info') {
    toastMessage.textContent = message;
    
    // Choose icon
    const icon = toast.querySelector('i');
    icon.className = 'fa-solid toast-icon';
    
    if (type === 'copy') icon.classList.add('fa-circle-check', 'success-icon');
    else if (type === 'download') icon.classList.add('fa-cloud-arrow-down');
    else if (type === 'file') icon.classList.add('fa-file-invoice');
    else if (type === 'sun') icon.classList.add('fa-sun');
    else if (type === 'moon') icon.classList.add('fa-moon');
    else if (type === 'sparkles') icon.classList.add('fa-wand-magic-sparkles');
    else if (type === 'warning') icon.classList.add('fa-triangle-exclamation');
    else if (type === 'error') icon.classList.add('fa-circle-xmark');
    else icon.classList.add('fa-circle-info');
    
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // Hardcoded Self-Contained Styles for Exported HTML
  function getFullStyledTemplate(bodyHtml, template, isDark) {
    const themeBg = isDark ? '#0b0f19' : '#f3f4f6';
    const surfaceBg = isDark ? '#111827' : '#ffffff';
    const textMain = isDark ? '#e5e7eb' : '#1f2937';
    const textMuted = isDark ? '#9ca3af' : '#6b7280';
    const primary = isDark ? '#6366f1' : '#4f46e5';
    const accent = isDark ? '#a855f7' : '#8b5cf6';
    const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
    const codeBg = isDark ? '#1e293b' : '#f1f5f9';

    // Different template custom styling
    let customCss = '';
    let bodyClass = '';

    if (template === 'modern-doc') {
      bodyClass = 'modern-doc-template';
      customCss = `
        body.modern-doc-template {
          font-family: 'Inter', -apple-system, sans-serif;
          max-width: 900px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        h1 { font-size: 2.2rem; border-bottom: 1px solid ${border}; padding-bottom: 10px; color: ${primary}; }
        h2 { font-size: 1.6rem; border-bottom: 1px solid ${border}; padding-bottom: 6px; margin-top: 30px; }
        h3 { font-size: 1.3rem; margin-top: 24px; }
        blockquote { border-left: 4px solid ${primary}; padding-left: 15px; color: ${textMuted}; font-style: italic; }
      `;
    } else if (template === 'elegant-article') {
      bodyClass = 'elegant-article-template';
      customCss = `
        body.elegant-article-template {
          font-family: 'Playfair Display', Georgia, serif;
          max-width: 750px;
          margin: 0 auto;
          padding: 60px 20px;
          line-height: 1.8;
        }
        h1, h2, h3 { font-family: 'Playfair Display', serif; text-align: center; font-weight: 600; }
        h1 { font-size: 2.8rem; margin-bottom: 40px; }
        h1::after { content: ''; display: block; width: 60px; height: 2px; background-color: ${accent}; margin: 20px auto 0; }
        h2 { font-size: 2rem; margin-top: 40px; }
        p { font-size: 1.15rem; text-align: justify; margin-bottom: 20px; }
        blockquote { border-left: 3px solid ${accent}; font-style: italic; font-size: 1.25rem; text-align: center; margin: 30px auto; max-width: 550px; padding: 0 10px; color: ${textMuted}; }
      `;
    } else if (template === 'minimalist') {
      bodyClass = 'minimalist-template';
      customCss = `
        body.minimalist-template {
          font-family: 'Outfit', sans-serif;
          max-width: 700px;
          margin: 0 auto;
          padding: 50px 20px;
        }
        h1 { font-size: 2.2rem; font-weight: 300; letter-spacing: -0.5px; margin-bottom: 30px; }
        h2 { font-size: 1.5rem; font-weight: 400; margin-top: 30px; }
        p { color: ${textMuted}; line-height: 1.7; }
        blockquote { border-left: 2px solid ${textMain}; padding-left: 15px; font-size: 0.95rem; }
      `;
    } else if (template === 'retro-terminal') {
      bodyClass = 'retro-terminal-template';
      customCss = `
        body.retro-terminal-template {
          font-family: 'Fira Code', Consolas, monospace;
          background-color: #05070a !important;
          color: #39ff14 !important;
          max-width: 850px;
          margin: 30px auto;
          padding: 30px;
          border: 1px solid #1a301a;
          border-radius: 8px;
          box-shadow: 0 0 20px rgba(57, 255, 20, 0.15);
        }
        h1, h2, h3 { color: #39ff14; border-bottom: 1px dashed #1a301a; padding-bottom: 6px; }
        h1::before { content: '> '; }
        h2::before { content: '>> '; }
        h3::before { content: '>>> '; }
        p, li { line-height: 1.6; }
        a { color: #00ffff; text-decoration: underline; }
        code { background-color: #11151c; color: #ff00ff; border: 1px solid #222c3c; }
        pre { background-color: #090c12; border: 1px solid #1a301a; }
        blockquote { border-left: 4px solid #39ff14; background-color: rgba(57, 255, 20, 0.05); padding-left: 15px; }
        table, th, td { border: 1px solid #1a301a; }
        th { background-color: #0d121a; }
      `;
    }

    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Documento Exportado</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code&family=Outfit:wght@300;400;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
  <style>
    /* Base document styles */
    body {
      background-color: ${themeBg};
      color: ${textMain};
      margin: 0;
      line-height: 1.6;
    }
    
    p, ul, ol, table, pre, blockquote {
      margin-bottom: 16px;
    }

    code {
      font-family: 'Fira Code', monospace;
      font-size: 85%;
      background-color: ${codeBg};
      padding: 0.2em 0.4em;
      border-radius: 4px;
    }

    pre {
      background-color: ${isDark ? '#0b0f19' : '#f8fafc'};
      border: 1px solid ${border};
      padding: 16px;
      overflow: auto;
      border-radius: 8px;
    }

    pre code {
      background-color: transparent;
      padding: 0;
      font-size: inherit;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 10px 12px;
      border: 1px solid ${border};
      text-align: left;
    }

    th {
      background-color: ${isDark ? '#1e293b' : '#e2e8f0'};
    }

    a {
      color: ${primary};
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    hr {
      border: 0;
      height: 1px;
      background: ${border};
      margin: 30px 0;
    }

    /* Template Specific Styles */
    ${customCss}
  </style>
</head>
<body class="${bodyClass}">
  ${bodyHtml}
</body>
</html>`;
  }

  // Start initialization
  init();
  updateStats();
});
