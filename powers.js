// powers.js

const projectiles = [];

const powers = {
    fireCooldown: 0,
    lightningCooldown: 0,
    explosionCooldown: 0
};

class Projectile {
    constructor(x, y, dx, dy, color, damage, radius = 10) {
        this.x = x;
        this.y = y;

        this.dx = dx;
        this.dy = dy;

        this.radius = radius;
        this.color = color;
        this.damage = damage;

        this.alive = true;
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;

        // Destroy only after leaving the current level's world.
        const worldWidth =
            typeof getWorldWidth === "function" ? getWorldWidth() : 3000;
        const worldHeight =
            typeof getWorldHeight === "function" ? getWorldHeight() : 2000;

        if (
            this.x < -200 ||
            this.x > worldWidth + 200 ||
            this.y < -200 ||
            this.y > worldHeight + 200
        ) {
            this.alive = false;
        }

        // Destroy map blocks
        destroyBlocks(this.x, this.y, 20);
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

        ctx.fillStyle = this.color;
        ctx.fill();

        ctx.closePath();
    }
}

// ---------------- FIREBALL (Key 1) ----------------

function fireball() {

    if (powers.fireCooldown > 0) return;

    let direction = 1;

    if (keys["a"] || keys["A"])
        direction = -1;

    projectiles.push(
        new Projectile(
            player.x + player.width / 2,
            player.y + player.height / 2,
            direction * 12,
            0,
            "orange",
            25,
            10
        )
    );

    powers.fireCooldown = 40;
}

// ---------------- LIGHTNING (Key 2) ----------------

function lightningStrike() {

    if (powers.lightningCooldown > 0) return;

    destroyBlocks(
        player.x,
        player.y,
        80
    );

    powers.lightningCooldown = 120;
}

// ---------------- EXPLOSION (Key 3) ----------------

function explosion() {

    if (powers.explosionCooldown > 0) return;

    destroyBlocks(
        player.x,
        player.y,
        150
    );

    powers.explosionCooldown = 180;
}

// ---------------- UPDATE ----------------

function updatePowers() {

    if (powers.fireCooldown > 0)
        powers.fireCooldown--;

    if (powers.lightningCooldown > 0)
        powers.lightningCooldown--;

    if (powers.explosionCooldown > 0)
        powers.explosionCooldown--;

    for (let i = projectiles.length - 1; i >= 0; i--) {

        projectiles[i].update();

        if (!projectiles[i].alive) {
            projectiles.splice(i, 1);
        }
    }

    // Keybinds
    if (keys["1"])
        fireball();

    if (keys["2"])
        lightningStrike();

    if (keys["3"])
        explosion();
}

// ---------------- DRAW ----------------

function drawPowers(ctx) {

    for (const projectile of projectiles) {
        projectile.draw(ctx);
    }
}