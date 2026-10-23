@echo off
setlocal enabledelayedexpansion

echo ===================================================
echo 2D Billiards - SFML 3 Build Script (UCRT64 / MinGW)
echo ===================================================

:: Check if g++ is in current PATH
where g++ >nul 2>nul
if %ERRORLEVEL% equ 0 (
    set CXX=g++
    goto COMPILE
)

:: Check default MSYS2 UCRT64 path
if exist "C:\msys64\ucrt64\bin\g++.exe" (
    set "PATH=C:\msys64\ucrt64\bin;%PATH%"
    set CXX="C:\msys64\ucrt64\bin\g++.exe"
    goto COMPILE
)

:: Check default MSYS2 MINGW64 path
if exist "C:\msys64\mingw64\bin\g++.exe" (
    set "PATH=C:\msys64\mingw64\bin;%PATH%"
    set CXX="C:\msys64\mingw64\bin\g++.exe"
    goto COMPILE
)

echo [ERROR] g++ compiler not found in PATH or standard MSYS2 directories.
echo Please install MSYS2 with mingw-w64-ucrt-x86_64-sfml and mingw-w64-ucrt-x86_64-gcc.
exit /b 1

:COMPILE
echo Using compiler: %CXX%
echo Compiling main.cpp with SFML 3...
%CXX% -std=c++17 -O2 main.cpp -lsfml-graphics -lsfml-window -lsfml-system -o billiards.exe

if %ERRORLEVEL% equ 0 (
    echo [SUCCESS] Build succeeded: billiards.exe
) else (
    echo [ERROR] Build failed with exit code %ERRORLEVEL%.
    exit /b %ERRORLEVEL%
)

endlocal
