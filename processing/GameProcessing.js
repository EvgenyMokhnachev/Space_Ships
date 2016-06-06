var SpaceShip = require('../entities/SpaceShip');

var GameProcessing = (function () {

    function GameProcessing(){

    }

    GameProcessing.prototype.getXDistanceBulletToShip = function (bullet, spaceShip) {
        var distance = bullet.position.x - spaceShip.position.x;
        if(distance < 0) {
            distance = distance * -1;
        }
        return distance;
    };

    GameProcessing.prototype.getYDistanceBulletToShip = function (bullet, spaceShip) {
        var distance = bullet.position.y - spaceShip.position.y;
        if(distance < 0) {
            distance = distance * -1;
        }
        return distance;
    };

    GameProcessing.prototype.getDistanceBulletToShip = function (bullet, spaceShip) {
        return Math.sqrt(
            Math.pow(spaceShip.position.x-bullet.position.x, 2)
            +
            Math.pow(spaceShip.position.y-bullet.position.y, 2));
    };

    GameProcessing.prototype.processingBulletAndShip = function (bullet, spaceShip) {
        if (bullet.spaceShipId != spaceShip.id) {
            if(!spaceShip.protectiveField.active) {
                if(this.getXDistanceBulletToShip(bullet, spaceShip) <= 20) {
                    if(this.getYDistanceBulletToShip(bullet, spaceShip) <= 20) {
                        if((spaceShip.half -= bullet.power) <= 0) {
                            SpaceShip.getById(bullet.spaceShipId).score += 100;
                            spaceShip.kill();
                        }
                        bullet.delete();
                        return true;
                    }
                }
            }
        }
        return false;
    };

    return GameProcessing;
})();

module.exports = new GameProcessing();