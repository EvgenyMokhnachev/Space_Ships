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
        this.lastDeath = Date.now();
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

    return SpaceShip;
})();

module.exports = SpaceShip;