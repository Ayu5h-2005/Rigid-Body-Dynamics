#include <SFML/Graphics.hpp>

#include <algorithm>

#include <cmath>

#include <chrono>

#include <iomanip>
#include <map>

#include <sstream>

#include <string>

#include <utility>

#include <vector>

constexpr unsigned WIDTH = 1200;

constexpr unsigned HEIGHT = 760;

constexpr float TX = 30.f;

constexpr float TY = 100.f;

constexpr float TW = 790.f;

constexpr float TH = 570.f;

constexpr float R = 12.f;

struct Ball {

    sf::Vector2f pos, vel;

    sf::Color color;

    bool pocketed = false;

};

float length(sf::Vector2f v) {

    return std::sqrt(v.x*v.x + v.y*v.y);

}

float dot(sf::Vector2f a, sf::Vector2f b) {

    return a.x*b.x + a.y*b.y;

}

sf::Vector2f normalize(sf::Vector2f v) {

    float l = length(v);

    return l > 0.001f ? v/l : sf::Vector2f{1.f, 0.f};

}

int main() {

    sf::RenderWindow window(

        sf::VideoMode({WIDTH, HEIGHT}),

        "2D Billiards - Rigid Body Dynamics"

    );

    window.setFramerateLimit(60);

    sf::Font font;

    if (!font.openFromFile("C:/Windows/Fonts/arial.ttf")) {

        return 1;

    }

    std::vector<Ball> balls;

    bool research = true;

    bool paused = false;

    float power = 420.f;

    int collisionChecks = 0;

    int contacts = 0;

    int cachedContacts = 0;

    bool proposedMode = false; // B toggles Baseline / Proposed

    double physicsMs = 0.0;

    double smoothedPhysicsMs = 0.0; // Retained for live feedback.

    // Research measurement window: averages over 300 active rendered frames.
    static constexpr int MEASUREMENT_WINDOW_FRAMES = 300;
    int measurementFrames = 0;
    long long measurementCollisionChecks = 0;
    double measurementPhysicsMs = 0.0;
    double averageChecksPerFrame = 0.0;
    double averagePhysicsMsPerFrame = 0.0;
    bool measurementReady = false;

    std::vector<std::pair<std::size_t, std::size_t>> previousContactPairs;

    std::vector<std::pair<std::size_t, std::size_t>> currentContactPairs;

    // Research visualization: last collision

    sf::Vector2f lastContactPoint{0.f, 0.f};

    sf::Vector2f lastNormal{0.f, 0.f};

    sf::Vector2f lastImpulse{0.f, 0.f};

    sf::Vector2f lastBallAPos{0.f, 0.f};

    sf::Vector2f lastBallBPos{0.f, 0.f};

    float collisionVisualTime = 0.f;

    auto reset = [&]() {

        balls.clear();

        previousContactPairs.clear();

        currentContactPairs.clear();

        cachedContacts = 0;

        balls.push_back({

            {TX + 170.f, TY + TH/2.f},

            {0.f, 0.f},

            sf::Color::White

        });

        sf::Color colors[] = {

            sf::Color(245,190,45), sf::Color(220,65,65),

            sf::Color(65,135,245), sf::Color(170,90,220),

            sf::Color(50,190,140), sf::Color(245,130,45),

            sf::Color(240,220,180), sf::Color(70,75,90)

        };

        for (int i = 0; i < 8; ++i) {

            int col = i/3;

            int row = i%3;

            balls.push_back({

                {TX+500.f+col*27.f,

                 TY+TH/2.f+(row-1)*27.f},

                {0.f,0.f},

                colors[i]

            });

        }

    };

    reset();

    sf::Clock clock;

    float accumulator = 0.f;

    const float dt = 1.f/120.f;

    sf::Vector2f mouse{0.f,0.f};

    auto drawText = [&](const std::string& s,

                        float x, float y, unsigned size,

                        sf::Color color = sf::Color::White) {

        sf::Text t(font, s, size);

        t.setPosition({x,y});

        t.setFillColor(color);

        window.draw(t);

    };

    auto box = [&](float x, float y, float w, float h,

                   sf::Color fill, sf::Color outline) {

        sf::RectangleShape shape({w,h});

        shape.setPosition({x,y});

        shape.setFillColor(fill);

        shape.setOutlineColor(outline);

        shape.setOutlineThickness(1.5f);

        window.draw(shape);

    };

    auto drawLine = [&](sf::Vector2f a, sf::Vector2f b,

                        sf::Color color, float thickness = 2.f) {

        sf::Vector2f d = b-a;

        float len = length(d);

        if (len < 0.1f) return;

        sf::RectangleShape shape({len, thickness});

        shape.setOrigin({0.f, thickness/2.f});

        shape.setPosition(a);

        shape.setRotation(sf::radians(std::atan2(d.y,d.x)));

        shape.setFillColor(color);

        window.draw(shape);

    };

    while (window.isOpen()) {

        float frameTime = std::min(clock.restart().asSeconds(), 0.05f);

        if (!paused) {

            collisionVisualTime =

                std::max(0.f, collisionVisualTime - frameTime);

        }

        while (auto event = window.pollEvent()) {

            if (event->is<sf::Event::Closed>())

                window.close();

            if (auto key = event->getIf<sf::Event::KeyPressed>()) {

                if (key->code == sf::Keyboard::Key::Escape)

                    window.close();

                if (key->code == sf::Keyboard::Key::R)

                    research = true;

                if (key->code == sf::Keyboard::Key::B) {

                    proposedMode = !proposedMode;

                    previousContactPairs.clear();

                    currentContactPairs.clear();

                    cachedContacts = 0;

                    // Start a fresh measurement window when switching algorithms.
                    measurementFrames = 0;
                    measurementCollisionChecks = 0;
                    measurementPhysicsMs = 0.0;
                    averageChecksPerFrame = 0.0;
                    averagePhysicsMsPerFrame = 0.0;
                    measurementReady = false;
                    smoothedPhysicsMs = 0.0;

                }

                if (key->code == sf::Keyboard::Key::P)

                    research = false;

                if (key->code == sf::Keyboard::Key::Space)

                    paused = !paused;

                if (key->code == sf::Keyboard::Key::Up)

                    power = std::min(800.f, power+30.f);

                if (key->code == sf::Keyboard::Key::Down)

                    power = std::max(100.f, power-30.f);

                if (key->code == sf::Keyboard::Key::Backspace)

                    reset();

            }

            if (auto m = event->getIf<sf::Event::MouseButtonPressed>()) {

                sf::Vector2f click{

                    static_cast<float>(m->position.x),

                    static_cast<float>(m->position.y)

                };

                if (click.y < 70.f) {

                    if (click.x >= 690.f && click.x < 810.f)

                        research = false;

                    else if (click.x >= 810.f && click.x < 960.f)

                        research = true;

                    else if (click.x >= 960.f && click.x < 1070.f)

                        reset();

                }

                else if (click.x > TX && click.x < TX+TW &&

                         click.y > TY && click.y < TY+TH &&

                         !paused && !balls[0].pocketed) {

                    bool moving = false;

                    for (const auto& b : balls)

                        if (length(b.vel) > 1.f) moving = true;

                    if (!moving) {

                        balls[0].vel =

                            normalize(click-balls[0].pos)*power;

                    }

                }

            }

        }

        auto mp = sf::Mouse::getPosition(window);

        mouse = {static_cast<float>(mp.x),

                 static_cast<float>(mp.y)};

        collisionChecks = 0;

        contacts = 0;

        const auto physicsStart = std::chrono::steady_clock::now();

        if (!paused) {

            accumulator += frameTime;

            while (accumulator >= dt) {

                // Temporal coherence: collect this step's touching ball pairs.

                currentContactPairs.clear();

                // Move balls and handle cushions.

                for (auto& b : balls) {

                    if (b.pocketed) continue;

                    b.pos += b.vel*dt;

                    b.vel *= 0.997f;

                    if (length(b.vel) < 4.f)

                        b.vel = {0.f,0.f};

                    float left = TX+R;

                    float right = TX+TW-R;

                    float top = TY+R;

                    float bottom = TY+TH-R;

                    if (b.pos.x < left) {

                        b.pos.x = left;

                        b.vel.x = std::abs(b.vel.x)*0.94f;

                    }

                    if (b.pos.x > right) {

                        b.pos.x = right;

                        b.vel.x = -std::abs(b.vel.x)*0.94f;

                    }

                    if (b.pos.y < top) {

                        b.pos.y = top;

                        b.vel.y = std::abs(b.vel.y)*0.94f;

                    }

                    if (b.pos.y > bottom) {

                        b.pos.y = bottom;

                        b.vel.y = -std::abs(b.vel.y)*0.94f;

                    }

                }

                // Equal-mass ball-ball impulse response.
                // Baseline checks every pair. Proposed checks candidates from nearby grid cells.
                std::vector<std::pair<std::size_t, std::size_t>> pairOrder;
                const std::size_t ballCount = balls.size();

                if (!proposedMode) {
                    // Baseline: test every unique ball pair.
                    pairOrder.reserve(ballCount * (ballCount > 0 ? ballCount - 1 : 0) / 2);
                    for (std::size_t i = 0; i < ballCount; ++i) {
                        for (std::size_t j = i + 1; j < ballCount; ++j) {
                            pairOrder.emplace_back(i, j);
                        }
                    }
                } else {
                    // Proposed: broad phase using a uniform spatial grid.
                    // Cell size is slightly larger than a ball diameter. Any overlapping
                    // pair must therefore be in the same cell or one of its 8 neighbors.
                    const float cellSize = 2.f * R + 1.5f;
                    using Cell = std::pair<int, int>;
                    std::map<Cell, std::vector<std::size_t>> grid;

                    auto cellFor = [cellSize](sf::Vector2f pos) -> Cell {
                        return {
                            static_cast<int>(std::floor(pos.x / cellSize)),
                            static_cast<int>(std::floor(pos.y / cellSize))
                        };
                    };

                    for (std::size_t i = 0; i < ballCount; ++i) {
                        if (!balls[i].pocketed) {
                            grid[cellFor(balls[i].pos)].push_back(i);
                        }
                    }

                    // Keep previously observed contact pairs in the candidate list.
                    // This supports temporal coherence; the grid is the main optimization.
                    for (const auto& pair : previousContactPairs) {
                        if (pair.first < ballCount && pair.second < ballCount &&
                            !balls[pair.first].pocketed && !balls[pair.second].pocketed) {
                            pairOrder.push_back(pair);
                        }
                    }

                    // Collect pairs from the same cell and the 8 neighboring cells.
                    for (const auto& entry : grid) {
                        const int cx = entry.first.first;
                        const int cy = entry.first.second;
                        for (int dx = -1; dx <= 1; ++dx) {
                            for (int dy = -1; dy <= 1; ++dy) {
                                const auto neighbor = grid.find({cx + dx, cy + dy});
                                if (neighbor == grid.end()) continue;
                                for (std::size_t i : entry.second) {
                                    for (std::size_t j : neighbor->second) {
                                        if (i < j) pairOrder.emplace_back(i, j);
                                    }
                                }
                            }
                        }
                    }

                    // A pair may be found via both cells or already be cached.
                    std::sort(pairOrder.begin(), pairOrder.end());
                    pairOrder.erase(std::unique(pairOrder.begin(), pairOrder.end()), pairOrder.end());
                }

                for (const auto& pair : pairOrder) {

                    const std::size_t i = pair.first;

                    const std::size_t j = pair.second;

                    auto& a = balls[i];

                    auto& b = balls[j];

                        if (a.pocketed || b.pocketed) continue;

                        ++collisionChecks;

                        sf::Vector2f delta = b.pos-a.pos;

                        float dist = length(delta);

                        if (dist < 0.001f)

                            continue;

                        // Track touching or nearly touching pairs for temporal coherence.

                        if (dist <= 2.f * R + 1.5f) {

                            currentContactPairs.emplace_back(i, j);

                        }

                        // Only resolve an actual overlap.

                        if (dist >= 2.f * R)

                            continue;

                        ++contacts;

                        sf::Vector2f n = delta/dist;

                        float relative = dot(b.vel-a.vel,n);

                        // Store collision information for the research overlay.

                        if (research) {

                            lastContactPoint = (a.pos + b.pos) / 2.f;

                            lastBallAPos = a.pos;

                            lastBallBPos = b.pos;

                            lastNormal = n;

                            collisionVisualTime = 3.0f;

                        }

                        if (relative < 0.f) {

                            float jImpulse =

                                -(1.f + 0.94f) * relative / 2.f;

                            lastImpulse = n * jImpulse;

                            // Apply the impulse to both balls.

                            a.vel -= n * jImpulse;

                            b.vel += n * jImpulse;

                        }

                        float overlap = 2.f*R-dist;

                        a.pos -= n*(overlap/2.f);

                        b.pos += n*(overlap/2.f);

                    }

                    // Six pockets.

                sf::Vector2f pockets[] = {

                    {TX,TY}, {TX+TW/2.f,TY}, {TX+TW,TY},

                    {TX,TY+TH}, {TX+TW/2.f,TY+TH},

                    {TX+TW,TY+TH}

                };

                for (auto& b : balls) {

                    if (b.pocketed) continue;

                    for (auto p : pockets) {

                        if (length(b.pos-p) < 19.f) {

                            b.pocketed = true;

                            b.vel = {0.f,0.f};

                            break;

                        }

                    }

                }

                // Count ball pairs that remain in contact across physics steps.

                cachedContacts = 0;

                for (const auto& pair : currentContactPairs) {

                    if (std::find(previousContactPairs.begin(),

                                  previousContactPairs.end(), pair)

                        != previousContactPairs.end()) {

                        ++cachedContacts;

                    }

                }

                previousContactPairs = currentContactPairs;

                accumulator -= dt;

            }

        }

        const auto physicsEnd = std::chrono::steady_clock::now();

        physicsMs = std::chrono::duration<double, std::milli>(physicsEnd - physicsStart).count();

        smoothedPhysicsMs = (smoothedPhysicsMs == 0.0) ? physicsMs : (0.9 * smoothedPhysicsMs + 0.1 * physicsMs);

        // Accumulate comparable measurements only while the simulation is running.
        // collisionChecks is the number of exact pair-distance checks this frame.
        if (!paused) {
            ++measurementFrames;
            measurementCollisionChecks += collisionChecks;
            measurementPhysicsMs += physicsMs;

            if (measurementFrames >= MEASUREMENT_WINDOW_FRAMES) {
                averageChecksPerFrame = static_cast<double>(measurementCollisionChecks) /
                                        static_cast<double>(measurementFrames);
                averagePhysicsMsPerFrame = measurementPhysicsMs /
                                           static_cast<double>(measurementFrames);
                measurementReady = true;

                // Begin the next fixed-size measurement window.
                measurementFrames = 0;
                measurementCollisionChecks = 0;
                measurementPhysicsMs = 0.0;
            }
        }

        // Build contact islands (connected groups of touching balls).

        // An island is a connected group of at least TWO balls; isolated

        // balls are deliberately not counted as contact islands.

        std::vector<std::size_t> islandParent(balls.size());

        for (std::size_t i = 0; i < balls.size(); ++i) islandParent[i] = i;

        auto findIslandRoot = [&](std::size_t x) {

            while (islandParent[x] != x) {

                islandParent[x] = islandParent[islandParent[x]];

                x = islandParent[x];

            }

            return x;

        };

        for (std::size_t i = 0; i < balls.size(); ++i) {

            if (balls[i].pocketed) continue;

            for (std::size_t j = i + 1; j < balls.size(); ++j) {

                if (balls[j].pocketed) continue;

                if (length(balls[j].pos - balls[i].pos) <= 2.f * R + 1.5f) {

                    const std::size_t rootA = findIslandRoot(i);

                    const std::size_t rootB = findIslandRoot(j);

                    if (rootA != rootB) islandParent[rootB] = rootA;

                }

            }

        }

        std::vector<std::size_t> componentSizes(balls.size(), 0);

        for (std::size_t i = 0; i < balls.size(); ++i) {

            if (!balls[i].pocketed) ++componentSizes[findIslandRoot(i)];

        }

        std::vector<int> islandIds(balls.size(), -1);

        std::vector<std::size_t> islandRoots;

        for (std::size_t i = 0; i < balls.size(); ++i) {

            if (balls[i].pocketed) continue;

            const std::size_t root = findIslandRoot(i);

            if (componentSizes[root] < 2) continue;

            auto it = std::find(islandRoots.begin(), islandRoots.end(), root);

            if (it == islandRoots.end()) {

                islandRoots.push_back(root);

                islandIds[i] = static_cast<int>(islandRoots.size()) - 1;

            } else {

                islandIds[i] = static_cast<int>(it - islandRoots.begin());

            }

        }

        const int islandCount = static_cast<int>(islandRoots.size());

        // Draw the interface.

        window.clear(sf::Color(10,17,27));

        drawText("2D BILLIARDS  /  RIGID BODY DYNAMICS",

                 30,25,23);

        box(690,18,115,44,{20,75,60},{55,190,140});

        drawText("PLAY [P]",710,30,16);

        box(815,18,145,44,{25,75,125},{65,155,230});

        drawText("RESEARCH [R]",823,30,15);

        box(970,18,100,44,{75,35,45},{210,85,95});

        drawText("RESET",990,30,16);

        // Pool table.

        box(TX-15,TY-15,TW+30,TH+30,

            {90,52,31},{185,125,70});

        box(TX,TY,TW,TH,

            {8,112,77},{40,190,130});

        sf::Vector2f pockets[] = {

            {TX,TY}, {TX+TW/2.f,TY}, {TX+TW,TY},

            {TX,TY+TH}, {TX+TW/2.f,TY+TH},

            {TX+TW,TY+TH}

        };

        for (auto p : pockets) {

            sf::CircleShape hole(19.f);

            hole.setOrigin({19.f,19.f});

            hole.setPosition(p);

            hole.setFillColor({3,6,9});

            window.draw(hole);

        }

        bool moving = false;

        for (const auto& b : balls)

            if (length(b.vel) > 1.f) moving = true;

        if (!moving && !balls[0].pocketed) {

            sf::Vector2f direction =

                normalize(mouse-balls[0].pos);

            drawLine(balls[0].pos,

                     balls[0].pos+direction*135.f,

                     {245,235,190},1.5f);

            drawLine(balls[0].pos-direction*65.f,

                     balls[0].pos-direction*18.f,

                     {190,125,65},5.f);

        }

        for (std::size_t ballIndex = 0; ballIndex < balls.size(); ++ballIndex) {

            const auto& b = balls[ballIndex];

            if (b.pocketed) continue;

            // Colored outline identifies this ball's contact island in Research mode.

            if (research && islandIds[ballIndex] >= 0) {

                const sf::Color islandColors[] = {

                    sf::Color(80, 220, 170), sf::Color(90, 175, 255),

                    sf::Color(235, 160, 255), sf::Color(255, 190, 90),

                    sf::Color(255, 110, 130), sf::Color(130, 225, 245)

                };

                sf::CircleShape ring(R + 5.f);

                ring.setOrigin({R + 5.f, R + 5.f});

                ring.setPosition(b.pos);

                ring.setFillColor(sf::Color::Transparent);

                ring.setOutlineColor(islandColors[islandIds[ballIndex] % 6]);

                ring.setOutlineThickness(2.f);

                window.draw(ring);

            }

            sf::CircleShape ball(R);

            ball.setOrigin({R,R});

            ball.setPosition(b.pos);

            ball.setFillColor(b.color);

            ball.setOutlineColor({235,240,245});

            ball.setOutlineThickness(1.f);

            window.draw(ball);

        }

        // Research overlay: show the most recent real ball collision.

        if (research && collisionVisualTime > 0.f &&

            length(lastNormal) > 0.001f) {

            const sf::Color normalColor(255, 215, 55);

            const sf::Color impulseColor(255, 85, 75);

            const sf::Vector2f normalDir = normalize(lastNormal);

            const sf::Vector2f normalEnd = lastContactPoint + normalDir * 55.f;

            // Yellow normal line and arrowhead.

            drawLine(lastContactPoint, normalEnd, normalColor, 4.f);

            const sf::Vector2f normalSide(-normalDir.y, normalDir.x);

            drawLine(normalEnd, normalEnd - normalDir * 12.f + normalSide * 7.f,

                     normalColor, 4.f);

            drawLine(normalEnd, normalEnd - normalDir * 12.f - normalSide * 7.f,

                     normalColor, 4.f);

            // Equal-and-opposite impulses: A gets -J, B gets +J.

            if (length(lastImpulse) > 0.001f) {

                const sf::Vector2f impulseDir = normalize(lastImpulse);

                const sf::Vector2f impulseOnA = impulseDir * -1.f;

                const sf::Vector2f impulseOnB = impulseDir;

                // Draw each impulse from the corresponding ball's saved center.

                const sf::Vector2f endA = lastBallAPos + impulseOnA * 42.f;

                const sf::Vector2f endB = lastBallBPos + impulseOnB * 42.f;

                drawLine(lastBallAPos, endA, impulseColor, 4.f);

                drawLine(lastBallBPos, endB, impulseColor, 4.f);

                const sf::Vector2f sideA(-impulseOnA.y, impulseOnA.x);

                const sf::Vector2f sideB(-impulseOnB.y, impulseOnB.x);

                drawLine(endA, endA - impulseOnA * 10.f + sideA * 6.f,

                         impulseColor, 4.f);

                drawLine(endA, endA - impulseOnA * 10.f - sideA * 6.f,

                         impulseColor, 4.f);

                drawLine(endB, endB - impulseOnB * 10.f + sideB * 6.f,

                         impulseColor, 4.f);

                drawLine(endB, endB - impulseOnB * 10.f - sideB * 6.f,

                         impulseColor, 4.f);

                drawText("IMPULSE A", endA.x + 4.f, endA.y - 16.f,

                         11, impulseColor);

                drawText("IMPULSE B", endB.x + 4.f, endB.y - 16.f,

                         11, impulseColor);

            }

            // Mark the contact point and label the normal.

            sf::CircleShape marker(5.f);

            marker.setOrigin({5.f, 5.f});

            marker.setPosition(lastContactPoint);

            marker.setFillColor(sf::Color::White);

            window.draw(marker);

            drawText("NORMAL", normalEnd.x + 5.f, normalEnd.y - 12.f,

                     12, normalColor);

        }

        // Dashboard.

        box(850,100,320,570,{17,28,43},{55,80,105});

        drawText(research ? "RESEARCH DASHBOARD" :

                            "PLAY DASHBOARD",

                 870,120,20,{100,190,255});

        drawText("CONTROLS",870,170,17,{80,210,165});

        drawText("Click table : Aim and shoot",870,200,15);

        drawText("UP / DOWN   : Change power",870,225,15);

        drawText("R           : Research mode",870,250,15);

        drawText("P           : Play mode",870,275,15);

        drawText("SPACE       : Pause / resume",870,300,15);

        drawText("BACKSPACE   : Reset table",870,325,15);

        drawLine({870,355},{1145,355},{65,85,110});

        drawText("SHOT POWER",870,370,17);

        box(870,400,260,13,{35,45,60},{70,90,110});

        box(870,400,260.f*(power/800.f),13,

            {45,190,145},{45,190,145});

        drawLine({870,440},{1145,440},{65,85,110});

        drawText(std::string("Algorithm: ") + (proposedMode ? "PROPOSED [B]" : "BASELINE [B]"),

                 870,450,14,proposedMode ? sf::Color(80,210,165) : sf::Color(255,190,90));

        drawText("LIVE STATUS",870,474,15,{80,210,165});

        int remaining = 0;

        for (const auto& b : balls)

            if (!b.pocketed) ++remaining;

        drawText("Balls remaining: "+std::to_string(remaining),

                 870,499,14);

        drawText("Collision checks: "+std::to_string(collisionChecks),

                 870,522,14);

        drawText("Active contacts: "+std::to_string(contacts),

                 870,545,14);

        drawText("CONTACT ISLANDS: "+std::to_string(islandCount),

                 870,568,14,{80,210,165});

        drawText("Cached contacts: "+std::to_string(cachedContacts),

                 870,591,14,{255,190,90});

        std::ostringstream checksAverageLabel;
        checksAverageLabel << "Avg checks/frame: ";
        if (measurementReady) {
            checksAverageLabel << std::fixed << std::setprecision(1)
                               << averageChecksPerFrame;
        } else {
            checksAverageLabel << "collecting " << measurementFrames << "/"
                               << MEASUREMENT_WINDOW_FRAMES;
        }
        drawText(checksAverageLabel.str(),870,613,11,{180,200,220});

        std::ostringstream physicsLabel;
        physicsLabel << "Avg physics ms/frame: ";
        if (measurementReady) {
            physicsLabel << std::fixed << std::setprecision(3)
                         << averagePhysicsMsPerFrame;
        } else {
            physicsLabel << "collecting...";
        }
        drawText(physicsLabel.str(),870,631,11,{180,200,220});

        drawText(paused ? "Simulation: PAUSED" : "Simulation: RUNNING",
                 870,649,11);

        drawText(research ? "Research overlays: ON" :
                            "Research overlays: OFF",
                 870,663,10);

        drawText("Click shoot | B baseline/proposed | SPACE pause | ESC quit",

                 35,710,16,{170,190,205});

        window.display();

    }

    return 0;

}
