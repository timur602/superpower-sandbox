// ======================================================
// level.js
// Ten progressively harder levels
// ======================================================

const TILE_SIZE = 64;
const LEVEL_WIDTH = 64;
const LEVEL_HEIGHT = 22;

function createEmptyGrid() {
    return Array.from(
        { length: LEVEL_HEIGHT },
        () => Array(LEVEL_WIDTH).fill(".")
    );
}

function addPlatform(grid, row, start, length, type = "#") {
    for (let col = start; col < start + length; col++) {
        if (
            row >= 0 && row < LEVEL_HEIGHT &&
            col >= 0 && col < LEVEL_WIDTH
        ) {
            grid[row][col] = type;
        }
    }
}

function addEntity(grid, row, col, symbol) {
    if (
        row >= 0 && row < LEVEL_HEIGHT &&
        col >= 0 && col < LEVEL_WIDTH
    ) {
        grid[row][col] = symbol;
    }
}

function buildLevel(definition) {
    const grid = createEmptyGrid();

    // Every level has a safe base floor.
    addPlatform(grid, LEVEL_HEIGHT - 1, 0, LEVEL_WIDTH, definition.groundType || "#");

    for (const platform of definition.platforms) {
        addPlatform(
            grid,
            platform.row,
            platform.start,
            platform.length,
            platform.type || definition.platformType || "#"
        );
    }

    addEntity(grid, definition.player.row, definition.player.col, "P");

    for (const enemy of definition.enemies) {
        addEntity(grid, enemy.row, enemy.col, "E");
    }

    return grid.map(row => row.join(""));
}

const LEVEL_DEFINITIONS = [
    {
        name: "Training Grounds",
        difficulty: "Beginner",
        background: "#87CEEB",
        groundType: "#",
        platformType: "#",
        enemyHealth: 70,
        enemySpeed: 1.35,
        contactDamage: 0.06,
        player: { row: 20, col: 3 },
        platforms: [
            { row: 17, start: 8, length: 8 },
            { row: 14, start: 21, length: 7 },
            { row: 11, start: 35, length: 7 },
            { row: 8, start: 48, length: 7 }
        ],
        enemies: [
            { row: 20, col: 22 },
            { row: 10, col: 39 }
        ]
    },
    {
        name: "City Rooftops",
        difficulty: "Easy",
        background: "#9AD7F0",
        groundType: "B",
        platformType: "B",
        enemyHealth: 82,
        enemySpeed: 1.55,
        contactDamage: 0.075,
        player: { row: 20, col: 4 },
        platforms: [
            { row: 18, start: 10, length: 7 },
            { row: 15, start: 22, length: 8 },
            { row: 12, start: 36, length: 7 },
            { row: 9, start: 49, length: 8 },
            { row: 6, start: 28, length: 6 }
        ],
        enemies: [
            { row: 20, col: 18 },
            { row: 14, col: 26 },
            { row: 8, col: 53 }
        ]
    },
    {
        name: "Mountain Pass",
        difficulty: "Easy+",
        background: "#B9DDF2",
        groundType: "S",
        platformType: "S",
        enemyHealth: 94,
        enemySpeed: 1.75,
        contactDamage: 0.09,
        player: { row: 20, col: 3 },
        platforms: [
            { row: 18, start: 8, length: 6 },
            { row: 15, start: 17, length: 6 },
            { row: 12, start: 27, length: 6 },
            { row: 9, start: 38, length: 6 },
            { row: 6, start: 50, length: 7 },
            { row: 16, start: 47, length: 5 }
        ],
        enemies: [
            { row: 20, col: 17 },
            { row: 14, col: 20 },
            { row: 11, col: 30 },
            { row: 5, col: 54 }
        ]
    },
    {
        name: "Forest Ruins",
        difficulty: "Medium",
        background: "#9FD5B5",
        groundType: "#",
        platformType: "W",
        enemyHealth: 108,
        enemySpeed: 1.95,
        contactDamage: 0.105,
        player: { row: 20, col: 4 },
        platforms: [
            { row: 18, start: 11, length: 6, type: "W" },
            { row: 15, start: 21, length: 7, type: "S" },
            { row: 12, start: 33, length: 6, type: "W" },
            { row: 9, start: 45, length: 8, type: "S" },
            { row: 6, start: 26, length: 6, type: "W" },
            { row: 16, start: 52, length: 6, type: "W" }
        ],
        enemies: [
            { row: 20, col: 18 },
            { row: 17, col: 14 },
            { row: 20, col: 58 },
            { row: 11, col: 36 },
            { row: 8, col: 49 }
        ]
    },
    {
        name: "Industrial Zone",
        difficulty: "Medium+",
        background: "#AAB7C4",
        groundType: "S",
        platformType: "B",
        enemyHealth: 122,
        enemySpeed: 2.15,
        contactDamage: 0.12,
        player: { row: 20, col: 3 },
        platforms: [
            { row: 18, start: 8, length: 8, type: "B" },
            { row: 15, start: 20, length: 8, type: "S" },
            { row: 12, start: 33, length: 8, type: "B" },
            { row: 9, start: 47, length: 9, type: "S" },
            { row: 6, start: 31, length: 7, type: "B" },
            { row: 16, start: 51, length: 7, type: "B" }
        ],
        enemies: [
            { row: 20, col: 18 },
            { row: 17, col: 12 },
            { row: 20, col: 48 },
            { row: 14, col: 24 },
            { row: 11, col: 37 },
            { row: 8, col: 52 }
        ]
    },
    {
        name: "Sky Bridges",
        difficulty: "Hard",
        background: "#74C8F2",
        groundType: "S",
        platformType: "W",
        enemyHealth: 136,
        enemySpeed: 2.35,
        contactDamage: 0.135,
        player: { row: 20, col: 3 },
        platforms: [
            { row: 18, start: 8, length: 5, type: "W" },
            { row: 16, start: 16, length: 5, type: "W" },
            { row: 14, start: 24, length: 5, type: "W" },
            { row: 12, start: 32, length: 5, type: "W" },
            { row: 10, start: 40, length: 5, type: "W" },
            { row: 8, start: 48, length: 6, type: "W" },
            { row: 6, start: 35, length: 5, type: "S" }
        ],
        enemies: [
            { row: 20, col: 17 },
            { row: 17, col: 10 },
            { row: 20, col: 58 },
            { row: 15, col: 18 },
            { row: 13, col: 26 },
            { row: 9, col: 42 },
            { row: 7, col: 51 }
        ]
    },
    {
        name: "Stone Fortress",
        difficulty: "Hard+",
        background: "#8EA4B8",
        groundType: "S",
        platformType: "S",
        enemyHealth: 150,
        enemySpeed: 2.55,
        contactDamage: 0.15,
        player: { row: 20, col: 3 },
        platforms: [
            { row: 18, start: 9, length: 9 },
            { row: 15, start: 22, length: 9 },
            { row: 12, start: 36, length: 9 },
            { row: 9, start: 49, length: 9 },
            { row: 6, start: 29, length: 8 },
            { row: 16, start: 50, length: 8 },
            { row: 13, start: 8, length: 6 }
        ],
        enemies: [
            { row: 20, col: 18 },
            { row: 17, col: 13 },
            { row: 20, col: 45 },
            { row: 20, col: 58 },
            { row: 14, col: 26 },
            { row: 11, col: 40 },
            { row: 8, col: 53 },
            { row: 5, col: 33 }
        ]
    },
    {
        name: "Power Laboratory",
        difficulty: "Expert",
        background: "#857CBF",
        groundType: "B",
        platformType: "S",
        enemyHealth: 164,
        enemySpeed: 2.75,
        contactDamage: 0.165,
        player: { row: 20, col: 3 },
        platforms: [
            { row: 18, start: 8, length: 7, type: "S" },
            { row: 16, start: 18, length: 7, type: "B" },
            { row: 13, start: 29, length: 7, type: "S" },
            { row: 10, start: 40, length: 7, type: "B" },
            { row: 7, start: 51, length: 7, type: "S" },
            { row: 6, start: 24, length: 6, type: "B" },
            { row: 15, start: 48, length: 6, type: "S" }
        ],
        enemies: [
            { row: 20, col: 17 },
            { row: 17, col: 11 },
            { row: 20, col: 40 },
            { row: 20, col: 60 },
            { row: 15, col: 21 },
            { row: 12, col: 32 },
            { row: 9, col: 43 },
            { row: 14, col: 51 },
            { row: 6, col: 54 }
        ]
    },
    {
        name: "Dark Citadel",
        difficulty: "Master",
        background: "#4C526B",
        groundType: "S",
        platformType: "B",
        enemyHealth: 178,
        enemySpeed: 2.95,
        contactDamage: 0.185,
        player: { row: 20, col: 3 },
        platforms: [
            { row: 18, start: 8, length: 8, type: "B" },
            { row: 15, start: 19, length: 8, type: "S" },
            { row: 12, start: 31, length: 8, type: "B" },
            { row: 9, start: 43, length: 8, type: "S" },
            { row: 6, start: 54, length: 7, type: "B" },
            { row: 6, start: 25, length: 7, type: "S" },
            { row: 16, start: 50, length: 8, type: "B" },
            { row: 11, start: 9, length: 6, type: "S" }
        ],
        enemies: [
            { row: 20, col: 17 },
            { row: 17, col: 12 },
            { row: 20, col: 28 },
            { row: 20, col: 60 },
            { row: 14, col: 23 },
            { row: 11, col: 35 },
            { row: 8, col: 47 },
            { row: 5, col: 57 },
            { row: 15, col: 54 },
            { row: 10, col: 12 }
        ]
    },
    {
        name: "Final Arena",
        difficulty: "Final Challenge",
        background: "#34394F",
        groundType: "S",
        platformType: "B",
        enemyHealth: 195,
        enemySpeed: 3.2,
        contactDamage: 0.21,
        player: { row: 20, col: 3 },
        platforms: [
            { row: 18, start: 8, length: 8, type: "B" },
            { row: 18, start: 23, length: 8, type: "S" },
            { row: 18, start: 38, length: 8, type: "B" },
            { row: 18, start: 53, length: 8, type: "S" },
            { row: 14, start: 14, length: 8, type: "S" },
            { row: 14, start: 29, length: 8, type: "B" },
            { row: 14, start: 44, length: 8, type: "S" },
            { row: 10, start: 21, length: 8, type: "B" },
            { row: 10, start: 36, length: 8, type: "S" },
            { row: 6, start: 29, length: 8, type: "B" }
        ],
        enemies: [
            { row: 20, col: 15 },
            { row: 20, col: 27 },
            { row: 20, col: 39 },
            { row: 20, col: 52 },
            { row: 20, col: 60 },
            { row: 17, col: 8 },
            { row: 17, col: 11 },
            { row: 17, col: 26 },
            { row: 17, col: 41 },
            { row: 13, col: 18 },
            { row: 13, col: 48 },
            { row: 5, col: 33 }
        ]
    }
];

const LEVELS = LEVEL_DEFINITIONS.map(buildLevel);
let currentLevel = 0;

function getCurrentLevel() {
    return LEVELS[currentLevel];
}

function getCurrentLevelSettings() {
    return LEVEL_DEFINITIONS[currentLevel];
}

function loadLevel(index) {
    if (index < 0 || index >= LEVELS.length) {
        return false;
    }

    currentLevel = index;

    if (typeof loadCurrentLevel === "function") {
        loadCurrentLevel();
    }

    return true;
}

function nextLevel() {
    return loadLevel(currentLevel + 1);
}

function previousLevel() {
    return loadLevel(currentLevel - 1);
}

function isLastLevel() {
    return currentLevel === LEVELS.length - 1;
}
