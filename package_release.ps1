# package_release.ps1 - Automated Release Packaging for 2D Billiards
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$releaseDir = Join-Path $scriptDir "release\billiards-windows-x64"
$zipPath = Join-Path $scriptDir "release\billiards-windows-x64.zip"

Write-Host "Creating release package directory: $releaseDir"
if (Test-Path $releaseDir) {
    Remove-Item -Recurse -Force $releaseDir
}
New-Item -ItemType Directory -Path $releaseDir -Force | Out-Null

# 1. Copy executable
$exeSource = Join-Path $scriptDir "billiards.exe"
if (-not (Test-Path $exeSource)) {
    throw "billiards.exe not found in $scriptDir. Run build.bat first."
}
Copy-Item -Path $exeSource -Destination $releaseDir

# 2. Copy all required UCRT64 / SFML 3 DLLs
$dllSourceDir = "C:\msys64\ucrt64\bin"
$requiredDlls = @(
    "libbrotlicommon.dll",
    "libbrotlidec.dll",
    "libbz2-1.dll",
    "libfreetype-6.dll",
    "libgcc_s_seh-1.dll",
    "libglib-2.0-0.dll",
    "libgraphite2.dll",
    "libharfbuzz-0.dll",
    "libiconv-2.dll",
    "libintl-8.dll",
    "libpcre2-8-0.dll",
    "libpng16-16.dll",
    "libsfml-graphics-3.dll",
    "libsfml-system-3.dll",
    "libsfml-window-3.dll",
    "libstdc++-6.dll",
    "libwinpthread-1.dll",
    "zlib1.dll"
)

foreach ($dll in $requiredDlls) {
    $src = Join-Path $dllSourceDir $dll
    if (Test-Path $src) {
        Copy-Item -Path $src -Destination $releaseDir
    } else {
        Write-Warning "DLL not found: $src"
    }
}

# 3. Create run_game.bat launcher
$launcherContent = @"
@echo off
cd /d "%~dp0"
echo Starting 2D Billiards - Rigid Body Dynamics...
start "" "%~dp0billiards.exe"
"@
Set-Content -Path (Join-Path $releaseDir "run_game.bat") -Value $launcherContent -Encoding ASCII

# 4. Create README.txt in release
$readmeContent = @"
========================================================================
2D Billiards - Rigid Body Dynamics Simulation
Author: Ayush Thakare (PCCOE Pune)
Built with SFML 3 and C++17
========================================================================

QUICK LAUNCH:
  Double-click "billiards.exe" or "run_game.bat" to start.

GAME CONTROLS:
  - Left Mouse Click (on table): Aim cue stick towards mouse and shoot cue ball.
  - UP / DOWN Arrow Keys: Increase / decrease shot power (100 - 800 range).
  - R Key: Toggle Research Mode (vector visualization & island rings).
  - P Key: Toggle Play Mode (clean game view).
  - B Key: Toggle Collision Algorithm (BASELINE All-Pairs vs PROPOSED Spatial Grid).
  - SPACEBAR: Pause / resume physics simulation.
  - BACKSPACE: Reset table and re-rack balls.
  - ESC: Quit the game.

SYSTEM REQUIREMENTS:
  - Windows 10 or Windows 11 (64-bit)
  - OpenGL-compatible graphics hardware
  - System font: Arial (standard in C:\Windows\Fonts\arial.ttf)
  - All required SFML 3 and C++ runtime DLLs are pre-packaged in this folder.

TROUBLESHOOTING:
  - If the window closes immediately: Verify that your display drivers support OpenGL,
    and that C:\Windows\Fonts\arial.ttf is present.
  - If Windows SmartScreen displays a warning: Click "More info" -> "Run anyway".
========================================================================
"@
Set-Content -Path (Join-Path $releaseDir "README.txt") -Value $readmeContent -Encoding UTF8

# 5. Create zip archive
if (Test-Path $zipPath) {
    Remove-Item -Force $zipPath
}
Write-Host "Compressing release package to $zipPath..."
Compress-Archive -Path "$releaseDir\*" -DestinationPath $zipPath -CompressionLevel Optimal

Write-Host "Release packaging complete!"
Write-Host "Directory: $releaseDir"
Write-Host "Zip Archive: $zipPath ($( (Get-Item $zipPath).Length / 1MB ) MB)"
