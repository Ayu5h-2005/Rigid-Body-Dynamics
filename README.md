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
