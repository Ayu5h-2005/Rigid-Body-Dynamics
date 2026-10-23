# Deploying 2D Billiards to Vercel (Play Directly in Browser)

The web application in `web/` contains the full **2D Billiards Rigid Body Dynamics Simulation & Collision Research Engine** running directly in the browser via HTML5 Canvas, React, and TypeScript. 

Deploying this to Vercel enables **anyone on any device** (desktop, laptop, tablet, mobile) to play the game instantly in their browser without downloading or installing anything.

---

## 1. Quick Deployment Settings

| Setting | Value |
| :--- | :--- |
| **Framework Preset** | Vite |
| **Root Directory** | **`web`** *(Crucial: must select the `web` folder)* |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

---

## 2. Step-by-Step Vercel Deployment

1. **Log in to Vercel**:
   Go to [vercel.com](https://vercel.com) and log in with your GitHub account.

2. **Add New Project**:
   - Click **Add New...** -> **Project**.
   - Select your repository: `Ayu5h-2005/Rigid-body-dynamics-impulse-based-solvers-contact-island-identification-and-temporal-coherence`.
   - Click **Import**.

3. **Configure Root Directory**:
   - Next to **Root Directory**, click **Edit**.
   - Select the **`web`** directory and click **Continue**.

4. **Deploy**:
   - Click **Deploy**.
   - Vercel will install dependencies, compile the TypeScript game engine, and deploy the playable simulation to a live `*.vercel.app` domain in ~30 seconds.

---

## 3. Web Gameplay Features

- **Direct In-Browser Play**: Click on table to aim cue stick and shoot cue ball.
- **Algorithm Toggling Live**: Press **B** or click the button to switch between **Baseline (All-Pairs)** and **Proposed (Spatial Grid)** algorithms with real-time collision check telemetry.
- **Research Overlays**: Press **R** to visualize the collision normal line, equal-and-opposite impulse vectors ($\vec{J}$ and $-\vec{J}$), and colored Disjoint Set Union (DSU) contact island halos.
- **Controls**:
  - `Click & Drag / Touch`: Aim & shoot cue ball
  - `UP / DOWN Arrows`: Adjust shot impulse (100 to 800)
  - `B`: Toggle Baseline / Proposed algorithm
  - `R`: Research overlay mode
  - `P`: Play mode
  - `SPACE`: Pause / resume physics
  - `BACKSPACE`: Re-rack balls
  - `Fullscreen Button`: Toggle true fullscreen arcade mode

---

## 4. Local Testing Before Push

```bash
cd web
npm install
npm run build
npm run preview
```
Visit `http://localhost:4173` to test the playable game locally before deploying.
