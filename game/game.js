class Game {
    last_bird_x = 1350;
    speed = 10;
    defaultSpeed = 10;
    maxSpeed = 21;
    score = 0;
    highScore = localStorage.getItem("highScore") || 0;
    last_day_change = 1;
    window_width = 1280;
    night = false;
    collisionBoxesVisible = false;
    fpsVisible = false;
    sprite;
    imgGameOver;
    imgGameOverNight;
    showFPS = true;
    textColor = "#CA7171";
    invisibleDate = new Date('August 2, 1992');
    displayInvisibleTime = document.querySelector("#invisibleCollDown");
    isXPressed = false
    isPause = false
    timeSinceLastPause = 0;
    pause_delay = 250;

    constructor(start, debugged) {
        this.started = start;
        this.debug = debugged;
        this.set_debug();
        this.ground = new Ground();
        this.moon = new Moon();
        this.player = new Dinosaur();
        this.cactae = [];
        this.birds = [];
        this.clouds = [];
        this.stars = [];
        this.isShiftPressed = false;
    }

    switchToInvisible() {
        if ((new Date().getTime() - this.invisibleDate.getTime()) / 1000 > 30) {
            this.invisibleDate = new Date();
            this.player.changeInvisible();

            setTimeout(() => {
                this.switchToVisible();
            }, 2000);
        }

    }

    switchToVisible() {
        this.player.changeInvisible();
    }

    moreSpeed() {
        if (keyIsDown(RIGHT_ARROW)) {
            if (!this.isShiftPressed) {
                this.isShiftPressed = true
                this.speed += 10;
                this.defaultSpeed = this.speed - 10;
            }
        } else {
            this.isShiftPressed = false;
        }
    }

    lessSpeed() {
        if (keyIsDown(LEFT_ARROW)) {
            if (!this.isXPressed) {
                this.isXPressed = true
                this.speed = this.speed - 5;
                this.defaultSpeed = this.speed + 5;
            }
        } else {
            this.isXPressed = false;
        }
    }


    update() {
        document.querySelector("#score").innerHTML = Math.floor(this.score);
        document.querySelector("#highScore").innerHTML = Math.floor(this.highScore);

        let timeInvisible = Math.abs(Math.floor((30 - (new Date().getTime() - this.invisibleDate.getTime()) / 1000)));
        if (timeInvisible < 30) {
            document.querySelector("#invisibleCollDown").innerHTML = timeInvisible + ' secondes';
        } else {
            document.querySelector("#invisibleCollDown").innerHTML = 'Prêt';
        }


        if (keyIsPressed) {
            if (key == "Escape") {
                let currentTime = millis();
                if (currentTime - this.timeSinceLastPause >= this.pause_delay) {
                    this.timeSinceLastPause = currentTime;
                    this.started = !this.started;
                    this.isPause = !this.isPause;
                }
            }
        }

        if (this.player.isAlive() && this.started) {
            this.score += 1 * (this.speed / 70);
            this.ground.update(Math.floor(this.speed));
            this.player.update();

            this.moreSpeed();
            this.lessSpeed();

            if (!keyIsDown(RIGHT_ARROW) && !keyIsDown(LEFT_ARROW)) {
                this.speed = this.defaultSpeed;
            }


            if (this.showFPS) {
                fill(this.textColor);
                text("FPS", 50, 50);
                text(parseFloat(frameRate()).toFixed(3), 120, 50);
            }

            if (this.player.will_die) {
                this.player.die();
            }

            for (let cl of this.clouds) {
                cl.update(Math.floor(this.speed * 0.5));
            }

            for (let c of this.cactae) {
                c.update(Math.floor(this.speed));
                for (let cbc of c.collisionBoxes) {
                    cbc.update(Math.floor(this.speed));
                }
            }

            for (let b of this.birds) {
                b.update(Math.floor(this.speed));
                for (let cbb of b.wingDownCollisionBoxes) {
                    cbb.update(Math.floor(this.speed));
                }
                for (let cbb of b.wingUpCollisionBoxes) {
                    cbb.update(Math.floor(this.speed));
                }
            }

            if (this.night) {
                fill(255);
                this.moon.update((this.speed * 0.021));
                for (let s of this.stars) {
                    s.update((this.speed * 0.021));
                }
            }
            else {
                fill(32, 33, 36);
            }

            if (this.highScore < this.score) {
                this.highScore = Math.floor(this.score);
                localStorage.setItem("highScore", this.highScore);
            }

            if (!this.player.will_die) {
                this.check_collisions();
            }

            if (this.defaultSpeed < this.maxSpeed) {
                this.defaultSpeed += 0.005;
                this.speed += 0.005;
            }
        }
        else {
            this.started = false;
            if (!this.isPause) {
                this.player.doInitialJump();
            }
        }

        if (this.fpsVisible) {
            text("Fps", 50, 50);
            text(parseFloat(frameRate()).toFixed(3), 120, 50);
        }
    }

    display() {
        this.ground.display();
        if (this.night) {
            for (let s of this.stars) {
                s.display();
            }
            this.moon.display();
        }
        for (let cl of this.clouds) {
            cl.display();
        }
        for (let c of this.cactae) {
            c.display();
            if (this.collisionBoxesVisible) {
                for (let cbc of c.collisionBoxes) {
                    cbc.display();
                }
            }
        }
        for (let b of this.birds) {
            b.display();
            if (this.collisionBoxesVisible) {
                for (let cbb of b.activeCollisionBoxes) {
                    cbb.display();
                }
            }
        }
        this.player.display();
        if (this.collisionBoxesVisible) {
            for (let cbp of this.player.activeCollisionBoxes) {
                cbp.display();
            }
        }
    }

    load_game(w) {
        this.set_window_width(w);
        this.load_game_assets();
        this.load_ground_assets();
        this.load_player_assets();
    }
    set_window_width(w) {
        this.window_width = w;
        this.ground.w = w;
        this.ground.x2 = 0 - w;
        this.moon.x = w + 70;
    }
    load_game_assets() {
        this.imgGameOver = this.sprite.get(655, 15, 191, 11);
        this.imgGameOverNight = this.sprite.get(655, 29, 191, 11);
    }
    load_player_assets() {
        this.player.img_running_1 = this.sprite.get(848, 2, 44, 47);
        this.player.img_running_2 = this.sprite.get(936, 2, 44, 47);
        this.player.img_running_3 = this.sprite.get(980, 2, 44, 47);
        this.player.img_crouching_1 = this.sprite.get(1112, 19, 59, 30);
        this.player.img_crouching_2 = this.sprite.get(1171, 19, 59, 30);
        this.player.img_die = this.sprite.get(1068, 2, 44, 47);
        this.player.img_die_night = this.sprite.get(1024, 2, 44, 47);
        this.player.imgs[0] = this.player.img_running_1; this.player.imgs[1] = this.player.img_running_2; this.player.imgs[2] = this.player.img_running_3;
        this.player.crouching_imgs[0] = this.player.img_crouching_1; this.player.crouching_imgs[1] = this.player.img_crouching_2;
        this.player.img = this.player.img_running_1;
    }

    load_ground_assets() {
        this.ground.img = this.sprite.get(2, 53, 1200, 13);
        this.ground.imgGameNotStarted = this.sprite.get(40, 53, 49, 13);
    }

    spawn_enemy() {
        if (this.score > 450) {
            if (Math.floor(random(10)) == 0) {
                this.birds.push(new Bird());

            }
            else {
                this.cactae.push(new Cactus());
            }
        }
        else {
            this.cactae.push(new Cactus());
        }
    }

    spawn_cloud() {
        if (Math.floor(random(1.5)) == 0) {
            this.clouds.push(new Cloud());
        }
    }

    spawn_star() {
        if (Math.floor(random(10)) == 0) {
            this.stars.push(new Star());
        }
    }

    spawn_entities() {
        this.spawn_enemy();
        this.spawn_cloud();
        if (this.night) {
            this.spawn_star();
        }
    }

    despawn_enemy() {
        this.cactae = this.cactae.filter(c => c.x + c.w >= 0);
        this.birds = this.birds.filter(b => b.x + b.w >= 0);
    }

    despawn_cloud() {
        this.clouds = this.clouds.filter(cl => cl.x + cl.w >= 0);
    }

    despawn_star() {
        this.stars = this.stars.filter(s => s.x + s.w >= 0);
    }

    despawn_entities() {
        this.despawn_enemy();
        this.despawn_cloud();
        if (this.night) {
            this.despawn_star();
        }
    }

    check_collisions() {
        loopCollisions:
        for (let cbp of this.player.activeCollisionBoxes) {
            let p_x = cbp.x;
            let p_y = cbp.y;
            let p_w = cbp.w;
            let p_h = cbp.h;

            for (let c of this.cactae) {

                for (let cbc of c.collisionBoxes) {

                    if (p_x + p_w > cbc.x && p_x < cbc.x + cbc.w) {

                        if (this.player.isJumping()) {
                            if (p_y + p_h > cbc.y) {
                                this.player.die(); break loopCollisions;
                            }
                        }
                        else {
                            this.player.stop_jumping = false;
                            if (c.type < 3) {
                                if (cbc.h != 29) {
                                    this.player.die(); break loopCollisions;
                                }
                            }
                            else {
                                this.player.die(); break loopCollisions;
                            }
                        }
                    }
                }
            }

            if (this.player.isJumping()) {
                for (let i = 0; i < this.birds.length; i++) {
                    if (this.birds[0].x + this.birds[0].w < 200 && this.birds.length > 1) {
                        this.last_bird_x = this.birds[1].x;
                    }
                    else {
                        this.last_bird_x = this.birds[0].x;
                    }
                }
            }

            for (let b of this.birds) {

                for (let cbb of b.activeCollisionBoxes) {

                    if (p_x + p_w > cbb.x && p_x < cbb.x + cbb.w) {

                        if (p_y + p_h > cbb.y && p_y < cbb.y + cbb.h) {
                            this.player.stop_jumping = false;
                            this.player.x += 1;
                            this.player.die(); break loopCollisions;
                        }
                    }
                }
            }
        }
    }

    check_collisions_crouch() {
        if (this.score < 30) {
            this.player.stop_jump();
        }
        else {
            let e_y = 0;
            loopCactus:
            for (let c of this.cactae) {
                if (!this.player.will_die) {
                    for (let cbc of c.collisionBoxes) {
                        if (this.player.x + this.player.w > cbc.x - this.speed && this.player.x < cbc.x - this.speed + cbc.w) {
                            this.player.will_die = true;
                            e_y = cbc.y;
                            break;
                        }
                    }
                    if (this.player.will_die) {
                        if (c.type < 3) {
                            if (c.x > 280) {
                                this.player.stop_jump(); this.player.x += 10;
                            }
                            else if (c.x > 235) {
                                this.player.stop_jump(); this.player.x += 6;
                            }
                            else if (c.x + c.w < 240) {
                                this.player.stop_jump(); this.player.x -= 3;
                            }
                            else {
                                this.player.stop_jump(e_y + 2);
                            }
                        }
                        else {
                            if (c.x > 280) {
                                this.player.stop_jump(); this.player.x += 10;
                            }
                            else if (c.x > 250) {
                                this.player.stop_jump(); this.player.x += 2;
                            }
                            else if (c.x + c.w < 210) {
                                this.player.stop_jump(e_y + 10);
                            }
                            else if (c.x + c.w < 240) {
                                this.player.stop_jump();
                            }
                            else {
                                this.player.stop_jump(e_y + 5);
                            }
                        }
                        break loopCactus;
                    }
                    else {
                        this.player.stop_jump();
                    }
                }
            }
            loopBirds:
            for (let b of this.birds) {
                if (!this.player.will_die) {
                    for (let cbb of b.activeCollisionBoxes) {
                        if (this.player.x + this.player.w > cbb.x - this.speed && this.player.x < cbb.x - this.speed + cbb.w) {
                            if (this.player.last_jump_y < cbb.y && this.player.x + this.player.w > this.last_bird_x) {
                                this.player.will_die = true;
                                e_y = cbb.y + 10; break;
                            }
                        }
                    }
                    if (this.player.will_die) {
                        if (b.x + b.w < 240) {
                            this.player.stop_jump(e_y + 40);
                        }
                        else {
                            this.player.stop_jump(e_y);
                        }
                        break loopBirds;
                    }
                    else {
                        this.player.stop_jump();
                    }
                }
            }
        }
    }

    getHighScore() {
        return this.highScore;
    }

    toggle_debug() {
        this.debug = !this.debug;
        this.set_debug();
    }

    set_debug() {
        this.collisionBoxesVisible = this.debug;
    }

    keyPressed(key) {
        if (key == "UP" && this.player.isAlive() && this.started) {
            if (!this.player.isCrouching()) {
                this.player.jump();
            }
        }
        else if (key == "DOWN" && this.player.isAlive() && this.started) {
            if (this.player.isJumping()) {
                this.player.stop_jumping = true;
                this.check_collisions_crouch();
            } else {
                this.player.crouch();
            }
        }
        else if (key == "D") {
            this.toggle_debug();
        }
    }

    keyReleased(key) {
        if (key == "DOWN" && this.player.isAlive() && this.started) {
            this.player.stop_crouch();
        }
    }
}