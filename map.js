// =====================================================
// map.js
// Level loading, blocks, collisions and decorations
// =====================================================

const TILE = typeof TILE_SIZE !== "undefined" ? TILE_SIZE : 64;

class Block {
    constructor(x, y, width = TILE, height = TILE, type = "#") {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.destroyed = false;

        const colors = {
            "#": "#4CAF50",
            "B": "#8D6E63",
            "S": "#757575",
            "W": "#8B5A2B"
        };

        this.color = colors[type] || "#666666";
    }

    draw(ctx) {
        if (this.destroyed) return;

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.strokeStyle = "rgba(20, 20, 20, 0.55)";
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}

const mapBlocks = [];
const decorations = [];

let playerSpawn = {
    x: 100,
    y: 100
};

function clearLevel() {
    mapBlocks.length = 0;
    decorations.length = 0;
    enemies.length = 0;

    if (typeof projectiles !== "undefined") {
        projectiles.length = 0;
    }
}

function loadCurrentLevel() {
    clearLevel();

    const level = getCurrentLevel();

    if (!level) {
        throw new Error("The current level could not be loaded.");
    }

    playerSpawn.x = 100;
    playerSpawn.y = 100;

    for (let row = 0; row < level.length; row++) {
        for (let col = 0; col < level[row].length; col++) {
            const tile = level[row][col];
            const x = col * TILE;
            const y = row * TILE;

            if (tile === "#" || tile === "B" || tile === "S" || tile === "W") {
                mapBlocks.push(new Block(x, y, TILE, TILE, tile));
            } else if (tile === "P") {
                playerSpawn.x = x;
                playerSpawn.y = y;
            } else if (tile === "E") {
                spawnEnemy(x, y);
            }
        }
    }

    player.x = playerSpawn.x;
    player.y = playerSpawn.y;
    player.dx = 0;
    player.dy = 0;

    buildDecorations();
}

function drawMap(ctx) {
    drawDecorations(ctx);

    for (const block of mapBlocks) {
        block.draw(ctx);
    }

    drawGrid(ctx);
}

function getSolidBlocks() {
    return mapBlocks.filter(block => !block.destroyed);
}

function createBlock(x, y, type = "#") {
    mapBlocks.push(new Block(x, y, TILE, TILE, type));
    buildDecorations();
}

function destroyBlocks(x, y, radius) {
    for (const block of mapBlocks) {
        if (block.destroyed) continue;

        const centerX = block.x + block.width / 2;
        const centerY = block.y + block.height / 2;
        const dx = centerX - x;
        const dy = centerY - y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= radius) {
            block.destroyed = true;
        }
    }
}

function restoreBlocks() {
    for (const block of mapBlocks) {
        block.destroyed = false;
    }

    buildDecorations();
}

function getWorldWidth() {
    const level = getCurrentLevel();
    return level[0].length * TILE;
}

function getWorldHeight() {
    const level = getCurrentLevel();
    return level.length * TILE;
}

function isSolid(x, y) {
    for (const block of mapBlocks) {
        if (block.destroyed) continue;

        if (
            x >= block.x &&
            x <= block.x + block.width &&
            y >= block.y &&
            y <= block.y + block.height
        ) {
            return true;
        }
    }

    return false;
}

function restartCurrentLevel() {
    loadCurrentLevel();
}

let showGrid = false;

function drawGrid(ctx) {
    if (!showGrid) return;

    ctx.strokeStyle = "rgba(255,255,255,0.08)";

    for (let x = 0; x < getWorldWidth(); x += TILE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, getWorldHeight());
        ctx.stroke();
    }

    for (let y = 0; y < getWorldHeight(); y += TILE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(getWorldWidth(), y);
        ctx.stroke();
    }
}

// =====================================================
// Decorations
// =====================================================

class Decoration {
    constructor(x, y, width, height, type) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
    }

    draw(ctx) {
        if (this.type === "tree") {
            const trunkWidth = Math.max(12, this.width * 0.28);
            const trunkHeight = this.height * 0.5;

            ctx.fillStyle = "#6D4C41";
            ctx.fillRect(
                this.x + (this.width - trunkWidth) / 2,
                this.y + this.height - trunkHeight,
                trunkWidth,
                trunkHeight
            );

            ctx.fillStyle = "#2E7D32";
            ctx.beginPath();
            ctx.arc(
                this.x + this.width / 2,
                this.y + this.height * 0.32,
                this.width * 0.43,
                0,
                Math.PI * 2
            );
            ctx.fill();
            return;
        }

        if (this.type === "rock") {
            ctx.fillStyle = "#777";
            ctx.beginPath();
            ctx.ellipse(
                this.x + this.width / 2,
                this.y + this.height / 2,
                this.width / 2,
                this.height / 2,
                0,
                0,
                Math.PI * 2
            );
            ctx.fill();
            return;
        }

        if (this.type === "lamp") {
            const poleWidth = Math.max(6, this.width * 0.2);

            ctx.fillStyle = "#444";
            ctx.fillRect(
                this.x + (this.width - poleWidth) / 2,
                this.y + 8,
                poleWidth,
                this.height - 8
            );

            ctx.fillStyle = "yellow";
            ctx.beginPath();
            ctx.arc(
                this.x + this.width / 2,
                this.y + 7,
                this.width * 0.26,
                0,
                Math.PI * 2
            );
            ctx.fill();
            return;
        }

        if (this.type === "bush") {
            ctx.fillStyle = "#43A047";

            ctx.beginPath();
            ctx.arc(
                this.x + this.width * 0.35,
                this.y + this.height * 0.55,
                this.height * 0.45,
                0,
                Math.PI * 2
            );
            ctx.fill();

            ctx.beginPath();
            ctx.arc(
                this.x + this.width * 0.68,
                this.y + this.height * 0.55,
                this.height * 0.45,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
    }
}

function hasBlockDirectlyAbove(block) {
    return mapBlocks.some(other =>
        !other.destroyed &&
        other !== block &&
        other.x === block.x &&
        other.y + other.height === block.y
    );
}

function isTooCloseToCharacter(block) {
    const centerX = block.x + block.width / 2;
    const safeDistance = TILE * 1.6;

    if (Math.abs(centerX - playerSpawn.x) < safeDistance) {
        return true;
    }

    return enemies.some(enemy =>
        Math.abs(centerX - enemy.x) < safeDistance &&
        Math.abs(block.y - (enemy.y + enemy.height)) < TILE * 1.5
    );
}

function getDecorationSize(type) {
    const sizes = {
        tree: { width: 64, height: 100 },
        bush: { width: 50, height: 32 },
        rock: { width: 42, height: 30 },
        lamp: { width: 36, height: 86 }
    };

    return sizes[type];
}

function buildDecorations() {
    decorations.length = 0;

    // Put decorations only on the real ground, not on floating platforms.
    const groundRowY = Math.max(
        ...mapBlocks
            .filter(block => !block.destroyed)
            .map(block => block.y)
    );

    const groundBlocks = mapBlocks
        .filter(block => !block.destroyed)
        .filter(block => block.y === groundRowY)
        .filter(block => !hasBlockDirectlyAbove(block))
        .filter(block => !isTooCloseToCharacter(block))
        .filter(block => {
            const column = Math.round(block.x / TILE);
            return column > 1 && column < LEVEL_WIDTH - 2;
        })
        .sort((a, b) => a.x - b.x);

    if (groundBlocks.length === 0) return;

    const decorationTypes = ["tree", "bush", "rock", "lamp"];
    const decorationCount = Math.min(
        5 + Math.floor(currentLevel / 3),
        groundBlocks.length
    );

    const usedBlocks = new Set();

    for (let i = 0; i < decorationCount; i++) {
        let index = Math.floor(
            ((i + 1) * groundBlocks.length) /
            (decorationCount + 1)
        );

        while (usedBlocks.has(index) && index < groundBlocks.length - 1) {
            index++;
        }

        const block = groundBlocks[index];
        if (!block) continue;

        usedBlocks.add(index);

        const type = decorationTypes[(i + currentLevel) % decorationTypes.length];
        const size = getDecorationSize(type);

        // The bottom of every decoration sits on top of the bottom floor.
        const x = block.x + (block.width - size.width) / 2;
        const y = block.y - size.height;

        decorations.push(
            new Decoration(x, y, size.width, size.height, type)
        );
    }
}

function drawDecorations(ctx) {
    for (const decoration of decorations) {
        decoration.draw(ctx);
    }
}

loadCurrentLevel();
