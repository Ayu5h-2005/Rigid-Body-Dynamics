# Vercel Deployment Guide for 2D Billiards Website

This guide walks through deploying the web portal located in the `web/` directory to **Vercel** independently of the C++ desktop simulation.

---

## 1. Quick Setup Overview

| Setting | Value |
| :--- | :--- |
| **Framework Preset** | Vite |
| **Root Directory** | `web` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |
| **Node.js Version** | 18.x or 20.x or 22.x |

---

## 2. Step-by-Step Vercel Deployment

1. **Sign in to Vercel**:
   Go to [vercel.com](https://vercel.com) and log in with your GitHub account.

2. **Import Repository**:
   - Click **Add New...** -> **Project**.
   - Search for `Rigid-body-dynamics-impulse-based-solvers-contact-island-identification-and-temporal-coherence`.
   - Click **Import**.

3. **Configure the Project**:
   - **Project Name**: `billiards-rigid-body-dynamics` (or preferred name).
   - **Framework Preset**: Vercel automatically detects `Vite`.
   - **Root Directory**: **CRITICAL STEP**: Click **Edit** next to Root Directory, select the `web` folder, and click **Continue**.
   - **Build and Output Settings**: Leave as default (`npm run build` and `dist`).

4. **Set Environment Variables**:
   Under **Environment Variables**, optionally add:
   - **Name**: `VITE_GAME_DOWNLOAD_URL`
   - **Value**: Direct URL to your hosted Windows release ZIP (e.g. `https://github.com/Ayu5h-2005/Rigid-body-dynamics-impulse-based-solvers-contact-island-identification-and-temporal-coherence/releases/download/v1.0.0/billiards-windows-x64.zip`).
   - *Note*: If omitted, the website automatically falls back to the release guidance modal with links to GitHub Releases and local packaging instructions.

5. **Deploy**:
   Click **Deploy**. Vercel will build and deploy the site in under 60 seconds, provisioning an SSL-enabled `.vercel.app` domain.

---

## 3. How Future Commits Update the Website

- Vercel monitors the `main` branch via GitHub webhooks.
- Whenever a new commit touches files in the `web/` directory, Vercel initiates an automated zero-downtime deployment.
- Commits that only touch C++ files (e.g., `main.cpp`) will trigger a build only if root directory cache is updated, keeping deployment isolated.

---

## 4. Local Preview Commands

Before pushing, test the production build locally:

```bash
cd web
npm run build
npm run preview
```
Visit `http://localhost:4173` to verify the responsive design on desktop and mobile viewports.
