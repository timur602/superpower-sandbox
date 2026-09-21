// =====================================================
// ui.js
// Heads-up display and level information
// =====================================================

function drawCenteredMessage(ctx, text, y, size = 42, color = "white") {
    ctx.fillStyle = "rgba(0, 0, 0, 0.58)";
    const width = Math.min(canvas.width - 40, 760);
    ctx.fillRect((canvas.width - width) / 2, y - size, width, size + 28);

    ctx.fillStyle = color;
    ctx.font = `bold ${size}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, y);
    ctx.textAlign = "left";
}

function drawUI(ctx) {
    const settings = getCurrentLevelSettings();

    ctx.fillStyle = "rgba(0,0,0,0.68)";
    ctx.fillRect(10, 10, 365, 342);

    ctx.fillStyle = "white";
    ctx.font = "bold 20px Arial";
    ctx.fillText("SUPERPOWER SANDBOX", 20, 35);

    ctx.font = "17px Arial";
    ctx.fillText(
        `Level ${currentLevel + 1}/${LEVELS.length}: ${settings.name}`,
        20,
        64
    );

    ctx.fillStyle = "#FFD54F";
    ctx.fillText(`Difficulty: ${settings.difficulty}`, 20, 88);

    ctx.fillStyle = "white";
    ctx.fillText("Health", 20, 116);

    ctx.fillStyle = "#7A1515";
    ctx.fillRect(20, 126, 210, 20);

    ctx.fillStyle = "lime";
    ctx.fillRect(
        20,
        126,
        Math.max(0, player.health / 100) * 210,
        20
    );

    ctx.strokeStyle = "white";
    ctx.strokeRect(20, 126, 210, 20);

    ctx.fillStyle = "white";
    ctx.fillText(`${Math.floor(player.health)}/100`, 240, 143);

    ctx.fillText(
        "Fireball (1): " +
        (powers.fireCooldown <= 0 ? "READY" : powers.fireCooldown),
        20,
        174
    );

    ctx.fillText(
        "Lightning (2): " +
        (powers.lightningCooldown <= 0 ? "READY" : powers.lightningCooldown),
        20,
        201
    );

    ctx.fillText(
        "Explosion (3): " +
        (powers.explosionCooldown <= 0 ? "READY" : powers.explosionCooldown),
        20,
        228
    );

    ctx.fillStyle = "yellow";
    ctx.fillText(
        `Enemies: ${enemies.length}/${settings.enemies.length}`,
        20,
        257
    );

    ctx.fillStyle = "#DDDDDD";
    ctx.font = "14px Arial";
    ctx.fillText(
        `Enemy HP: ${settings.enemyHealth} | Speed: ${settings.enemySpeed}`,
        20,
        282
    );

    ctx.fillStyle = player.dashCooldown <= 0 ? "#7CFFB2" : "#CCCCCC";
    ctx.fillText(
        "Dash (Q): " +
        (player.dashCooldown <= 0 ? "READY" : player.dashCooldown),
        20,
        305
    );

    ctx.fillStyle = "#B8E4FF";
    ctx.fillText("Move A/D | Jump Space | Dash Q", 20, 328);

    if (
        gameState.levelIntroFrames > 0 &&
        !gameState.levelTransition &&
        !gameState.gameComplete
    ) {
        drawCenteredMessage(
            ctx,
            `LEVEL ${currentLevel + 1}: ${settings.name}`,
            105,
            34,
            "white"
        );
    }

    if (gameState.levelTransition) {
        drawCenteredMessage(
            ctx,
            isLastLevel() ? "FINAL LEVEL COMPLETE!" : "LEVEL COMPLETE!",
            105,
            40,
            "lime"
        );
    }

    if (gameState.gameComplete) {
        ctx.fillStyle = "rgba(0,0,0,0.72)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "lime";
        ctx.font = "bold 52px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
            "YOU COMPLETED ALL 10 LEVELS!",
            canvas.width / 2,
            canvas.height / 2 - 20
        );

        ctx.fillStyle = "white";
        ctx.font = "22px Arial";
        ctx.fillText(
            "Press R to play again",
            canvas.width / 2,
            canvas.height / 2 + 28
        );
        ctx.textAlign = "left";
    }

    if (player.health <= 0 && !gameState.gameComplete) {
        ctx.fillStyle = "rgba(0,0,0,0.65)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "red";
        ctx.font = "bold 50px Arial";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);

        ctx.fillStyle = "white";
        ctx.font = "22px Arial";
        ctx.fillText(
            "Press R to restart this level",
            canvas.width / 2,
            canvas.height / 2 + 42
        );
        ctx.textAlign = "left";
    }
}
