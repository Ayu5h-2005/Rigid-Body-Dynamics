# 2D Billiards: Rigid Body Dynamics Simulation & Collision Detection Research

A high-performance 2D billiards simulation built with **C++17** and **SFML 3**. The project explores rigid-body impulse solvers, contact island identification, temporal coherence, and provides an empirical comparison between **Baseline All-Pairs** collision detection and an optimized **Uniform Spatial Grid** broadphase.

---

## Key Highlights

- **Impulse-Based Solver**: Equal-mass Newtonian impulse response with restitution ($e = 0.94$) and positional penetration resolution.
- **Collision Detection Comparison**:
  - **Baseline ($O(N^2)$)**: Exhaustive pair-checking testing all $N(N-1)/2$ unique ball combinations.
  - **Proposed ($O(N)$ broadphase)**: Uniform spatial grid partitioning with $3 \times 3$ neighborhood candidate generation and deduplication.
- **Temporal Coherence**: Retains persistent contact candidates across sub-steps for stable resting contacts and clustered balls.
- **Contact Island Identification**: Disjoint Set Union (Union-Find) with path compression identifies connected components of touching balls ($\ge 2$ balls).
- **Research Measurement Window**: A rolling 300-frame active measurement window measuring exact collision checks per frame and average physics computation time.
- **Interactive Visual Vectors**: Real-time rendering of contact points, collision normal vectors, and equal-and-opposite impulse vectors ($\vec{J}$ and $-\vec{J}$).

---

## Controls & Keybindings

| Control | Action |
| :--- | :--- |
| **Mouse Click (Table)** | Aim cue stick from cue ball towards cursor and shoot (when balls are stationary) |
| **UP Arrow** | Increase shot power (+30, up to 800) |
| **DOWN Arrow** | Decrease shot power (-30, down to 100) |
| **B Key** | Toggle between **BASELINE** (All-Pairs) and **PROPOSED** (Spatial Grid) algorithms |
| **R Key** / Click **RESEARCH** | Switch to **Research Mode** (displays normal vectors, impulse vectors, island rings, detailed metrics) |
| **P Key** / Click **PLAY** | Switch to **Play Mode** (clean game view) |
| **SPACEBAR** | Pause or resume simulation |
| **BACKSPACE** / Click **RESET** | Reset balls to initial racked configuration |
| **ESC Key** | Quit application |

---

## Standalone Windows Release

A self-contained release package is available for 64-bit Windows systems. It includes all required SFML 3 and UCRT64 runtime libraries so no separate compiler or SDK installation is required on the user's machine.

### Installation & Launch Instructions

1. Download `billiards-windows-x64.zip` from the project's [GitHub Releases](https://github.com/Ayu5h-2005/Rigid-body-dynamics-impulse-based-solvers-contact-island-identification-and-temporal-coherence/releases) or build it locally using `package_release.ps1`.
2. Extract the ZIP archive to a folder on your Windows PC.
3. Launch the game by double-clicking:
   - `billiards.exe` directly, or
   - `run_game.bat` (helper launcher script).

### Packaged Runtime Dependencies

The executable was built using MinGW-w64 UCRT64 and dynamically links to SFML 3. The release package bundles all 18 necessary runtime DLLs:
- `libsfml-graphics-3.dll`, `libsfml-window-3.dll`, `libsfml-system-3.dll`
- `libstdc++-6.dll`, `libgcc_s_seh-1.dll`, `libwinpthread-1.dll`
- `libfreetype-6.dll`, `libharfbuzz-0.dll`, `libpng16-16.dll`, `zlib1.dll`, `libbz2-1.dll`, `libbrotlidec.dll`, `libbrotlicommon.dll`
- `libglib-2.0-0.dll`, `libintl-8.dll`, `libiconv-2.dll`, `libpcre2-8-0.dll`, `libgraphite2.dll`

---

## Building From Source

### Prerequisites

- **OS**: Windows 10 or 11 (64-bit)
- **Compiler**: GCC 13+ supporting C++17 (MSYS2 UCRT64 recommended) or Clang
- **SFML**: Version **3.0+** (`mingw-w64-ucrt-x86_64-sfml`)
- **System Font**: `C:\Windows\Fonts\arial.ttf`

### Quick Build with `build.bat`

If you have MSYS2 installed at `C:\msys64`:
```cmd
build.bat
```

### Direct GCC Command Line

```bash
g++ -std=c++17 -O2 main.cpp -lsfml-graphics -lsfml-window -lsfml-system -o billiards.exe
```

### CMake Build

```bash
mkdir build
cd build
cmake .. -DCMAKE_BUILD_TYPE=Release
cmake --build . --config Release
```

### Packaging a Standalone Zip

Run the automated packaging script in PowerShell:
```powershell
powershell -ExecutionPolicy Bypass -File .\package_release.ps1
```
This generates `release/billiards-windows-x64/` and the archive `release/billiards-windows-x64.zip`.

---

## Web Portal & Vercel Deployment

A companion website built with **React**, **Vite**, **TypeScript**, and **Tailwind CSS** is located in the [`web/`](file:///d:/CGG_FA/web) directory.

### Local Web Testing
```bash
cd web
npm install
npm run build
npm run preview
```

### Deploying to Vercel
1. Import repository into [Vercel](https://vercel.com).
2. Set **Root Directory** to `web`.
3. Set **Framework Preset** to `Vite`.
4. (Optional) Set environment variable `VITE_GAME_DOWNLOAD_URL` to your hosted release zip.
5. Click **Deploy**. See [`web/DEPLOYMENT.md`](file:///d:/CGG_FA/web/DEPLOYMENT.md) for step-by-step instructions.

---

## Verified Compatibility & Test Status

- **Windows 11 (64-bit)**: Executable tested and verified running both natively and in an isolated directory with environment PATH stripped of MSYS2 (`PID: 5144` verified).
- **SFML 3 Compatibility**: Code utilizes SFML 3 modern APIs:
  - `sf::VideoMode({WIDTH, HEIGHT})` (vector mode init)
  - Event polling via `std::optional<sf::Event>` and `event->getIf<sf::Event::...>()`
  - Rotations using `sf::radians(...)`
- **Known Limitation**: The font loader queries `C:/Windows/Fonts/arial.ttf`. If running on Wine/Proton or a custom Windows install without this font at that exact path, font loading will fail with exit code 1.

---

## Collision Detection Architecture

### 1. Baseline: All-Pairs ($O(N^2)$)
For $N$ balls on the table, the baseline algorithm checks every unordered pair:
$$\text{Checks} = \frac{N(N - 1)}{2}$$
With 9 balls on the table, this requires 36 distance checks per physics step regardless of ball separation.

### 2. Proposed: Uniform Spatial Grid ($O(N)$ broadphase)
- The table area is partitioned into grid cells with side length $S = 2R + 1.5 = 25.5\text{ units}$.
- Balls are assigned to grid cells via integer division:
  $$\text{Cell}(x, y) = \left( \left\lfloor \frac{x}{S} \right\rfloor, \left\lfloor \frac{y}{S} \right\rfloor \right)$$
- Narrowphase candidates are only generated between balls sharing the same cell or existing in one of the 8 adjacent neighboring cells ($3 \times 3$ neighborhood).
- **Candidate Deduplication**: Candidate pairs are ordered ($i < j$), sorted, and unique-filtered to eliminate redundant cross-cell checks.
- **Temporal Coherence**: Active contacts from previous frames are maintained in the candidate list to prevent tunneling during rapid motion or dense cluster compression.

---

## Credits & Acknowledgements

- **Author**: Ayush Thakare ([@Ayu5h-2005](https://github.com/Ayu5h-2005)), Pimpri Chinchwad College of Engineering (PCCOE Pune).
- **Repository**: [Rigid-body-dynamics-impulse-based-solvers-contact-island-identification-and-temporal-coherence](https://github.com/Ayu5h-2005/Rigid-body-dynamics-impulse-based-solvers-contact-island-identification-and-temporal-coherence)
- **Library**: [SFML (Simple and Fast Multimedia Library)](https://www.sfml-dev.org/) version 3.

2D Billiards — Rigid Body Dynamics
A 2D billiards simulation written in C++ using SFML 3. It compares Baseline All-Pairs Collision Detection with a Proposed Spatial-Grid Method and displays research metrics such as collision checks and physics timing.
Dependencies
- Visual Studio Code — code editor.
- MSYS2 — Windows development environment.
- GCC/G++ (UCRT64) — C++ compiler.
- SFML 3 — graphics, window, and system libraries.
- C++ standard library — included with GCC.
Setup on Windows
1. Install MSYS2
Download and install MSYS2: https://www.msys2.org/

Open the MSYS2 UCRT64 terminal from the Start menu.
2. Install the compiler and tools
Run:
pacman -Syu
If prompted to close the terminal, close it, reopen MSYS2 UCRT64, then run:
pacman -Syu
pacman -S --needed mingw-w64-ucrt-x86_64-toolchain
3. Install SFML
In the MSYS2 UCRT64 terminal, run:
pacman -S mingw-w64-ucrt-x86_64-sfml
This project uses SFML 3 APIs, so confirm the installed package version is SFML 3. If the repository provides a different major version, use the SFML 3 installation instructions instead.
4. Open the project
Open the project folder in VS Code. Use the UCRT64 terminal and compiler consistently; do not mix libraries from different MSYS2 environments.

Check the compiler:
g++ --version
Check the SFML package:
pacman -Q | grep sfml
Build and run
From the directory containing main.cpp, try:
g++ main.cpp -o billiards.exe -std=c++17 -lsfml-graphics -lsfml-window -lsfml-system
./billiards.exe
If you get missing-header or linker errors, verify that SFML 3 is installed in UCRT64 and follow the build instructions for the installed SFML package.
Controls
- B — switch between Baseline and Proposed collision detection.
- R — research mode.
- P — play mode.
- Space — pause or resume.
- Up / Down Arrow — adjust shot power.
- Backspace — reset the ball arrangement.
Troubleshooting
If the program compiles but VS Code shows red squiggles under #include lines, configure the C/C++ extension to use the UCRT64 compiler. IntelliSense configuration can be separate from the actual build.
