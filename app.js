/**
 * ConvertFlow v2.0 - Redesigned with Real Content Extraction
 */

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

const app = (function() {
    'use strict';

    const state = {
        currentFile: null,
        currentFileData: null,
        mergeFiles: [],
        activeTab: 'convert'
    };

    const elements = {
        tabConvert: document.getElementById('tab-convert'),
        tabMerge: document.getElementById('tab-merge'),
        tabCompress: document.getElementById('tab-compress'),
        panelConvert: document.getElementById('panel-convert'),
        panelMerge: document.getElementById('panel-merge'),
        panelCompress: document.getElementById('panel-compress'),
        
        fileInput: document.getElementById('fileInput'),
        mergeInput: document.getElementById('mergeInput'),
        compressInput: document.getElementById('compressInput'),
        
        dropZone: document.getElementById('dropZone'),
        mergeDropZone: document.getElementById('mergeDropZone'),
        compressDropZone: document.getElementById('compressDropZone'),
        
        filePreview: document.getElementById('filePreview'),
        fileName: document.getElementById('fileName'),
        fileSize: document.getElementById('fileSize'),
        contentPreview: document.getElementById('contentPreview'),
        
        progressContainer: document.getElementById('progressContainer'),
        progressBar: document.getElementById('progressBar'),
        progressPercent: document.getElementById('progressPercent'),
        progressText: document.getElementById('progressText'),
        
        convertBtn: document.getElementById('convertBtn'),
        mergeBtn: document.getElementById('mergeBtn'),
        compressBtn: document.getElementById('compressBtn'),
        
        mergeList: document.getElementById('mergeList'),
        
        inputFormat: document.getElementById('inputFormat'),
        outputFormat: document.getElementById('outputFormat'),
        compressLevel: document.getElementById('compressLevel'),
        
        toastContainer: document.getElementById('toastContainer')
    };

    function init() {
        setupEventListeners();
        setupDropZones();
        setupFeatureCards();
        updateOutputFormats();
        updateAcceptedTypes();
        lucide.createIcons();
    }

    function setupFeatureCards() {
        // Mouse tracking for feature card glow effect
        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }

    function setupEventListeners() {
        elements.tabConvert.addEventListener('click', () => switchTab('convert'));
        elements.tabMerge.addEventListener('click', () => switchTab('merge'));
        elements.tabCompress.addEventListener('click', () => switchTab('compress'));

        elements.fileInput.addEventListener('change', (e) => handleFileSelect(e, 'convert'));
        elements.mergeInput.addEventListener('change', (e) => handleFileSelect(e, 'merge'));
        elements.compressInput.addEventListener('change', (e) => handleFileSelect(e, 'compress'));

        elements.inputFormat.addEventListener('change', () => {
            updateOutputFormats();
            updateAcceptedTypes();
        });
    }

    function setupDropZones() {
        const zones = [
            { zone: elements.dropZone, input: elements.fileInput, type: 'convert' },
            { zone: elements.mergeDropZone, input: elements.mergeInput, type: 'merge' },
            { zone: elements.compressDropZone, input: elements.compressInput, type: 'compress' }
        ];

        zones.forEach(({ zone, input, type }) => {
            zone.addEventListener('click', () => input.click());

            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('dragover');
            });

            zone.addEventListener('dragleave', () => {
                zone.classList.remove('dragover');
            });

            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('dragover');
                const files = e.dataTransfer.files;
                if (files.length) {
                    input.files = files;
                    handleFileSelect({ target: input }, type);
                }
            });
        });
    }

    async function handleFileSelect(e, type) {
        const files = Array.from(e.target.files);

        switch(type) {
            case 'convert':
                if (files.length > 0) await loadFile(files[0]);
                break;
            case 'merge':
                state.mergeFiles = [...state.mergeFiles, ...files.filter(f => f.name.endsWith('.pdf'))];
                updateMergeList();
                break;
            case 'compress':
                if (files.length > 0) {
                    state.currentFile = files[0];
                    enableButton(elements.compressBtn);
                    showToast('PDF loaded for optimization', 'success');
                }
                break;
        }
    }

    async function loadFile(file) {
        try {
            showProgress('Reading file...');
            
            state.currentFile = file;
            elements.fileName.textContent = file.name;
            elements.fileSize.textContent = formatFileSize(file.size);
            
            const format = detectFormat(file.name);
            const arrayBuffer = await file.arrayBuffer();
            
            state.currentFileData = await parseContent(arrayBuffer, format);
            
            showFilePreview();
            updateConvertButton();
            
            hideProgress();
            showToast('File loaded & parsed', 'success');
            
        } catch (error) {
            console.error('Load error:', error);
            hideProgress();
            showToast('Error: ' + error.message, 'error');
        }
    }

    async function parseContent(arrayBuffer, format) {
        switch(format) {
            case 'pdf':
                return await parsePDF(arrayBuffer);
            case 'docx':
                return await parseDOCX(arrayBuffer);
            case 'xlsx':
                return await parseXLSX(arrayBuffer);
            case 'csv':
                return await parseCSV(arrayBuffer);
            case 'txt':
            case 'html':
                return new TextDecoder().decode(arrayBuffer);
            case 'json':
                return JSON.parse(new TextDecoder().decode(arrayBuffer));
            default:
                return new TextDecoder().decode(arrayBuffer);
        }
    }

    async function parsePDF(arrayBuffer) {
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
            updateProgress(Math.round((i / pdf.numPages) * 50));
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n\n';
        }
        
        return { text: fullText.trim(), pageCount: pdf.numPages, type: 'pdf' };
    }

    async function parseDOCX(arrayBuffer) {
        const zip = await JSZip.loadAsync(arrayBuffer);
        const xmlContent = await zip.file('word/document.xml').async('text');
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlContent, 'application/xml');
        const textNodes = xmlDoc.getElementsByTagName('w:t');
        let fullText = '';
        for (let node of textNodes) fullText += node.textContent;
        return { text: fullText, xml: xmlContent, type: 'docx' };
    }

    async function parseXLSX(arrayBuffer) {
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        return { data: jsonData, sheetName: firstSheetName, workbook: workbook, type: 'xlsx' };
    }

    async function parseCSV(arrayBuffer) {
        const text = new TextDecoder().decode(arrayBuffer);
        const lines = text.split('\n').filter(line => line.trim());
        const data = lines.map(line => {
            const result = [];
            let current = '';
            let inQuotes = false;
            for (let char of line) {
                if (char === '"') inQuotes = !inQuotes;
                else if (char === ',' && !inQuotes) {
                    result.push(current.trim());
                    current = '';
                } else current += char;
            }
            result.push(current.trim());
            return result;
        });
        return { data: data, text: text, type: 'csv' };
    }

    function showFilePreview() {
        elements.filePreview.classList.remove('hidden');
        
        let preview = '';
        const data = state.currentFileData;
        
        if (typeof data === 'string') preview = data.substring(0, 400);
        else if (data.text) preview = data.text.substring(0, 400);
        else if (data.data) {
            preview = data.data.slice(0, 4).map(row => row.join(' | ')).join('\n');
            if (data.data.length > 4) preview += '\n...';
        } else preview = JSON.stringify(data, null, 2).substring(0, 400);
        
        elements.contentPreview.textContent = preview + (preview.length >= 400 ? '...' : '');
    }

    function clearFile() {
        state.currentFile = null;
        state.currentFileData = null;
        elements.fileInput.value = '';
        elements.filePreview.classList.add('hidden');
        updateConvertButton();
    }

    function updateConvertButton() {
        const btn = elements.convertBtn;
        const inputFormat = detectFormat(state.currentFile?.name || '');
        const outputFormat = elements.outputFormat.value;
        
        if (state.currentFile && state.currentFileData) {
            btn.disabled = false;
            btn.classList.remove('disabled');
            btn.innerHTML = `<span>Convert to ${outputFormat.toUpperCase()}</span><i data-lucide="arrow-right" class="w-5 h-5"></i>`;
        } else {
            btn.disabled = true;
            btn.classList.add('disabled');
            btn.innerHTML = `<span>Select a file to convert</span><i data-lucide="arrow-right" class="w-5 h-5"></i>`;
        }
        lucide.createIcons();
    }

    async function convertFile() {
        if (!state.currentFile || !state.currentFileData) return;

        const inputFormat = detectFormat(state.currentFile.name);
        const outputFormat = elements.outputFormat.value;

        try {
            showProgress(`Converting to ${outputFormat.toUpperCase()}...`);
            
            let result;
            const converterKey = `${inputFormat}-${outputFormat}`;
            
            switch(converterKey) {
                case 'pdf-txt': result = await convertPDFToText(); break;
                case 'pdf-docx': result = await convertPDFToDOCX(); break;
                case 'docx-txt': result = await convertDOCXToText(); break;
                case 'docx-pdf': result = await convertDOCXToPDF(); break;
                case 'xlsx-csv': result = await convertXLSXToCSV(); break;
                case 'csv-xlsx': result = await convertCSVToXLSX(); break;
                case 'xlsx-json': result = await convertXLSXToJSON(); break;
                case 'csv-json': result = await convertCSVToJSON(); break;
                case 'json-csv': result = await convertJSONToCSV(); break;
                case 'txt-pdf': result = await convertTextToPDF(); break;
                case 'html-txt': result = await convertHTMLToText(); break;
                case 'json-txt': result = await convertJSONToText(); break;
                default: result = await genericTextConversion();
            }
            
            const blob = new Blob([result.content], { type: result.mimeType });
            const filename = state.currentFile.name.replace(/\.[^/.]+$/, '') + '.' + outputFormat;
            saveAs(blob, filename);
            
            hideProgress();
            showToast(`Converted to ${outputFormat.toUpperCase()}`, 'success');
            
        } catch (error) {
            console.error('Conversion error:', error);
            hideProgress();
            showToast('Conversion failed: ' + error.message, 'error');
        }
    }

    // Conversion implementations (same as previous version, abbreviated for space)
    async function convertPDFToText() {
        return { content: state.currentFileData.text, mimeType: 'text/plain' };
    }

    async function convertPDFToDOCX() {
        return await createDOCXFromText(state.currentFileData.text);
    }

    async function convertDOCXToText() {
        return { content: state.currentFileData.text, mimeType: 'text/plain' };
    }

    async function convertDOCXToPDF() {
        const text = state.currentFileData.text;
        const pdfDoc = await PDFLib.PDFDocument.create();
        const pages = Math.ceil(text.length / 3000);
        
        for (let i = 0; i < pages; i++) {
            const page = pdfDoc.addPage();
            const pageText = text.substring(i * 3000, (i + 1) * 3000);
            const lines = [];
            const words = pageText.split(' ');
            let currentLine = '';
            
            for (let word of words) {
                if ((currentLine + word).length > 100) {
                    lines.push(currentLine);
                    currentLine = word + ' ';
                } else currentLine += word + ' ';
            }
            lines.push(currentLine);
            
            let y = page.getHeight() - 50;
            for (let line of lines) {
                if (y < 50) break;
                page.drawText(line.trim(), {
                    x: 50, y: y, size: 12,
                    font: await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica)
                });
                y -= 15;
            }
        }
        
        return { content: await pdfDoc.save(), mimeType: 'application/pdf' };
    }

    async function convertXLSXToCSV() {
        const ws = state.currentFileData.workbook.Sheets[state.currentFileData.sheetName];
        return { content: XLSX.utils.sheet_to_csv(ws), mimeType: 'text/csv' };
    }

    async function convertCSVToXLSX() {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(state.currentFileData.data);
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        return { content: XLSX.write(wb, { bookType: 'xlsx', type: 'array' }), mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };
    }

    async function convertXLSXToJSON() {
        const ws = state.currentFileData.workbook.Sheets[state.currentFileData.sheetName];
        const json = XLSX.utils.sheet_to_json(ws);
        return { content: JSON.stringify(json, null, 2), mimeType: 'application/json' };
    }

    async function convertCSVToJSON() {
        const data = state.currentFileData.data;
        if (data.length < 2) throw new Error('CSV needs header + data row');
        const headers = data[0];
        const json = data.slice(1).map(row => {
            const obj = {};
            headers.forEach((h, i) => obj[h] = row[i] || '');
            return obj;
        });
        return { content: JSON.stringify(json, null, 2), mimeType: 'application/json' };
    }

    async function convertJSONToCSV() {
        let data = state.currentFileData;
        if (!Array.isArray(data)) data = [data];
        const headers = Object.keys(data[0]);
        const rows = data.map(obj => headers.map(h => {
            const val = obj[h];
            return (typeof val === 'string' && (val.includes(',') || val.includes('"'))) ? `"${val.replace(/"/g, '""')}"` : val;
        }));
        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        return { content: csv, mimeType: 'text/csv' };
    }

    async function convertTextToPDF() {
        const text = typeof state.currentFileData === 'string' ? state.currentFileData : state.currentFileData.text;
        const pdfDoc = await PDFLib.PDFDocument.create();
        const lines = text.split('\n');
        let page = pdfDoc.addPage();
        let y = page.getHeight() - 50;
        
        for (let line of lines) {
            if (y < 50) {
                page = pdfDoc.addPage();
                y = page.getHeight() - 50;
            }
            page.drawText(line.substring(0, 200), { x: 50, y: y, size: 12, maxWidth: page.getWidth() - 100 });
            y -= 20;
        }
        return { content: await pdfDoc.save(), mimeType: 'application/pdf' };
    }

    async function convertHTMLToText() {
        const html = typeof state.currentFileData === 'string' ? state.currentFileData : state.currentFileData.text;
        const temp = document.createElement('div');
        temp.innerHTML = html;
        return { content: temp.textContent || temp.innerText || '', mimeType: 'text/plain' };
    }

    async function convertJSONToText() {
        const content = typeof state.currentFileData === 'string' ? state.currentFileData : JSON.stringify(state.currentFileData, null, 2);
        return { content: content, mimeType: 'text/plain' };
    }

    async function genericTextConversion() {
        let content;
        if (typeof state.currentFileData === 'string') content = state.currentFileData;
        else if (state.currentFileData.text) content = state.currentFileData.text;
        else content = JSON.stringify(state.currentFileData, null, 2);
        return { content: content, mimeType: 'text/plain' };
    }

    async function createDOCXFromText(text) {
        const zip = new JSZip();
        zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`);
        zip.folder('_rels').file('.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`);
        zip.folder('word').folder('_rels').file('document.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>`);
        
        const paragraphs = text.split('\n\n').map(p => p.trim()).filter(p => p).map(p => `<w:p><w:r><w:t>${escapeXml(p)}</w:t></w:r></w:p>`).join('');
        zip.folder('word').file('document.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${paragraphs}</w:body></w:document>`);
        
        return { content: await zip.generateAsync({ type: 'arraybuffer' }), mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
    }

    async function mergePDFs() {
        if (state.mergeFiles.length < 2) return;
        try {
            showProgress('Merging...');
            const mergedPdf = await PDFLib.PDFDocument.create();
            for (let i = 0; i < state.mergeFiles.length; i++) {
                updateProgress(Math.round((i / state.mergeFiles.length) * 80));
                const arrayBuffer = await state.mergeFiles[i].arrayBuffer();
                const pdf = await PDFLib.PDFDocument.load(arrayBuffer);
                const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                pages.forEach(page => mergedPdf.addPage(page));
            }
            updateProgress(100);
            const mergedBytes = await mergedPdf.save();
            saveAs(new Blob([mergedBytes], { type: 'application/pdf' }), 'merged.pdf');
            hideProgress();
            showToast('Merged successfully', 'success');
            state.mergeFiles = [];
            updateMergeList();
        } catch (error) {
            hideProgress();
            showToast('Merge failed: ' + error.message, 'error');
        }
    }

    async function compressPDF() {
        if (!state.currentFile) return;
        try {
            showProgress('Optimizing...');
            const arrayBuffer = await state.currentFile.arrayBuffer();
            const pdf = await PDFLib.PDFDocument.load(arrayBuffer);
            pdf.setTitle(''); pdf.setAuthor(''); pdf.setSubject(''); pdf.setKeywords([]); pdf.setProducer(''); pdf.setCreator('');
            updateProgress(50);
            const compressed = await pdf.save({ useObjectStreams: true, addDefaultPage: false });
            updateProgress(100);
            saveAs(new Blob([compressed], { type: 'application/pdf' }), 'optimized.pdf');
            hideProgress();
            showToast('Optimized successfully', 'success');
        } catch (error) {
            hideProgress();
            showToast('Optimization failed: ' + error.message, 'error');
        }
    }

    function updateCompressLabel(value) {
        const labels = { 1: 'Maximum Quality', 2: 'Balanced', 3: 'Maximum Compression' };
        document.getElementById('compressValue').textContent = labels[value];
    }

    function updateMergeList() {
        elements.mergeList.innerHTML = state.mergeFiles.map((file, index) => `
            <div class="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/10">
                <div class="flex items-center gap-3">
                    <i data-lucide="file-text" class="w-5 h-5 text-red-400"></i>
                    <span class="text-sm font-medium text-white">${escapeHtml(file.name)}</span>
                    <span class="text-xs text-gray-500">${formatFileSize(file.size)}</span>
                </div>
                <button onclick="app.removeMergeFile(${index})" class="p-1 hover:bg-white/10 rounded transition-colors">
                    <i data-lucide="x" class="w-4 h-4 text-gray-500"></i>
                </button>
            </div>
        `).join('');
        lucide.createIcons();
        state.mergeFiles.length > 1 ? enableButton(elements.mergeBtn) : disableButton(elements.mergeBtn);
    }

    function removeMergeFile(index) {
        state.mergeFiles.splice(index, 1);
        updateMergeList();
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    function showProgress(text) {
        elements.progressContainer.classList.remove('hidden');
        elements.progressText.textContent = text;
        elements.progressBar.style.width = '0%';
        elements.progressPercent.textContent = '0%';
    }

    function updateProgress(percent) {
        elements.progressBar.style.width = `${percent}%`;
        elements.progressPercent.textContent = `${percent}%`;
    }

    function hideProgress() {
        elements.progressContainer.classList.add('hidden');
    }

    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        const colors = { success: 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400', error: 'border-red-500/50 bg-red-500/10 text-red-400', info: 'border-purple-500/50 bg-purple-500/10 text-purple-400' };
        const icons = { success: 'check-circle', error: 'alert-circle', info: 'info' };
        
        toast.className = `toast flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm ${colors[type]}`;
        toast.innerHTML = `<i data-lucide="${icons[type]}" class="w-5 h-5"></i><span class="font-medium text-sm">${escapeHtml(message)}</span>`;
        
        elements.toastContainer.appendChild(toast);
        lucide.createIcons();
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3000);
    }

    function updateOutputFormats() {
        const format = elements.inputFormat.value;
        const outputSelect = elements.outputFormat;
        const mappings = {
            'pdf': ['txt', 'docx'], 'docx': ['txt', 'pdf'], 'xlsx': ['csv', 'json'],
            'csv': ['xlsx', 'json'], 'txt': ['pdf'], 'html': ['txt'], 'json': ['csv', 'txt']
        };
        const allowed = mappings[format] || ['txt'];
        Array.from(outputSelect.options).forEach(opt => {
            opt.disabled = !allowed.includes(opt.value);
            opt.hidden = !allowed.includes(opt.value);
        });
        const firstAvailable = Array.from(outputSelect.options).find(opt => !opt.disabled);
        if (firstAvailable) outputSelect.value = firstAvailable.value;
        if (state.currentFile) updateConvertButton();
    }

    function updateAcceptedTypes() {
        const format = elements.inputFormat.value;
        const acceptMap = { 'pdf': '.pdf', 'docx': '.docx', 'xlsx': '.xlsx', 'csv': '.csv', 'txt': '.txt', 'json': '.json', 'html': '.html' };
        elements.fileInput.accept = acceptMap[format] || '*';
    }

    function detectFormat(filename) {
        return filename.split('.').pop().toLowerCase();
    }

    function enableButton(btn) {
        btn.disabled = false;
        btn.classList.remove('disabled');
    }

    function disableButton(btn) {
        btn.disabled = true;
        btn.classList.add('disabled');
    }

    function switchTab(tab) {
        state.activeTab = tab;
        ['convert', 'merge', 'compress'].forEach(t => {
            elements[`panel${capitalize(t)}`].classList.add('hidden');
            elements[`tab${capitalize(t)}`].classList.remove('active');
        });
        elements[`panel${capitalize(tab)}`].classList.remove('hidden');
        elements[`tab${capitalize(tab)}`].classList.add('active');
        lucide.createIcons();
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function escapeXml(text) {
        return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
    }

    return {
        init,
        switchTab,
        convertFile,
        mergePDFs,
        compressPDF,
        clearFile,
        removeMergeFile,
        updateCompressLabel,
        toggleTheme: () => document.documentElement.classList.toggle('dark'),
        showApiDocs: () => showToast('API Docs coming soon', 'info')
    };

})();

document.addEventListener('DOMContentLoaded', app.init);