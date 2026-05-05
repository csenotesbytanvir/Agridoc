# 🌾 AgriDoc Intelligence

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Gemini API](https://img.shields.io/badge/AI-Gemini%20API-blue)](https://ai.google.dev/gemini)
[![TLS 1.3](https://img.shields.io/badge/Security-TLS%201.3-green)](https://en.wikipedia.org/wiki/Transport_Layer_Security)
[![Offline Ready](https://img.shields.io/badge/Offline-Ready-brightgreen)](#manual-proxy)

**Pioneering high-fidelity AI diagnostics, decentralized trade hubs, and autonomous biological asset management for the modern producer.**

AgriDoc is a decentralized, AI-driven agronomy platform that empowers farmers with real-time disease detection, offline resilience, direct market access, and a global expert network. It bridges the connectivity gap in rural agriculture using edge computing and the Gemini API.

---

## 📑 Table of Contents

- [Problem Statement](#problem-statement)
- [Solution Overview](#solution-overview)
- [Key Features](#key-features)
  - [🧠 Neural Link](#-neural-link)
  - [📡 Pathogen Radar](#-pathogen-radar)
  - [🏪 Trade Hub](#-trade-hub)
  - [📴 Manual Proxy (Offline Mode)](#-manual-proxy-offline-mode)
  - [📒 Crop Registry](#-crop-registry)
  - [👥 FarmGram & Agro Sentinels](#-farmgram--agro-sentinels)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [SDG Alignment](#sdg-alignment)
- [Live Demo Flow](#live-demo-flow)
- [Testing & Performance](#testing--performance)
- [Setup & Environment](#setup--environment)
- [Usage Guide](#usage-guide)
- [Team](#team)
- [License](#license)

---

## 🚨 Problem Statement

Smallholder farmers in Bangladesh and similar regions face four critical challenges:

| Challenge | Consequence |
|-----------|-------------|
| **Late disease diagnosis** | 30–40% crop loss; no expert nearby |
| **Market manipulation** | Middlemen take 40–60% of profits |
| **Connectivity gap** | Digital solutions fail without internet |
| **Inefficient resource use** | Over-irrigation and fertilizer waste |

AgriDoc solves all four with a single, offline-first platform.

---

## 💡 Solution Overview

AgriDoc is a **mobile-first, hybrid-online/offline** platform that provides:

- AI-powered disease detection from a phone camera (even offline)
- A decentralized marketplace with real-time prices and direct chat
- Regional pathogen outbreak alerts (crowdsourced + government reports)
- Offline field guides, NPK calculator, and irrigation scheduler
- A biological asset ledger to track crops, treatments, and yield history

---

## ✨ Key Features

### 🧠 Neural Link
- **Visual AI identification** of plant pathogens and nutrient deficiencies.
- Powered by **Gemini API** (Google AI Studio).
- Returns diagnosis, confidence score, and mitigation steps in <5 seconds.
- Works offline via cached edge repository.

### 📡 Pathogen Radar
- **Global & regional bio‑threat mapping**.
- Shows incursion counts and gamma risk zones.
- Farmers can **broadcast pest warnings** to government agents and local clusters (Crisis Protocol).

### 🏪 Trade Hub
- **Decentralized marketplace** with live price matrix (rice, tomato, mango, chili, etc.).
- Direct **buyer-seller chat**.
- **Wanted listings** – farmers can plant for guaranteed demand.
- Real-time exchange rates for inputs (urea, potash).

### 📴 Manual Proxy (Offline Mode)
- Works **100% without internet** – core features remain functional.
- Includes:
  - **Symptom Check** – offline decision trees for disease diagnosis.
  - **NPK Matrix** – offline fertilizer calculator.
  - **Cultivar Atlas** – offline crop encyclopedia.
  - **Hydro Scheduler** – precision irrigation logic (clay/sandy soil + dry/wet season).
- **Global Sync Broadcast** – stores observations offline, then syncs to decentralized ledger when connectivity returns.

### 📒 Crop Registry
- A **decentralized biological asset ledger** (CRUD).
- Track cultivars, genetic strains, vital signs, and treatment history.
- Each asset has a unique `ASSET_ID` tied to the farmer’s identity.

### 👥 FarmGram & Agro Sentinels
- **FarmGram** – a social feed for farmers to share observations, pests, and innovations.
- **Agro Sentinels** – a network of verified agronomists (PhD/M.Sc.) available for priority consultation.
  - Example: Dr. Tanvir Ahmmed – Rice disease specialist (98.4% synchronized).
- **Neural Uplink Key** – one‑click bridge to Gemini for real‑time diagnostic synthesis.

---

## 🏗 Architecture & Tech Stack

| Component | Technology |
|-----------|------------|
| **AI Engine** | Gemini API (Google AI Studio) – multimodal (image + text) |
| **Offline Cache** | Edge Repository (local storage ~14.8 MB) |
| **Sync Protocol** | Hybrid Active Mode – seamless online/offline switching |
| **Ledger** | Decentralized biological asset registry (simulated JSON/IndexedDB) |
| **Encryption** | TLS 1.3 for all network transmissions |
| **Frontend** | React Native / Flutter (UI mockups provided) |
| **Backend (planned)** | Node.js + PostgreSQL + IPFS for asset ledger |

---

## 🌍 SDG Alignment

AgriDoc directly contributes to **six UN Sustainable Development Goals**:

| SDG | Contribution |
|-----|--------------|
| **1 – No Poverty** | Fair market access, elimination of middlemen |
| **2 – Zero Hunger** | Reduced crop loss via early disease detection |
| **4 – Quality Education** | Digital literacy, expert knowledge via FarmGram |
| **8 – Decent Work & Growth** | Transparent pricing, income security |
| **12 – Responsible Consumption** | Optimized water/fertilizer use (Hydro Scheduler) |
| **13 – Climate Action** | Pathogen Radar for climate‑induced pest tracking |

---

## 🎥 Live Demo Flow

1. **Open app** → point camera at diseased plant leaf.
2. **Neural Link** captures image → sends to Gemini API.
3. **Response in <5 seconds**:
   - Disease name (e.g., *Fusarium Dry Rot*)
   - Confidence: 92%
   - Mitigation: chemical + biological options
4. **Offline test** → enable airplane mode → same scan works from cached model.
5. **Optional** → tap "Broadcast Alert" to notify nearby farmers via Pathogen Radar.

📹 *A 2-minute offline backup video is included in the repository (`/demo/offline-demo.mp4`).*

---

## 📊 Testing & Performance

| Metric | Result |
|--------|--------|
| Test images | 15 field samples (potato, rice, chili) |
| Correct diagnoses | 13 / 15 |
| Accuracy | **86.7%** (vs expert 95% – acceptable for first alert) |
| False positives | 2 (due to low light) |
| Average latency (online) | 3.2 seconds |
| Offline mode response | <0.5 seconds (cached) |

**Limitations:**  
- Limited dataset (expanding to 200 images).  
- Low-light performance needs improvement.  
- Rare diseases not yet trained.

---

## 🛠 Setup & Environment

This project requires a valid **Gemini API key** from Google AI Studio. No specific run commands are provided – refer to your deployment environment (mobile or web).

**Requirements:**
- Gemini API key (get from [Google AI Studio](https://aistudio.google.com/))
- Compatible mobile or web browser with camera access
- Offline storage support (IndexedDB or local file system)

---

## 📱 Usage Guide

### Online Mode
1. Open **Neural Link** → tap camera icon → capture leaf image.
2. Review diagnosis and suggested treatments.
3. Check **Pathogen Radar** for local outbreaks.
4. List produce on **Trade Hub** or respond to wanted ads.

### Offline Mode
1. Enable airplane mode – app automatically switches to **Manual Proxy**.
2. Use **Symptom Check** (decision trees) or **NPK Matrix**.
3. Record field observations – they are stored locally.
4. When internet returns, tap **Global Sync Broadcast** to upload to ledger.

---

## 👨‍🌾 Team

| Name | Role |
|------|------|
| MD Tanvir Ahmmed | Project Lead, AI Integration, Offline Architecture, Edge Repository, Trade Hub & Backend |
| Suborna Akter | UI/UX Design, FarmGram Module, Testing & Documentation |

---

## 📄 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Gemini API** for multimodal AI capabilities.
- **GRIC Global Robotics & Innovation Consortium** for competition framework.
- **Bangladesh farmers** who inspired the offline-first design.

---

## 📧 Contact

For questions or collaboration:  
📩 **tanvirahmmed13579@gmnail.com**  

---

**AgriDoc – The Future of Yield.**  
*Empowering every farmer to become an Agri‑Champion.*
