// =====================================================
// player.js
// =====================================================

// Player Sprites
const playerRightImage = new Image();
playerRightImage.src = "assets/player_right.png";

const playerLeftImage = new Image();
playerLeftImage.src = "assets/player_left.png";

class Player {

    constructor() {

        this.x = 100;
        this.y = 100;

        this.width = 40;
        this.height = 60;

        this.speed = 5;
        this.sprintSpeed = 8;

        this.dx = 0;
        this.dy = 0;

        this.gravity = 0.8;
        this.jumpForce = -15;

        this.onGround = false;

        this.health = 100;

        // 1 = Right
        // -1 = Left
        this.direction = 1;

        // --------------------
        // Dash (Q)
        // --------------------
        this.dashSpeed = 18;
        this.dashDuration = 0;
        this.dashDurationMax = 9;
        this.dashCooldown = 0;
        this.dashCooldownMax = 55;
        this.dashDirection = 1;

    }

    update() {

        // --------------------
        // Dash timers
        // --------------------
        if (this.dashCooldown > 0) {
            this.dashCooldown--;
        }

        // --------------------
        // Movement / Dash
        // --------------------
        if (this.dashDuration > 0) {
            this.dx = this.dashDirection * this.dashSpeed;
            this.dashDuration--;
        } else {
            this.dx = 0;

            const moveSpeed = keys["Shift"] ? this.sprintSpeed : this.speed;

            if (keys["a"] || keys["A"]) {
                this.dx = -moveSpeed;
                this.direction = -1;
            }

            if (keys["d"] || keys["D"]) {
                this.dx = moveSpeed;
                this.direction = 1;
            }
        }

        // --------------------
        // Jump
        // --------------------
        if (
            this.dashDuration <= 0 &&
            (keys[" "] || keys["Space"]) &&
            this.onGround
        ) {
            this.dy = this.jumpForce;
            this.onGround = false;
        }

        // --------------------
        // Gravity
        // --------------------
        this.dy += this.gravity;

        // --------------------
        // Move
        // --------------------
        this.x += this.dx;
        this.y += this.dy;

        this.checkCollisions();

    }

    requestDash() {
        if (
            this.dashCooldown > 0 ||
            this.dashDuration > 0 ||
            this.health <= 0
        ) {
            return false;
        }

        if (keys["a"] || keys["A"]) {
            this.dashDirection = -1;
        } else if (keys["d"] || keys["D"]) {
            this.dashDirection = 1;
        } else {
            this.dashDirection = this.direction;
        }

        this.direction = this.dashDirection;
        this.dashDuration = this.dashDurationMax;
        this.dashCooldown = this.dashCooldownMax;

        return true;
    }

    resetDash() {
        this.dashDuration = 0;
        this.dashCooldown = 0;
        this.dashDirection = this.direction;
    }

    checkCollisions() {

        this.onGround = false;

        const blocks = getSolidBlocks();

        for (const block of blocks) {

            if (

                this.x < block.x + block.width &&
                this.x + this.width > block.x &&
                this.y < block.y + block.height &&
                this.y + this.height > block.y

            ) {

                // Landing on top
                if (

                    this.dy > 0 &&
                    this.y + this.height - this.dy <= block.y

                ) {

                    this.y = block.y - this.height;

                    this.dy = 0;

                    this.onGround = true;

                }

                // Hitting bottom
                else if (

                    this.dy < 0 &&
                    this.y - this.dy >= block.y + block.height

                ) {

                    this.y = block.y + block.height;

                    this.dy = 0;

                }

                // Hit left wall
                else if (this.dx > 0) {

                    this.x = block.x - this.width;

                }

                // Hit right wall
                else if (this.dx < 0) {

                    this.x = block.x + block.width;

                }

            }

        }

        // Respawn if player falls

        const fallLimit =
            typeof getWorldHeight === "function"
                ? getWorldHeight() + 200
                : 1200;

        if (this.y > fallLimit) {

            this.x =
                typeof playerSpawn !== "undefined"
                    ? playerSpawn.x
                    : 100;

            this.y =
                typeof playerSpawn !== "undefined"
                    ? playerSpawn.y
                    : 100;

            this.dx = 0;
            this.dy = 0;

        }

    }

    draw(ctx) {

        // --------------------
        // Choose Sprite
        // --------------------

        let sprite;

        if (this.direction === 1) {

            sprite = playerRightImage;

        } else {

            sprite = playerLeftImage;

        }

        // Draw Player

        if (sprite.complete) {

            ctx.drawImage(

                sprite,

                this.x,
                this.y,

                this.width,
                this.height

            );

        } else {

            // Backup if image hasn't loaded

            ctx.fillStyle = "#00AAFF";

            ctx.fillRect(

                this.x,
                this.y,

                this.width,
                this.height

            );

        }

        // --------------------
        // Health Bar
        // --------------------

        ctx.fillStyle = "#333";

        ctx.fillRect(

            this.x,
            this.y - 10,

            this.width,
            5

        );

        ctx.fillStyle = "lime";

        ctx.fillRect(

            this.x,
            this.y - 10,

            this.width * (this.health / 100),
            5

        );

    }

}

// =====================================================
// Create Player
// =====================================================

const player = new Player();

// =====================================================
// Keyboard Input
// =====================================================

const keys = {};

window.addEventListener("keydown", (e) => {

    keys[e.key] = true;

    // Trigger dash once per Q press. Holding Q will not repeatedly restart it.
    if ((e.key === "q" || e.key === "Q") && !e.repeat) {
        player.requestDash();
    }

});

window.addEventListener("keyup", (e) => {

    keys[e.key] = false;

});