import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Maximize2, Minimize2, Play, Pause, RefreshCw, Eye, Sparkles, HelpCircle } from 'lucide-react';

interface Vector2D {
  x: number;
  y: number;
}

interface Ball {
  pos: Vector2D;
  vel: Vector2D;
  color: string;
  pocketed: boolean;
}

export const BilliardsGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Constants identical to main.cpp
  const WIDTH = 1200;
  const HEIGHT = 760;
  const TX = 30;
  const TY = 100;
  const TW = 790;
  const TH = 570;
  const R = 12;

  // React state for HUD mirroring
  const [researchMode, setResearchMode] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [proposedMode, setProposedMode] = useState(false);
  const [power, setPower] = useState(420);
  const [ballsRemaining, setBallsRemaining] = useState(9);
  const [collisionChecksLive, setCollisionChecksLive] = useState(0);
  const [activeContactsLive, setActiveContactsLive] = useState(0);
  const [islandCountLive, setIslandCountLive] = useState(0);
  const [cachedContactsLive, setCachedContactsLive] = useState(0);
  const [avgChecksPerFrame, setAvgChecksPerFrame] = useState<number | null>(null);
  const [avgPhysicsMs, setAvgPhysicsMs] = useState<number | null>(null);
  const [collectingCount, setCollectingCount] = useState(0);

  // Refs for animation loop state (to avoid closure capture lag)
  const stateRef = useRef({
    balls: [] as Ball[],
    research: true,
    paused: false,
    proposedMode: false,
    power: 420,
    collisionChecks: 0,
    contacts: 0,
    cachedContacts: 0,
    previousContactPairs: [] as [number, number][],
    currentContactPairs: [] as [number, number][],
    lastContactPoint: { x: 0, y: 0 } as Vector2D,
    lastNormal: { x: 0, y: 0 } as Vector2D,
    lastImpulse: { x: 0, y: 0 } as Vector2D,
    lastBallAPos: { x: 0, y: 0 } as Vector2D,
    lastBallBPos: { x: 0, y: 0 } as Vector2D,
    collisionVisualTime: 0,
    measurementFrames: 0,
    measurementCollisionChecks: 0,
    measurementPhysicsMs: 0,
    averageChecksPerFrame: 0,
    averagePhysicsMsPerFrame: 0,
    measurementReady: false,
    mouse: { x: 0, y: 0 } as Vector2D,
    accumulator: 0,
    lastTime: performance.now(),
    islandIds: [] as number[],
    islandCount: 0
  });

  // Vector helpers
  const length = (v: Vector2D) => Math.hypot(v.x, v.y);
  const dot = (a: Vector2D, b: Vector2D) => a.x * b.x + a.y * b.y;
  const normalize = (v: Vector2D): Vector2D => {
    const l = length(v);
    return l > 0.001 ? { x: v.x / l, y: v.y / l } : { x: 1, y: 0 };
  };

  // Reset function matching main.cpp lines 131-183
  const resetGame = useCallback(() => {
    const s = stateRef.current;
    s.balls = [];
    s.previousContactPairs = [];
    s.currentContactPairs = [];
    s.cachedContacts = 0;
    s.collisionVisualTime = 0;

    // Cue ball
    s.balls.push({
      pos: { x: TX + 170, y: TY + TH / 2 },
      vel: { x: 0, y: 0 },
      color: '#ffffff',
      pocketed: false
    });

    const colors = [
      'rgb(245,190,45)', 'rgb(220,65,65)',
      'rgb(65,135,245)', 'rgb(170,90,220)',
      'rgb(50,190,140)', 'rgb(245,130,45)',
      'rgb(240,220,180)', 'rgb(70,75,90)'
    ];

    for (let i = 0; i < 8; i++) {
      const col = Math.floor(i / 3);
      const row = i % 3;
      s.balls.push({
        pos: {
          x: TX + 500 + col * 27,
          y: TY + TH / 2 + (row - 1) * 27
        },
        vel: { x: 0, y: 0 },
        color: colors[i],
        pocketed: false
      });
    }

    // Reset measurement window
    s.measurementFrames = 0;
    s.measurementCollisionChecks = 0;
    s.measurementPhysicsMs = 0;
    s.measurementReady = false;
    setAvgChecksPerFrame(null);
    setAvgPhysicsMs(null);
    setCollectingCount(0);
  }, [TX, TY, TH]);

  // Initial reset on mount
  useEffect(() => {
    resetGame();
  }, [resetGame]);

  // Sync state helpers
  const toggleAlgorithm = () => {
    const s = stateRef.current;
    s.proposedMode = !s.proposedMode;
    s.previousContactPairs = [];
    s.currentContactPairs = [];
    s.cachedContacts = 0;
    s.measurementFrames = 0;
    s.measurementCollisionChecks = 0;
    s.measurementPhysicsMs = 0;
    s.measurementReady = false;
    setProposedMode(s.proposedMode);
    setAvgChecksPerFrame(null);
    setAvgPhysicsMs(null);
    setCollectingCount(0);
  };

  const setResearch = (val: boolean) => {
    stateRef.current.research = val;
    setResearchMode(val);
  };

  const togglePause = () => {
    const s = stateRef.current;
    s.paused = !s.paused;
    setIsPaused(s.paused);
  };

  const adjustPower = (delta: number) => {
    const s = stateRef.current;
    s.power = Math.max(100, Math.min(800, s.power + delta));
    setPower(s.power);
  };

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for game keys if within container view
      if (['Space', 'ArrowUp', 'ArrowDown', 'KeyB', 'KeyR', 'KeyP', 'Backspace'].includes(e.code)) {
        e.preventDefault();
      }

      if (e.code === 'KeyR') setResearch(true);
      if (e.code === 'KeyP') setResearch(false);
      if (e.code === 'KeyB') toggleAlgorithm();
      if (e.code === 'Space') togglePause();
      if (e.code === 'ArrowUp') adjustPower(30);
      if (e.code === 'ArrowDown') adjustPower(-30);
      if (e.code === 'Backspace') resetGame();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [resetGame]);

  // Fullscreen toggle
  const handleFullscreenToggle = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Canvas Mouse & Click handling
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const scaleX = WIDTH / rect.width;
    const scaleY = HEIGHT / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    stateRef.current.mouse = getCanvasCoords(e);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const click = getCanvasCoords(e);
    const s = stateRef.current;

    // Top menu buttons matching main.cpp:334-348
    if (click.y < 70) {
      if (click.x >= 690 && click.x < 810) {
        setResearch(false); // PLAY [P]
      } else if (click.x >= 810 && click.x < 960) {
        setResearch(true); // RESEARCH [R]
      } else if (click.x >= 960 && click.x < 1070) {
        resetGame(); // RESET
      }
      return;
    }

    // Algorithm toggle click on dashboard
    if (click.x >= 870 && click.x <= 1145 && click.y >= 445 && click.y <= 470) {
      toggleAlgorithm();
      return;
    }

    // Shot click on table matching main.cpp:350-370
    if (click.x > TX && click.x < TX + TW && click.y > TY && click.y < TY + TH && !s.paused && s.balls.length > 0 && !s.balls[0].pocketed) {
      let moving = false;
      for (const b of s.balls) {
        if (length(b.vel) > 1.0) moving = true;
      }
      if (!moving) {
        const dir = normalize({ x: click.x - s.balls[0].pos.x, y: click.y - s.balls[0].pos.y });
        s.balls[0].vel = { x: dir.x * s.power, y: dir.y * s.power };
      }
    }
  };

  // Main Simulation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const dt = 1.0 / 120.0;
    const MEASUREMENT_WINDOW_FRAMES = 300;

    const sixPockets: Vector2D[] = [
      { x: TX, y: TY },
      { x: TX + TW / 2, y: TY },
      { x: TX + TW, y: TY },
      { x: TX, y: TY + TH },
      { x: TX + TW / 2, y: TY + TH },
      { x: TX + TW, y: TY + TH }
    ];

    const loop = (timestamp: number) => {
      const s = stateRef.current;
      const elapsed = Math.min((timestamp - s.lastTime) / 1000, 0.05);
      s.lastTime = timestamp;

      if (!s.paused) {
        s.collisionVisualTime = Math.max(0, s.collisionVisualTime - elapsed);
      }

      s.collisionChecks = 0;
      s.contacts = 0;

      const physicsStart = performance.now();

      if (!s.paused) {
        s.accumulator += elapsed;
        while (s.accumulator >= dt) {
          s.currentContactPairs = [];

          // 1. Move balls and handle cushions (main.cpp:400-452)
          for (const b of s.balls) {
            if (b.pocketed) continue;
            b.pos.x += b.vel.x * dt;
            b.pos.y += b.vel.y * dt;
            b.vel.x *= 0.997;
            b.vel.y *= 0.997;

            if (length(b.vel) < 4.0) {
              b.vel = { x: 0, y: 0 };
            }

            const left = TX + R;
            const right = TX + TW - R;
            const top = TY + R;
            const bottom = TY + TH - R;

            if (b.pos.x < left) {
              b.pos.x = left;
              b.vel.x = Math.abs(b.vel.x) * 0.94;
            }
            if (b.pos.x > right) {
              b.pos.x = right;
              b.vel.x = -Math.abs(b.vel.x) * 0.94;
            }
            if (b.pos.y < top) {
              b.pos.y = top;
              b.vel.y = Math.abs(b.vel.y) * 0.94;
            }
            if (b.pos.y > bottom) {
              b.pos.y = bottom;
              b.vel.y = -Math.abs(b.vel.y) * 0.94;
            }
          }

          // 2. Collision candidate generation (main.cpp:456-517)
          const pairOrder: [number, number][] = [];
          const ballCount = s.balls.length;

          if (!s.proposedMode) {
            // Baseline: All-Pairs O(N^2)
            for (let i = 0; i < ballCount; i++) {
              for (let j = i + 1; j < ballCount; j++) {
                pairOrder.push([i, j]);
              }
            }
          } else {
            // Proposed: Uniform Spatial Grid Broadphase
            const cellSize = 2.0 * R + 1.5; // 25.5
            const grid = new Map<string, number[]>();

            const cellKey = (pos: Vector2D) => {
              const cx = Math.floor(pos.x / cellSize);
              const cy = Math.floor(pos.y / cellSize);
              return `${cx},${cy}`;
            };

            for (let i = 0; i < ballCount; i++) {
              if (!s.balls[i].pocketed) {
                const key = cellKey(s.balls[i].pos);
                if (!grid.has(key)) grid.set(key, []);
                grid.get(key)!.push(i);
              }
            }

            // Temporal coherence: maintain previously touching pairs
            for (const pair of s.previousContactPairs) {
              if (pair[0] < ballCount && pair[1] < ballCount && !s.balls[pair[0]].pocketed && !s.balls[pair[1]].pocketed) {
                pairOrder.push(pair);
              }
            }

            // Neighbor queries (3x3 footprint)
            for (const [key, indices] of grid.entries()) {
              const [cx, cy] = key.split(',').map(Number);
              for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                  const nKey = `${cx + dx},${cy + dy}`;
                  const neighborIndices = grid.get(nKey);
                  if (!neighborIndices) continue;
                  for (const i of indices) {
                    for (const j of neighborIndices) {
                      if (i < j) pairOrder.push([i, j]);
                    }
                  }
                }
              }
            }

            // Deduplicate pairs
            pairOrder.sort((a, b) => a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]);
            for (let k = pairOrder.length - 1; k > 0; k--) {
              if (pairOrder[k][0] === pairOrder[k - 1][0] && pairOrder[k][1] === pairOrder[k - 1][1]) {
                pairOrder.splice(k, 1);
              }
            }
          }

          // 3. Narrowphase distance checks & impulse response (main.cpp:519-600)
          for (const [i, j] of pairOrder) {
            const a = s.balls[i];
            const b = s.balls[j];
            if (a.pocketed || b.pocketed) continue;

            s.collisionChecks++;

            const delta = { x: b.pos.x - a.pos.x, y: b.pos.y - a.pos.y };
            const dist = length(delta);
            if (dist < 0.001) continue;

            // Temporal contact recording threshold
            if (dist <= 2.0 * R + 1.5) {
              s.currentContactPairs.push([i, j]);
            }

            // Physical collision response
            if (dist >= 2.0 * R) continue;

            s.contacts++;
            const n = { x: delta.x / dist, y: delta.y / dist };
            const relative = dot({ x: b.vel.x - a.vel.x, y: b.vel.y - a.vel.y }, n);

            if (s.research) {
              s.lastContactPoint = { x: (a.pos.x + b.pos.x) / 2, y: (a.pos.y + b.pos.y) / 2 };
              s.lastBallAPos = { ...a.pos };
              s.lastBallBPos = { ...b.pos };
              s.lastNormal = { ...n };
              s.collisionVisualTime = 3.0;
            }

            if (relative < 0) {
              const jImpulse = -(1.0 + 0.94) * relative / 2.0;
              s.lastImpulse = { x: n.x * jImpulse, y: n.y * jImpulse };

              a.vel.x -= n.x * jImpulse;
              a.vel.y -= n.y * jImpulse;
              b.vel.x += n.x * jImpulse;
              b.vel.y += n.y * jImpulse;
            }

            const overlap = 2.0 * R - dist;
            a.pos.x -= n.x * (overlap / 2.0);
            a.pos.y -= n.y * (overlap / 2.0);
            b.pos.x += n.x * (overlap / 2.0);
            b.pos.y += n.y * (overlap / 2.0);
          }

          // 4. Pocket checks (main.cpp:613-631)
          for (const b of s.balls) {
            if (b.pocketed) continue;
            for (const p of sixPockets) {
              if (length({ x: b.pos.x - p.x, y: b.pos.y - p.y }) < 19.0) {
                b.pocketed = true;
                b.vel = { x: 0, y: 0 };
                break;
              }
            }
          }

          // 5. Cached contacts counting (main.cpp:634-652)
          s.cachedContacts = 0;
          for (const pair of s.currentContactPairs) {
            const exists = s.previousContactPairs.some(p => p[0] === pair[0] && p[1] === pair[1]);
            if (exists) s.cachedContacts++;
          }
          s.previousContactPairs = [...s.currentContactPairs];

          s.accumulator -= dt;
        }
      }

      const physicsEnd = performance.now();
      const physicsMs = physicsEnd - physicsStart;

      // 6. Rolling 300-frame measurement window (main.cpp:665-684)
      if (!s.paused) {
        s.measurementFrames++;
        s.measurementCollisionChecks += s.collisionChecks;
        s.measurementPhysicsMs += physicsMs;

        if (s.measurementFrames >= MEASUREMENT_WINDOW_FRAMES) {
          s.averageChecksPerFrame = s.measurementCollisionChecks / s.measurementFrames;
          s.averagePhysicsMsPerFrame = s.measurementPhysicsMs / s.measurementFrames;
          s.measurementReady = true;

          setAvgChecksPerFrame(s.averageChecksPerFrame);
          setAvgPhysicsMs(s.averagePhysicsMsPerFrame);

          s.measurementFrames = 0;
          s.measurementCollisionChecks = 0;
          s.measurementPhysicsMs = 0;
        } else if (!s.measurementReady) {
          setCollectingCount(s.measurementFrames);
        }
      }

      // 7. Contact Island Identification via DSU (main.cpp:686-766)
      const ballCount = s.balls.length;
      const islandParent = Array.from({ length: ballCount }, (_, i) => i);
      const findRoot = (x: number): number => {
        while (islandParent[x] !== x) {
          islandParent[x] = islandParent[islandParent[x]];
          x = islandParent[x];
        }
        return x;
      };

      for (let i = 0; i < ballCount; i++) {
        if (s.balls[i].pocketed) continue;
        for (let j = i + 1; j < ballCount; j++) {
          if (s.balls[j].pocketed) continue;
          if (length({ x: s.balls[j].pos.x - s.balls[i].pos.x, y: s.balls[j].pos.y - s.balls[i].pos.y }) <= 2.0 * R + 1.5) {
            const rootA = findRoot(i);
            const rootB = findRoot(j);
            if (rootA !== rootB) islandParent[rootB] = rootA;
          }
        }
      }

      const componentSizes = new Array(ballCount).fill(0);
      for (let i = 0; i < ballCount; i++) {
        if (!s.balls[i].pocketed) componentSizes[findRoot(i)]++;
      }

      s.islandIds = new Array(ballCount).fill(-1);
      const islandRoots: number[] = [];

      for (let i = 0; i < ballCount; i++) {
        if (s.balls[i].pocketed) continue;
        const root = findRoot(i);
        if (componentSizes[root] < 2) continue; // Only count clusters of >= 2 balls
        const idx = islandRoots.indexOf(root);
        if (idx === -1) {
          islandRoots.push(root);
          s.islandIds[i] = islandRoots.length - 1;
        } else {
          s.islandIds[i] = idx;
        }
      }
      s.islandCount = islandRoots.length;

      // Update React live telemetry state periodically (every 4 frames)
      if (s.measurementFrames % 4 === 0) {
        let rem = 0;
        for (const b of s.balls) if (!b.pocketed) rem++;
        setBallsRemaining(rem);
        setCollisionChecksLive(s.collisionChecks);
        setActiveContactsLive(s.contacts);
        setIslandCountLive(s.islandCount);
        setCachedContactsLive(s.cachedContacts);
      }

      // ==========================================
      // RENDERING (Matching main.cpp:772-1099)
      // ==========================================

      // Background
      ctx.fillStyle = 'rgb(10, 17, 27)';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      // Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 23px "Segoe UI", Inter, Arial, sans-serif';
      ctx.fillText('2D BILLIARDS  /  RIGID BODY DYNAMICS', 30, 48);

      // Top Buttons (PLAY, RESEARCH, RESET)
      // PLAY [P]
      ctx.fillStyle = s.research ? 'rgb(15, 45, 38)' : 'rgb(20, 75, 60)';
      ctx.strokeStyle = s.research ? 'rgb(35, 110, 85)' : 'rgb(55, 190, 140)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(690, 18, 115, 44, 4);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px "Segoe UI", Inter, sans-serif';
      ctx.fillText('PLAY [P]', 714, 46);

      // RESEARCH [R]
      ctx.fillStyle = s.research ? 'rgb(25, 75, 125)' : 'rgb(15, 40, 70)';
      ctx.strokeStyle = s.research ? 'rgb(65, 155, 230)' : 'rgb(40, 95, 150)';
      ctx.beginPath();
      ctx.roundRect(815, 18, 145, 44, 4);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px "Segoe UI", Inter, sans-serif';
      ctx.fillText('RESEARCH [R]', 828, 46);

      // RESET
      ctx.fillStyle = 'rgb(75, 35, 45)';
      ctx.strokeStyle = 'rgb(210, 85, 95)';
      ctx.beginPath();
      ctx.roundRect(970, 18, 100, 44, 4);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px "Segoe UI", Inter, sans-serif';
      ctx.fillText('RESET', 995, 46);

      // Pool Table Wood Border
      ctx.fillStyle = 'rgb(90, 52, 31)';
      ctx.strokeStyle = 'rgb(185, 125, 70)';
      ctx.lineWidth = 1.5;
      ctx.fillRect(TX - 15, TY - 15, TW + 30, TH + 30);
      ctx.strokeRect(TX - 15, TY - 15, TW + 30, TH + 30);

      // Pool Table Green Felt
      ctx.fillStyle = 'rgb(8, 112, 77)';
      ctx.strokeStyle = 'rgb(40, 190, 130)';
      ctx.fillRect(TX, TY, TW, TH);
      ctx.strokeRect(TX, TY, TW, TH);

      // 6 Pockets
      ctx.fillStyle = 'rgb(3, 6, 9)';
      for (const p of sixPockets) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 19.0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Cue stick & Aim line when stationary
      let moving = false;
      for (const b of s.balls) {
        if (length(b.vel) > 1.0) moving = true;
      }

      if (!moving && s.balls.length > 0 && !s.balls[0].pocketed) {
        const cuePos = s.balls[0].pos;
        const dir = normalize({ x: s.mouse.x - cuePos.x, y: s.mouse.y - cuePos.y });

        // Dotted aim line
        ctx.strokeStyle = 'rgb(245, 235, 190)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cuePos.x, cuePos.y);
        ctx.lineTo(cuePos.x + dir.x * 135, cuePos.y + dir.y * 135);
        ctx.stroke();

        // Wooden cue stick behind cue ball
        ctx.strokeStyle = 'rgb(190, 125, 65)';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(cuePos.x - dir.x * 65, cuePos.y - dir.y * 65);
        ctx.lineTo(cuePos.x - dir.x * 18, cuePos.y - dir.y * 18);
        ctx.stroke();
      }

      // Balls & Contact Island Halos
      const islandColors = [
        'rgb(80, 220, 170)',
        'rgb(90, 175, 255)',
        'rgb(235, 160, 255)',
        'rgb(255, 190, 90)',
        'rgb(255, 110, 130)',
        'rgb(130, 225, 245)'
      ];

      for (let i = 0; i < s.balls.length; i++) {
        const b = s.balls[i];
        if (b.pocketed) continue;

        // Island Ring
        if (s.research && s.islandIds[i] >= 0) {
          ctx.strokeStyle = islandColors[s.islandIds[i] % 6];
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(b.pos.x, b.pos.y, R + 5, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Ball Body
        ctx.fillStyle = b.color;
        ctx.strokeStyle = 'rgb(235, 240, 245)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(b.pos.x, b.pos.y, R, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // Research Collision Overlays (Normal & Impulse Vectors)
      if (s.research && s.collisionVisualTime > 0 && length(s.lastNormal) > 0.001) {
        const normalColor = 'rgb(255, 215, 55)';
        const impulseColor = 'rgb(255, 85, 75)';
        const nDir = normalize(s.lastNormal);
        const nEnd = {
          x: s.lastContactPoint.x + nDir.x * 55,
          y: s.lastContactPoint.y + nDir.y * 55
        };

        // Yellow normal line
        ctx.strokeStyle = normalColor;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(s.lastContactPoint.x, s.lastContactPoint.y);
        ctx.lineTo(nEnd.x, nEnd.y);
        ctx.stroke();

        // Normal Arrowhead
        const nSide = { x: -nDir.y, y: nDir.x };
        ctx.beginPath();
        ctx.moveTo(nEnd.x, nEnd.y);
        ctx.lineTo(nEnd.x - nDir.x * 12 + nSide.x * 7, nEnd.y - nDir.y * 12 + nSide.y * 7);
        ctx.moveTo(nEnd.x, nEnd.y);
        ctx.lineTo(nEnd.x - nDir.x * 12 - nSide.x * 7, nEnd.y - nDir.y * 12 - nSide.y * 7);
        ctx.stroke();

        // Equal & Opposite Impulses
        if (length(s.lastImpulse) > 0.001) {
          const impDir = normalize(s.lastImpulse);
          const endA = { x: s.lastBallAPos.x - impDir.x * 42, y: s.lastBallAPos.y - impDir.y * 42 };
          const endB = { x: s.lastBallBPos.x + impDir.x * 42, y: s.lastBallBPos.y + impDir.y * 42 };

          ctx.strokeStyle = impulseColor;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(s.lastBallAPos.x, s.lastBallAPos.y);
          ctx.lineTo(endA.x, endA.y);
          ctx.moveTo(s.lastBallBPos.x, s.lastBallBPos.y);
          ctx.lineTo(endB.x, endB.y);
          ctx.stroke();

          // Labels
          ctx.fillStyle = impulseColor;
          ctx.font = 'bold 11px Inter, monospace';
          ctx.fillText('IMPULSE A', endA.x + 4, endA.y - 10);
          ctx.fillText('IMPULSE B', endB.x + 4, endB.y - 10);
        }

        // Contact point circle marker
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(s.lastContactPoint.x, s.lastContactPoint.y, 5, 0, Math.PI * 2);
        ctx.fill();

        // Normal label
        ctx.fillStyle = normalColor;
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.fillText('NORMAL', nEnd.x + 5, nEnd.y - 8);
      }

      // ==========================================
      // DASHBOARD (Right Sidebar, main.cpp:1000-1090)
      // ==========================================
      const DX = 850;
      const DY = 100;
      const DW = 320;
      const DH = 570;

      // Dashboard Box
      ctx.fillStyle = 'rgb(17, 28, 43)';
      ctx.strokeStyle = 'rgb(55, 80, 105)';
      ctx.lineWidth = 1.5;
      ctx.fillRect(DX, DY, DW, DH);
      ctx.strokeRect(DX, DY, DW, DH);

      // Header
      ctx.fillStyle = 'rgb(100, 190, 255)';
      ctx.font = 'bold 18px "Segoe UI", Inter, sans-serif';
      ctx.fillText(s.research ? 'RESEARCH DASHBOARD' : 'PLAY DASHBOARD', DX + 20, DY + 30);

      // Controls Header
      ctx.fillStyle = 'rgb(80, 210, 165)';
      ctx.font = 'bold 15px "Segoe UI", Inter, sans-serif';
      ctx.fillText('CONTROLS', DX + 20, DY + 65);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '13px "Segoe UI", Inter, monospace';
      ctx.fillText('Click table : Aim and shoot', DX + 20, DY + 90);
      ctx.fillText('UP / DOWN   : Change power', DX + 20, DY + 112);
      ctx.fillText('R           : Research mode', DX + 20, DY + 134);
      ctx.fillText('P           : Play mode', DX + 20, DY + 156);
      ctx.fillText('SPACE       : Pause / resume', DX + 20, DY + 178);
      ctx.fillText('BACKSPACE   : Reset table', DX + 20, DY + 200);

      // Divider 1
      ctx.strokeStyle = 'rgb(65, 85, 110)';
      ctx.beginPath();
      ctx.moveTo(DX + 20, DY + 225);
      ctx.lineTo(DX + 295, DY + 225);
      ctx.stroke();

      // Shot Power
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px "Segoe UI", Inter, sans-serif';
      ctx.fillText('SHOT POWER', DX + 20, DY + 248);

      // Power Gauge
      ctx.fillStyle = 'rgb(35, 45, 60)';
      ctx.strokeStyle = 'rgb(70, 90, 110)';
      ctx.fillRect(DX + 20, DY + 265, 260, 13);
      ctx.strokeRect(DX + 20, DY + 265, 260, 13);

      ctx.fillStyle = 'rgb(45, 190, 145)';
      ctx.fillRect(DX + 20, DY + 265, 260 * (s.power / 800), 13);

      // Divider 2
      ctx.strokeStyle = 'rgb(65, 85, 110)';
      ctx.beginPath();
      ctx.moveTo(DX + 20, DY + 298);
      ctx.lineTo(DX + 295, DY + 298);
      ctx.stroke();

      // Algorithm Toggle Label
      ctx.fillStyle = s.proposedMode ? 'rgb(80, 210, 165)' : 'rgb(255, 190, 90)';
      ctx.font = 'bold 14px "Segoe UI", Inter, sans-serif';
      ctx.fillText(
        `Algorithm: ${s.proposedMode ? 'PROPOSED [B]' : 'BASELINE [B]'}`,
        DX + 20,
        DY + 320
      );

      // Live Status Header
      ctx.fillStyle = 'rgb(80, 210, 165)';
      ctx.font = 'bold 14px "Segoe UI", Inter, sans-serif';
      ctx.fillText('LIVE STATUS', DX + 20, DY + 344);

      let remaining = 0;
      for (const b of s.balls) if (!b.pocketed) remaining++;

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '13px "Segoe UI", Inter, monospace';
      ctx.fillText(`Balls remaining: ${remaining}`, DX + 20, DY + 368);
      ctx.fillText(`Collision checks: ${s.collisionChecks}`, DX + 20, DY + 390);
      ctx.fillText(`Active contacts: ${s.contacts}`, DX + 20, DY + 412);

      ctx.fillStyle = 'rgb(80, 210, 165)';
      ctx.fillText(`CONTACT ISLANDS: ${s.islandCount}`, DX + 20, DY + 434);

      ctx.fillStyle = 'rgb(255, 190, 90)';
      ctx.fillText(`Cached contacts: ${s.cachedContacts}`, DX + 20, DY + 456);

      // Rolling Averages
      ctx.fillStyle = 'rgb(180, 200, 220)';
      ctx.font = '11px "Segoe UI", Inter, monospace';
      const avgChecksStr = s.measurementReady
        ? `Avg checks/frame: ${s.averageChecksPerFrame.toFixed(1)}`
        : `Avg checks/frame: collecting ${s.measurementFrames}/${MEASUREMENT_WINDOW_FRAMES}`;
      ctx.fillText(avgChecksStr, DX + 20, DY + 478);

      const avgPhysStr = s.measurementReady
        ? `Avg physics ms/frame: ${s.averagePhysicsMsPerFrame.toFixed(3)}`
        : `Avg physics ms/frame: collecting...`;
      ctx.fillText(avgPhysStr, DX + 20, DY + 496);

      ctx.fillStyle = '#94a3b8';
      ctx.fillText(s.paused ? 'Simulation: PAUSED' : 'Simulation: RUNNING', DX + 20, DY + 514);
      ctx.fillText(s.research ? 'Research overlays: ON' : 'Research overlays: OFF', DX + 20, DY + 530);

      // Bottom Helper Text
      ctx.fillStyle = 'rgb(170, 190, 205)';
      ctx.font = '15px "Segoe UI", Inter, sans-serif';
      ctx.fillText('Click shoot | B baseline/proposed | SPACE pause | ESC quit', 35, 725);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [WIDTH, HEIGHT, TX, TY, TW, TH, R]);

  return (
    <div ref={containerRef} className="relative w-full max-w-7xl mx-auto my-6 p-2 sm:p-4 rounded-3xl bg-slatebg-900 border border-slate-800 shadow-2xl">
      {/* Interactive Top Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-950/80 rounded-2xl border border-slate-800/80 mb-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold text-white tracking-wide text-sm">Interactive Game Engine</span>
          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono text-[11px] border border-emerald-500/30">
            Playable Directly on Website
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick HUD controls */}
          <button
            onClick={() => setResearch(!researchMode)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              researchMode ? 'bg-cyan-950 border border-cyan-500/40 text-cyan-300' : 'bg-slate-900 text-slate-300 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{researchMode ? 'Research [R] Active' : 'Play Mode [P]'}</span>
          </button>

          <button
            onClick={toggleAlgorithm}
            className={`px-3 py-1.5 rounded-lg font-mono font-semibold transition-colors ${
              proposedMode ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300' : 'bg-amber-950 border border-amber-500/40 text-amber-300'
            }`}
          >
            Algorithm: {proposedMode ? 'PROPOSED [B]' : 'BASELINE [B]'}
          </button>

          <button
            onClick={togglePause}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1.5"
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isPaused ? 'Resume [Space]' : 'Pause [Space]'}</span>
          </button>

          <button
            onClick={resetGame}
            className="px-3 py-1.5 rounded-lg bg-rose-950/70 hover:bg-rose-900 border border-rose-600/40 text-rose-200 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset [Backspace]</span>
          </button>

          <button
            onClick={handleFullscreenToggle}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Game Canvas Container */}
      <div className="relative w-full aspect-[1200/760] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner">
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          onMouseMove={handleMouseMove}
          onClick={handleCanvasClick}
          onTouchStart={handleCanvasClick}
          className="w-full h-full object-contain cursor-crosshair select-none block"
        />
      </div>

      {/* Real-time Quick Reference strip */}
      <div className="mt-3 px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
        <div className="flex items-center gap-4">
          <span><strong className="text-white">Click & Aim:</strong> Point from cue ball and click</span>
          <span><strong className="text-white">Power:</strong> {power} / 800 (Use Up/Down)</span>
          <span><strong className="text-white">Active Balls:</strong> {ballsRemaining}</span>
        </div>
        <div className="flex items-center gap-3 font-mono">
          <span className="text-emerald-400">DSU Islands: {islandCountLive}</span>
          <span className="text-amber-400">Checks: {collisionChecksLive}</span>
          <span className="text-teal-300">
            {avgChecksPerFrame !== null ? `300-Frame Avg: ${avgChecksPerFrame.toFixed(1)} checks/frame` : `Collecting ${collectingCount}/300`}
          </span>
        </div>
      </div>
    </div>
  );
};
