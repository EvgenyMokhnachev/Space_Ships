var SpaceShip = (function(){
    function SpaceShip(id, game, im){
        this.im = im;
        this.id = id;
        this.game = game;
        this.game.spaceShips[id] = this;

        this.graphics = null;
        this.protectiveField = null;

        this.init();
    }

    SpaceShip.prototype.init = function(){
        var graphics = new PIXI.Graphics();
        graphics.beginFill(this.im ? 0xADFF2F : 0xffffff, 1);
        graphics.moveTo(0,0);
        graphics.lineTo(0, -20);
        graphics.lineTo(20, 20);
        graphics.lineTo(0, 0);
        graphics.lineTo(-20, 20);
        graphics.lineTo(0, -20);
        graphics.endFill();

        var protectiveField = new PIXI.Graphics();
        protectiveField.beginFill(0xFFFFFF, 0.2);
        protectiveField.drawCircle(0,0, 30);
        protectiveField.endFill();
        this.protectiveField = protectiveField;
        this.protectiveField.visible = false;

        graphics.addChild(this.protectiveField);

        this.graphics = graphics;
        this.game.stage.addChild(this.graphics);
    };

    SpaceShip.prototype.remove = function(){
        this.game.stage.removeChild(this.graphics);
        delete this.game.spaceShips[this.id];
    };

    SpaceShip.prototype.move = function(x, y){
        this.graphics.position.x = x;
        this.graphics.position.y = y;
    };
    SpaceShip.prototype.rotate = function(rotationIndex){
        this.graphics.rotation = rotationIndex;
    };

    SpaceShip.prototype.setProtectiveField = function(value){
        this.protectiveField.visible = value;
    };

    return SpaceShip;
})();