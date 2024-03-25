class CollisionBox {

    constructor(entityType, distanceOffset, ...bird_y) {

        if (arguments.length === 4) {
            this.x = arguments[0];
            this.y = arguments[1];
            this.w = arguments[2];
            this.h = arguments[3];
        }
        else {
            this.by = (bird_y.length >= 1) ? bird_y[0] : null;
            this.type = entityType;
            if (this.type != 6 && this.type != 7) {
                this.x = game.window_width + distanceOffset;
            }
            this.boxes = [];

            switch (this.type) {
                case 0:
                    this.boxes.push(new CollisionBox(this.x + 70, 472, 30, 64));
                    break;
                case 1:
                    this.boxes.push(new CollisionBox(this.x + 70, 472, 30, 64));
                    this.boxes.push(new CollisionBox(this.x + 102, 472, 30, 64));
                    break;
                case 2:
                    this.boxes.push(new CollisionBox(this.x + 71, 472, 31, 64));
                    this.boxes.push(new CollisionBox(this.x + 112 - 9, 472, 31, 64));
                    this.boxes.push(new CollisionBox(this.x + 145 - 9, 472, 31, 64));
                    break;
                case 3:
                    this.boxes.push(new CollisionBox(this.x + 70, 446, 44, 90));
                    break;
                case 4:

                    this.boxes.push(new CollisionBox(this.x + 70, 446, 46, 90));
                    this.boxes.push(new CollisionBox(this.x + 120, 446, 46, 90));
                    break;
                case 5:
                    this.boxes.push(new CollisionBox(this.x + 70, 446, 46, 90));
                    this.boxes.push(new CollisionBox(this.x + 120, 446, 46, 90));
                    this.boxes.push(new CollisionBox(this.x + 167, 446, 46, 90));
                    break;
                case 6:
                    this.boxes.push(new CollisionBox(203, 480, 10, 23));
                    this.boxes.push(new CollisionBox(212, 492, 44, 10));
                    this.boxes.push(new CollisionBox(212, 502, 40, 8));
                    this.boxes.push(new CollisionBox(216, 510, 29, 8));
                    this.boxes.push(new CollisionBox(220, 517, 26, 7));
                    this.boxes.push(new CollisionBox(220, 522, 11, 10));
                    this.boxes.push(new CollisionBox(237, 522, 11, 10));
                    this.boxes.push(new CollisionBox(228, 480, 35, 17));
                    this.boxes.push(new CollisionBox(239, 454, 37, 28));
                    break;
                case 7:
                    this.boxes.push(new CollisionBox(202, 488, 17, 20));
                    this.boxes.push(new CollisionBox(218, 488, 88, 30));
                    this.boxes.push(new CollisionBox(222, 517, 26, 17));
                    this.boxes.push(new CollisionBox(247, 517, 22, 9));
                    break;
                case 8:
                    this.boxes.push(new CollisionBox(this.x + 74, this.by + 25, 11, 8));
                    this.boxes.push(new CollisionBox(this.x + 82, this.by + 20, 19, 14));
                    this.boxes.push(new CollisionBox(this.x + 86, this.by + 15, 11, 8));
                    this.boxes.push(new CollisionBox(this.x + 96, this.by + 30, 28, 12));
                    this.boxes.push(new CollisionBox(this.x + 102, this.by + 37, 48, 12));
                    this.boxes.push(new CollisionBox(this.x + 102, this.by + 48, 33, 4));
                    this.boxes.push(new CollisionBox(this.x + 102, this.by + 51, 8, 20));
                    this.boxes.push(new CollisionBox(this.x + 109, this.by + 51, 8, 8));
                    break;
                case 9:
                    this.boxes.push(new CollisionBox(this.x + 74, this.by + 25, 11, 8));
                    this.boxes.push(new CollisionBox(this.x + 82, this.by + 20, 19, 14));
                    this.boxes.push(new CollisionBox(this.x + 86, this.by + 15, 11, 8));
                    this.boxes.push(new CollisionBox(this.x + 96, this.by + 30, 28, 12));
                    this.boxes.push(new CollisionBox(this.x + 102, this.by + 37, 48, 12));
                    this.boxes.push(new CollisionBox(this.x + 107, this.by + 48, 28, 4));
                    this.boxes.push(new CollisionBox(this.x + 98, this.by + 4, 8, 12));
                    this.boxes.push(new CollisionBox(this.x + 102, this.by + 10, 12, 20));
                    this.boxes.push(new CollisionBox(this.x + 113, this.by + 20, 8, 12));
                    this.boxes.push(new CollisionBox(this.x + 120, this.by + 27, 5, 4));
                    break;
            }
        }
    }

    update(speed) {
        this.x -= speed;
    }

    getCollisionBoxes() {
        return this.boxes;
    }

    display() {
        fill(255, 0, 0, 50);
        rect(this.x, this.y, this.w, this.h);
    }
}