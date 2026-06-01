# 📱 QR Code Studio

![QR Code Studio](https://img.shields.io/badge/QR%20Code-Studio-blueviolet?style=for-the-badge&logo=qrcode&logoColor=white)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)](https://qr-studio-gamma.vercel.app)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Gemini%20AI-2.5%20Flash-orange?style=for-the-badge&logo=google-gemini&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)

A professional, feature-rich, and visually stunning QR Code Generation & Management application built with **React**, **TypeScript**, **TailwindCSS**, and **Google Gemini AI**. 

🌐 **Live Demo Website**: [https://qr-studio-gamma.vercel.app](https://qr-studio-gamma.vercel.app)

**QR Code Studio** allows users to generate beautiful static and dynamic QR codes, customize them to match a brand's visual identity using AI-powered style generation, track scans with detailed interactive analytics, and prepare high-quality sheets for printing.

---

## ✨ Key Features

### 1. ⚡ QR Code Types
*   **Static QR Codes**: Generate instant, offline-compatible QR codes for:
    *   **URLs**: Web addresses and landing pages.
    *   **Wi-Fi**: Quick network access points (SSID, Password, Security type, Hidden status).
    *   **vCard**: Digital business cards containing name, phone, email, organization, title, URL, and physical address.
    *   **Email**: Pre-filled emails containing recipient address, subject line, and body message.
    *   **SMS**: Pre-filled messages matching a target phone number.
*   **Dynamic QR Codes**: 
    *   Creates shortened redirection links that point to a central app route.
    *   **Real-time updates**: Edit the target URL dynamically at any time without changing the physical QR code.
    *   **Scan Tracking**: Automatically logs visitor agent metrics.

### 2. 🤖 AI-Powered Branding Theme Assistant
*   Integrated with the **Google Gen AI SDK** (`gemini-2.5-flash`).
*   Describe your brand identity (e.g., *"futuristic cyberpunk energy drink"* or *"cozy organic coffee shop"*), and Gemini will generate a matching, high-contrast palette.
*   Outputs custom foreground/background colors, CSS linear gradients for cards, engaging marketing taglines (3-5 words), and sticker badges (e.g., "INFO", "WIFI").

### 3. 🎨 Extensive Design Customization
*   **Theme Presets**: Switch instantly to themes like *Cyberpunk Glow*, *Minimalist Gold*, *Eco Organic*, or *Sunset Rose*.
*   **Logo Overlays**: Embed center logos using predefined presets (Google, GitHub, Wi-Fi, Globe, Mail, User) or upload custom logo image assets (`.png`, `.jpg`, `.svg`).
*   **Adjustable Settings**: Fine-tune QR size, toggle margins, set error correction levels (L, M, Q, H), and toggle center excavation.

### 4. 📊 Live Simulation & Interactive Analytics
*   **Scan Simulator**: Locally test client-side redirects and simulate scans by selecting custom devices (Mobile, Tablet, Desktop), OS (iOS, Android, Windows, macOS, Linux), browsers, and referrer sources.
*   **Interactive SVG Chart**: Interactive, smooth data visualization depicting scan volumes over the past 7 days.
*   **Client Insights**: Breakdowns for device ratios, operating systems, browsers, and referrers.
*   **CSV Exporter**: Export visitor logs containing timestamps and device details directly to CSV.

### 5. 🖨️ Professional Print Designer
*   Swap modes to configure ready-to-print sheets.
*   Customize print titles, descriptions, page repeat counts, grid column counts, margin helpers, page cut marks, and print frame notes.
*   Hides all editor UI elements in CSS print layout for a clean printer output.

---

## 🛠️ Technology Stack

*   **Framework**: [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [TailwindCSS v4](https://tailwindcss.com/) & [Motion (Framer Motion)](https://motion.dev/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **QR Engine**: `qrcode.react` (Canvas-based rendering)
*   **AI Integration**: [@google/genai SDK](https://www.npmjs.com/package/@google/genai)
*   **Bundler & Dev Server**: [Vite](https://vite.dev/)

---

## 📂 Project Structure

```
QR-Studio/
├── src/
│   ├── App.tsx          # Main application containing all pages, states, print previews, and modals
│   ├── main.tsx         # Application entry point
│   ├── index.css        # Tailwind styles and global animation styles
│   └── lib/
│       └── utils.ts     # Tailwind class merger utility helper
├── package.json         # Scripts, dependencies, and metadata configuration
├── vite.config.ts       # Bundler and Tailwind compilation setup
└── tsconfig.json        # TypeScript configuration rules
```

---

## 🚀 Getting Started

### 📋 Prerequisites
*   [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
*   [NPM](https://www.npmjs.com/) or another package manager (e.g. Yarn, PNPM)

### 💻 Installation & Setup

1.  **Clone or navigate to the project directory**:
    ```bash
    cd QR-Studio
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Create a `.env` file in the root folder (or duplicate and modify `.env.example`):
    ```env
    # Optional default API key for Gemini AI. Users can also input their key inside the app UI.
    GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

    # The public URL where this applet is hosted (used for short link redirections)
    APP_URL="http://localhost:3000"
    ```

    #### 🔑 How to Get a Google Gemini API Key
    To use the AI-Powered Branding Theme Assistant, you need a Gemini API key:
    1. Go to [Google AI Studio](https://aistudio.google.com/).
    2. Sign in with your Google/Gmail account.
    3. Click on the **Get API key** button in the sidebar.
    4. Click **Create API key**.
    5. Choose to associate the key with a new or existing Google Cloud project.
    6. Copy the generated key.
    7. Paste the key as the value of `GEMINI_API_KEY` in your `.env` file (or enter it directly into the settings modal inside the app UI).

4.  **Run the development server**:
    ```bash
    npm run dev
    ```
    *Open [http://localhost:3000](http://localhost:3000) in your browser.*

### 📦 Building for Production

To create an optimized production build:
```bash
# Clean previous builds and bundle the application
npm run build
```
This builds static assets into the `dist` directory, ready to be hosted on any static provider (Netlify, Vercel, Firebase Hosting) or loaded into a Cloud Run instance.

To preview your production build locally:
```bash
npm run preview
```

---

## 🔒 Licenses & Guidelines
This project is licensed under the Apache-2.0 License. Refer to the header license comments for files within the repository.
