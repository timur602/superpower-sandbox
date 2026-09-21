// =====================================================
// enemy.js
// Enemies become stronger on every level
// =====================================================

const enemyRightImage = new Image();
enemyRightImage.src = "assets/enemy_right.png";

const enemyLeftImage = new Image();
enemyLeftImage.src = "assets/enemy_left.png";

const enemies = [];

class Enemy {
    constructor(x, y) {
        const difficulty =
            typeof getCurrentLevelSettings === "function"
                ? getCurrentLevelSettings()
                : {};

        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 60;

        this.speed = difficulty.enemySpeed || 2;
        this.maxHealth = difficulty.enemyHealth || 100;
        this.health = this.maxHealth;
        this.contactDamage = difficulty.contactDamage || 0.1;

        this.alive = true;
        this.direction = -1;
        this.dx = 0;
        this.dy = 0;
        this.gravity = 0.8;
        this.jumpForce = -11 - currentLevel * 0.18;
        this.onGround = false;
        this.jumpCooldown = 0;
    }

    overlaps(block) {
        return (
            this.x < block.x + block.width &&
            this.x + this.width > block.x &&
            this.y < block.y + block.height &&
            this.y + this.height > block.y
        );
    }

    update() {
        if (!this.alive) return;

        if (this.jumpCooldown > 0) {
            this.jumpCooldown--;
        }

        const directionToPlayer = player.x > this.x ? 1 : -1;
        this.direction = directionToPlayer;
        this.dx = directionToPlayer * this.speed;

        // Harder levels allow enemies to jump toward the player.
        if (
            currentLevel >= 3 &&
            this.onGround &&
            this.jumpCooldown <= 0 &&
            player.y + player.height < this.y &&
            Math.abs(player.x - this.x) < 420
        ) {
            this.dy = this.jumpForce;
            this.onGround = false;
            this.jumpCooldown = Math.max(45, 105 - currentLevel * 6);
        }

        // Horizontal movement and collision.
        this.x += this.dx;

        for (const block of getSolidBlocks()) {
            if (!this.overlaps(block)) continue;

            if (this.dx > 0) {
                this.x = block.x - this.width;
            } else if (this.dx < 0) {
                this.x = block.x + block.width;
            }

            if (this.onGround && this.jumpCooldown <= 0) {
                this.dy = this.jumpForce;
                this.onGround = false;
                this.jumpCooldown = Math.max(45, 100 - currentLevel * 5);
            }
        }

        // Vertical movement and collision.
        this.dy += this.gravity;
        this.y += this.dy;
        this.onGround = false;

        for (const block of getSolidBlocks()) {
            if (!this.overlaps(block)) continue;

            if (
                this.dy > 0 &&
                this.y + this.height - this.dy <= block.y
            ) {
                this.y = block.y - this.height;
                this.dy = 0;
                this.onGround = true;
            } else if (
                this.dy < 0 &&
                this.y - this.dy >= block.y + block.height
            ) {
                this.y = block.y + block.height;
                this.dy = 0;
            }
        }

        // Damage the player while touching them.
        if (
            this.x < player.x + player.width &&
            this.x + this.width > player.x &&
            this.y < player.y + player.height &&
            this.y + this.height > player.y
        ) {
            player.health -= this.contactDamage;
            player.health = Math.max(0, player.health);
        }

        // Projectile damage.
        for (const projectile of projectiles) {
            if (!projectile.alive) continue;

            if (
                projectile.x + projectile.radius > this.x &&
                projectile.x - projectile.radius < this.x + this.width &&
                projectile.y + projectile.radius > this.y &&
                projectile.y - projectile.radius < this.y + this.height
            ) {
                this.health -= projectile.damage;
                projectile.alive = false;

                if (this.health <= 0) {
                    this.alive = false;
                }
            }
        }

        // An enemy that falls out of the world is defeated instead of
        // remaining alive forever and blocking level progression.
        if (this.y > getWorldHeight() + 250) {
            this.alive = false;
        }
    }

    draw(ctx) {
        if (!this.alive) return;

        const sprite = this.direction === 1
            ? enemyRightImage
            : enemyLeftImage;

        if (sprite.complete && sprite.naturalWidth > 0) {
            ctx.drawImage(
                sprite,
                this.x,
                this.y,
                this.width,
                this.height
            );
        } else {
            ctx.fillStyle = "crimson";
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        ctx.fillStyle = "#333";
        ctx.fillRect(this.x, this.y - 8, this.width, 5);

        ctx.fillStyle = "lime";
        ctx.fillRect(
            this.x,
            this.y - 8,
            this.width * Math.max(0, this.health / this.maxHealth),
            5
        );
    }
}

function spawnEnemy(x, y) {
    enemies.push(new Enemy(x, y));
}

function updateEnemies() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].update();

        if (!enemies[i].alive) {
            enemies.splice(i, 1);
        }
    }
}

function drawEnemies(ctx) {
    for (const enemy of enemies) {
        enemy.draw(ctx);
    }
}
