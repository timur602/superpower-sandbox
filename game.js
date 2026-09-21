// =====================================================
// game.js
// Main canvas, camera, level progression and game loop
// =====================================================

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const camera = {
    x: 0,
    y: 0
};

const gameState = {
    levelTransition: false,
    transitionFrames: 0,
    levelIntroFrames: 120,
    gameComplete: false
};

function drawBackground() {
    const settings = getCurrentLevelSettings();
    const backgroundColor = settings.background || "#87CEEB";

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "rgba(255,255,255,0.16)");
    gradient.addColorStop(1, "rgba(0,0,0,0.10)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function updateCamera() {
    const worldWidth = getWorldWidth();
    const worldHeight = getWorldHeight();

    const targetX = player.x + player.width / 2 - canvas.width / 2;
    const targetY = player.y + player.height / 2 - canvas.height / 2;

    const maxX = Math.max(0, worldWidth - canvas.width);
    const maxY = Math.max(0, worldHeight - canvas.height);

    camera.x = Math.max(0, Math.min(targetX, maxX));
    camera.y = Math.max(0, Math.min(targetY, maxY));
}

function resetLevelState({ restoreHealth = true } = {}) {
    if (restoreHealth) {
        player.health = 100;
    }

    powers.fireCooldown = 0;
    powers.lightningCooldown = 0;
    powers.explosionCooldown = 0;

    player.resetDash();

    camera.x = 0;
    camera.y = 0;

    gameState.levelTransition = false;
    gameState.transitionFrames = 0;
    gameState.levelIntroFrames = 120;
}

function updateLevelProgress() {
    if (gameState.gameComplete) return;

    if (!gameState.levelTransition && enemies.length === 0) {
        gameState.levelTransition = true;
        gameState.transitionFrames = 90;
    }

    if (!gameState.levelTransition) return;

    gameState.transitionFrames--;

    if (gameState.transitionFrames > 0) return;

    if (isLastLevel()) {
        gameState.gameComplete = true;
        gameState.levelTransition = false;
        return;
    }

    nextLevel();
    resetLevelState();
}

// Development shortcuts make it easier to test all ten levels.
window.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();

    if (key === "n" && !gameState.gameComplete && !gameState.levelTransition) {
        if (!isLastLevel()) {
            nextLevel();
            resetLevelState();
        }
    }

    if (key === "r") {
        if (gameState.gameComplete) {
            gameState.gameComplete = false;
            loadLevel(0);
        } else {
            restartCurrentLevel();
        }

        resetLevelState();
    }
});

function gameLoop() {
    if (gameState.levelIntroFrames > 0) {
        gameState.levelIntroFrames--;
    }

    updateCamera();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();

    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    if (!gameState.gameComplete && player.health > 0) {
        player.update();
        updatePowers();
        updateEnemies();
        updateLevelProgress();
    }

    drawMap(ctx);
    drawPowers(ctx);
    drawEnemies(ctx);
    player.draw(ctx);

    ctx.restore();

    drawUI(ctx);
    requestAnimationFrame(gameLoop);
}

gameLoop();
