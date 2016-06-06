var Bullet = (function(){

    Bullet.items = {};
    Bullet.power = 50;
    Bullet.moveSpeedIndex = 5;
    
    function Bullet(spaceShip) {
        this.id = spaceShip.id+(spaceShip.shotId++);
        this.spaceShipId = spaceShip.id;
        this.position = {
            x: spaceShip.position.x,
            y: spaceShip.position.y
        };
        this.rotation = spaceShip.rotation;
        this.power = Bullet.power;
        
        Bullet.items[this.id] = this;
    }

    Bullet.prototype.move = function () {
        this.position.x += Math.sin(this.rotation) * Bullet.moveSpeedIndex;
        this.position.y -= Math.cos(this.rotation) * Bullet.moveSpeedIndex;

        if((this.position.x > 1920+100 || this.position.x < 0-100) || (this.position.y > 1080+100 || this.position.y < 0-100)){
            this.delete();
            return false;
        }
        
        return true;
    };
    
    Bullet.prototype.delete = function () {
        delete Bullet.items[this.id];
    };

    Bullet.forItems = function (func) {
        for(var i in Bullet.items) {
            if(Bullet.items.hasOwnProperty(i)){
                func(Bullet.items[i]);
            }
        }
    };

    return Bullet;
})();

module.exports = Bullet;