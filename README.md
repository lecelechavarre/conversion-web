<p align="center"> <img src="https://img.shields.io/badge/version-2.0.0-22d3ee.svg?style=for-the-badge&logo=git&logoColor=white" alt="Version"> <img src="https://img.shields.io/badge/license-MIT-a855f7.svg?style=for-the-badge" alt="License"> <img src="https://img.shields.io/badge/privacy-100%25-10b981.svg?style=for-the-badge" alt="Privacy"> <img src="https://img.shields.io/badge/client--side-only-ec4899.svg?style=for-the-badge" alt="Client-Side"> </p> <h1 align="center"> <span style="color: #22d3ee;">Convert</span><span style="color: #a855f7;">Flow</span> </h1> <p align="center"> <strong>Enterprise-Grade Client-Side Document Conversion Platform</strong><br> <em>Professional-grade conversions. Zero server uploads. Military-grade privacy.</em> </p>
📊 GitHub Showcase Metrics
<p align="center"> <img src="https://github-readme-stats.vercel.app/api/pin/?username=yourusername&repo=convertflow&theme=react&show_owner=true" alt="ConvertFlow Repo Stats"> </p> <p align="center"> <img src="https://img.shields.io/github/stars/yourusername/convertflow?style=social" alt="Stars"> <img src="https://img.shields.io/github/forks/yourusername/convertflow?style=social" alt="Forks"> <img src="https://img.shields.io/github/languages/top/yourusername/convertflow?style=flat-square" alt="Top Language"> <img src="https://img.shields.io/github/issues/yourusername/convertflow?style=flat-square" alt="Open Issues"> </p>
🌟 Overview

ConvertFlow is a fully client-side document conversion platform designed for enterprise-grade privacy and performance.

Key highlights:

✅ Browser-local conversions: PDF, DOCX, XLSX, CSV, JSON, TXT, HTML

✅ PDF merge & compression

✅ Instant preview and download

✅ Fully responsive UI (desktop & mobile)

✅ No server, zero file uploads, 100% privacy

📸 Screenshot
<p align="center"> <img src="https://github.com/lecelechavarre/conversion-web/blob/main/screenshoot.png" alt="ConvertFlow Interface" width="80%" style="border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);"> </p>

<em align="center">Dark cyberpunk theme with Convert, Merge, and Compress modes</em>

🏗 Architecture Diagram
┌──────────────┐
│   User File  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Browser    │  ← 100% Local Processing
│  (JS + WASM) │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Conversion   │
│  Engines     │
│ PDF.js,      │
│ PDF-Lib,     │
│ SheetJS      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Output File  │
└──────────────┘

Security Guarantees:

🔒 Files never leave browser

🛡️ No server-side processing

🚫 No telemetry, logs, or cloud storage

🚀 Core Features

Document Conversion: PDF, DOCX, XLSX, CSV, JSON, TXT, HTML

PDF Operations: Multi-file merge, adjustable compression

UX: Live preview, responsive layout, dark/light theme toggle

⚙️ Installation / Run Locally
# Clone repository
git clone https://github.com/yourusername/convertflow.git
cd convertflow

# Serve locally
python -m http.server 8000
# or
npx serve .
# or
php -S localhost:8000

# Open in browser
http://localhost:8000
Docker Deployment
FROM nginx:alpine
COPY . /usr/share/nginx/html/
EXPOSE 80
docker build -t convertflow .
docker run -p 8080:80 convertflow
🧩 Core Application Methods
app.init()                   // Initialize app
app.switchTab(tabName)       // Convert / Merge / Compress
app.convertFile()            // Convert single file
app.mergePDFs()              // Merge PDFs
app.compressPDF()            // Compress PDF
app.clearFile()              // Clear selection
app.removeMergeFile(index)   // Remove file from queue
app.updateCompressLabel(v)   // Update compression setting
app.toggleTheme()            // Toggle light/dark
🧪 Testing & Browser Support
Browser	Status
Chrome 90+	✅
Firefox 88+	✅
Safari 14+	✅
Edge 90+	✅
Opera 76+	✅

Manual Test Cases:

Large PDF conversion (50MB)

XLSX → CSV conversion (row integrity)

Merge multiple PDFs (order integrity)

Compress PDF (size reduction, readable)

📈 Roadmap

OCR support (Tesseract.js)

Batch conversions

Additional formats: ODT, RTF, Markdown

Plugin-based converter architecture

PWA support

🤝 Contributing

Fork the repo

Create feature branch

Commit & push changes

Open Pull Request

📄 License

MIT License © 2026 ConvertFlow

✅ This format is GitHub Profile optimized with:

Repo stats card

Star/fork/language badges

Highlight screenshot at top

Clean showcase structure for portfolio

If you want, I can also add dynamic GitHub activity metrics at the bottom (like streak, commits, total PRs) to make it a full GitHub Profile README “showcase page” that updates automatically.

Do you want me to do that next?

yes

Perfect! Let’s add dynamic GitHub profile activity metrics so your README becomes a full GitHub showcase page — it will automatically display your contributions, streaks, top languages, and overall GitHub stats. Here’s the fully integrated version of your ConvertFlow profile README:

<p align="center"> <img src="https://img.shields.io/badge/version-2.0.0-22d3ee.svg?style=for-the-badge&logo=git&logoColor=white" alt="Version"> <img src="https://img.shields.io/badge/license-MIT-a855f7.svg?style=for-the-badge" alt="License"> <img src="https://img.shields.io/badge/privacy-100%25-10b981.svg?style=for-the-badge" alt="Privacy"> <img src="https://img.shields.io/badge/client--side-only-ec4899.svg?style=for-the-badge" alt="Client-Side"> </p> <h1 align="center"> <span style="color: #22d3ee;">Convert</span><span style="color: #a855f7;">Flow</span> </h1> <p align="center"> <strong>Enterprise-Grade Client-Side Document Conversion Platform</strong><br> <em>Professional-grade conversions. Zero server uploads. Military-grade privacy.</em> </p>
📊 GitHub Showcase Metrics
<p align="center"> <!-- Repo Card --> <img src="https://github-readme-stats.vercel.app/api/pin/?username=yourusername&repo=convertflow&theme=react&show_owner=true" alt="ConvertFlow Repo Stats"> </p> <p align="center"> <!-- Badges --> <img src="https://img.shields.io/github/stars/yourusername/convertflow?style=social" alt="Stars"> <img src="https://img.shields.io/github/forks/yourusername/convertflow?style=social" alt="Forks"> <img src="https://img.shields.io/github/languages/top/yourusername/convertflow?style=flat-square" alt="Top Language"> <img src="https://img.shields.io/github/issues/yourusername/convertflow?style=flat-square" alt="Open Issues"> </p> <p align="center"> <!-- GitHub Profile Stats --> <img src="https://github-readme-stats.vercel.app/api?username=yourusername&show_icons=true&count_private=true&theme=react&hide=prs" alt="GitHub Stats"> <img src="https://github-readme-streak-stats.herokuapp.com/?user=yourusername&theme=react" alt="GitHub Streak"> </p> <p align="center"> <!-- Top Languages --> <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=yourusername&layout=compact&theme=react" alt="Top Languages"> </p>
🌟 Overview

ConvertFlow is a fully client-side document conversion platform built for enterprise-grade privacy and performance.

Key highlights:

✅ Browser-local conversions: PDF, DOCX, XLSX, CSV, JSON, TXT, HTML

✅ PDF merge & compression

✅ Instant preview and download

✅ Fully responsive UI (desktop & mobile)

✅ No server, zero file uploads, 100% privacy

📸 Screenshot
<p align="center"> <img src="https://github.com/lecelechavarre/conversion-web/blob/main/screenshoot.png" alt="ConvertFlow Interface" width="80%" style="border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);"> </p>

<em align="center">Dark cyberpunk theme with Convert, Merge, and Compress modes</em>

🏗 Architecture Diagram
┌──────────────┐
│   User File  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Browser    │  ← 100% Local Processing
│  (JS + WASM) │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Conversion   │
│  Engines     │
│ PDF.js,      │
│ PDF-Lib,     │
│ SheetJS      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Output File  │
└──────────────┘

Security Guarantees:

🔒 Files never leave browser

🛡️ No server-side processing

🚫 No telemetry, logs, or cloud storage

🚀 Core Features

Document Conversion: PDF, DOCX, XLSX, CSV, JSON, TXT, HTML

PDF Operations: Multi-file merge, adjustable compression

UX: Live preview, responsive layout, dark/light theme toggle

⚙️ Installation / Run Locally
# Clone repository
git clone https://github.com/yourusername/convertflow.git
cd convertflow

# Serve locally
python -m http.server 8000
# or
npx serve .
# or
php -S localhost:8000

# Open in browser
http://localhost:8000
Docker Deployment
FROM nginx:alpine
COPY . /usr/share/nginx/html/
EXPOSE 80
docker build -t convertflow .
docker run -p 8080:80 convertflow
🧩 Core Application Methods
app.init()                   // Initialize app
app.switchTab(tabName)       // Convert / Merge / Compress
app.convertFile()            // Convert single file
app.mergePDFs()              // Merge PDFs
app.compressPDF()            // Compress PDF
app.clearFile()              // Clear selection
app.removeMergeFile(index)   // Remove file from queue
app.updateCompressLabel(v)   // Update compression setting
app.toggleTheme()            // Toggle light/dark
🧪 Testing & Browser Support
Browser	Status
Chrome 90+	✅
Firefox 88+	✅
Safari 14+	✅
Edge 90+	✅
Opera 76+	✅

Manual Test Cases:

Large PDF conversion (50MB)

XLSX → CSV conversion (row integrity)

Merge multiple PDFs (order integrity)

Compress PDF (size reduction, readable)

📈 Roadmap

OCR support (Tesseract.js)

Batch conversions

Additional formats: ODT, RTF, Markdown

Plugin-based converter architecture

PWA support

🤝 Contributing

Fork the repo

Create feature branch

Commit & push changes

Open Pull Request

📄 License

MIT License © 2026 ConvertFlow
