var Bullet = require('./Bullet');

var SpaceShip = (function(){

    SpaceShip.items = {};
    SpaceShip.rotateIndex = 0.05;

    function SpaceShip(id){
        this.id = id;
        this.keys = {
            up: false,
            down: false,
            right: false,
            left: false,
            key1: false,
            key2: false,
            key3: false,
            key4: false,
            key5: false,
            key6: false,
            key7: false,
            key8: false,
            key9: false,
            key0: false
        };
        this.position = {
            x: 1920/2,
            y: 1080-100
        };
        this.rotation = 0;
        this.lastShot = Date.now();
        this.shotId = 0;
        this.score = 0;
        this.half = 100;
        this.speed = 2;
        this.acceleration = {
            active: false,
            normalSpeed: 2,
            accelerationSpeed: 4,
            duration: 2000,
            lastUse: Date.now() - 10000
        };
        this.protectiveField = {
            active: false,
            lastUse: Date.now() - 20000,
            duration: 5000
        };

        this.setProtectiveField();

        SpaceShip.items[this.id] = this;
    }

    SpaceShip.prototype.moveUp = function () {
        var spaceShip = this;
        if(spaceShip.position.y <= 1080 && spaceShip.position.y >= 0){
            if(spaceShip.position.x >= 0 && spaceShip.position.x <= 1920){
                spaceShip.position.x += Math.sin(spaceShip.rotation)*spaceShip.speed;
                spaceShip.position.y -= Math.cos(spaceShip.rotation)*spaceShip.speed;
            } else {
                spaceShip.position.x = spaceShip.position.x <= 0 ? 1 : 1919;
            }
        } else {
            spaceShip.position.y = spaceShip.position.y <= 0 ? 1 : 1079;
        }
    };

    SpaceShip.prototype.turnRight = function () {
        var spaceShip = this;
        if(spaceShip.rotation >= Math.PI*2) spaceShip.rotation = 0;
        spaceShip.rotation += SpaceShip.rotateIndex;
    };

    SpaceShip.prototype.turnLeft = function () {
        var spaceShip = this;
        if(spaceShip.rotation <= Math.PI*(-2)) spaceShip.rotation = 0;
        spaceShip.rotation -= SpaceShip.rotateIndex;
    };

    SpaceShip.prototype.kill = function () {
        this.position.x = 1920/2;
        this.position.y = 1080-100;
        this.rotation = 0;
        this.score = this.score > 100 ? this.score - 100 : 0;
        this.half = 100;
        this.setProtectiveField();
    };

    SpaceShip.prototype.delete = function () {
        delete SpaceShip.items[this.id];
    };

    SpaceShip.prototype.canSetProtectiveField = function () {
        return this.protectiveField.lastUse + 20000 < Date.now() && !this.protectiveField.active;
    };
    SpaceShip.prototype.setProtectiveField = function () {
        this.protectiveField.lastUse = Date.now();
        this.protectiveField.active = true;
    };
    SpaceShip.prototype.processingProtectiveField = function () {
        if(this.protectiveField.active){
            if(this.protectiveField.lastUse + this.protectiveField.duration <= Date.now()) {
                this.protectiveField.active = false;
            }
        }
    };

    SpaceShip.prototype.canSetAcceleration = function () {
        return !this.acceleration.active && this.acceleration.lastUse + 10000 < Date.now();
    };
    SpaceShip.prototype.setAcceleration = function () {
        this.acceleration.lastUse = Date.now();
        this.acceleration.active = true;
        this.speed = this.acceleration.accelerationSpeed;
    };
    SpaceShip.prototype.processingAcceleration = function () {
        if(this.acceleration.active) {
            if(this.acceleration.lastUse + this.acceleration.duration <= Date.now()) {
                this.acceleration.active = false;
                this.speed = this.acceleration.normalSpeed;
            }
        }
    };

    SpaceShip.prototype.shoot = function () {
        if(this.lastShot + 250 < Date.now()){
            this.lastShot = Date.now();
            var bullet = new Bullet(this);
        }
    };

    SpaceShip.prototype.fastShoot = function () {
        if(this.lastShot + 50 < Date.now() && this.score >= 10){
            this.lastShot = Date.now();
            var bullet = new Bullet(this);
            this.score -= 10;
        }
    };

    SpaceShip.prototype.tripleShoot = function () {
        if(this.lastShot + 250 < Date.now()){
            this.lastShot = Date.now();
            var bullet1 = new Bullet(this);
            var bullet2 = new Bullet(this);
            var bullet3 = new Bullet(this);

            bullet1.rotation = bullet1.rotation + 0.1;
            bullet3.rotation = bullet3.rotation - 0.1;
        }
    };

    SpaceShip.forItems = function (func) {
        var breakFlag = false;
        for(var i in SpaceShip.items) {
            if(SpaceShip.items.hasOwnProperty(i)){
                if(func(SpaceShip.items[i])){
                    break;
                }
            }
        }
    };
    
    SpaceShip.getById = function (id) {
        return SpaceShip.items[id];
    };

    return SpaceShip;
})();

module.exports = SpaceShip;