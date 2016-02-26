var Bullet = (function(){
    function Bullet(game, id, spaceShipId){
        this.id = id;
        this.spaceShipId = spaceShipId;
        this.game = game;
        this.graphics = null;
        this.game.bullets[id] = this;
        this.init();
    }

    Bullet.prototype.init = function(){
        var graphics = new PIXI.Graphics();
        graphics.beginFill(0xffffff, 1);
        graphics.drawCircle(0,0,2);
        graphics.endFill();
        this.graphics = graphics;
        this.game.stage.addChild(this.graphics);
    };

    Bullet.prototype.remove = function(){
        this.game.stage.removeChild(this.graphics);
        delete this.game.bullets[this.id];
    };

    Bullet.prototype.move = function(x, y){
        this.graphics.position.x = x;
        this.graphics.position.y = y;
    };

    return Bullet;
})();