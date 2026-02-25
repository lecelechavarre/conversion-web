<p align="center">
  <img src="https://img.shields.io/badge/version-2.0.0-22d3ee.svg?style=for-the-badge&logo=git&logoColor=white" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-a855f7.svg?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/privacy-100%25-10b981.svg?style=for-the-badge" alt="Privacy">
  <img src="https://img.shields.io/badge/client--side-only-ec4899.svg?style=for-the-badge" alt="Client-Side">
</p>

<h1 align="center">
  <span style="color: #22d3ee;">Convert</span><span style="color: #a855f7;">Flow</span>
</h1>

<p align="center">
  <strong>Enterprise-Grade Client-Side Document Conversion Platform</strong><br>
  <em>Professional-grade conversions. Zero server uploads. Military-grade privacy.</em>
</p>

---

## 🌟 Overview

ConvertFlow is a fully client-side document conversion platform built for enterprise-grade privacy and performance.

**Key highlights:**

- ✅ Browser-local conversions: PDF, DOCX, XLSX, CSV, JSON, TXT, HTML  
- ✅ PDF merge & compression  
- ✅ Instant preview and download  
- ✅ Fully responsive UI (desktop & mobile)  
- ✅ No server, zero file uploads, 100% privacy  

---

## 📸 Screenshot

<p align="center">
  <img src="https://github.com/lecelechavarre/conversion-web/blob/main/screenshoot.png" alt="ConvertFlow Interface" width="80%" style="border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
</p>

<em align="center">Dark cyberpunk theme with Convert, Merge, and Compress modes</em>

---

## 🏗 Architecture Diagram
```
┌──────────────┐
│ User File │
└──────┬───────┘
│
▼
┌──────────────┐
│ Browser │ ← 100% Local Processing
│ (JS + WASM) │
└──────┬───────┘
│
▼
┌──────────────┐
│ Conversion │
│ Engines │
│ PDF.js, │
│ PDF-Lib, │
│ SheetJS │
└──────┬───────┘
│
▼
┌──────────────┐
│ Output File │
└──────────────┘
```
