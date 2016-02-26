var Game = (function(){
    function Game(){
        var game = this;

        this.id = null;
        this.width = 1920;
        this.height = 1080;
        this.renderer = PIXI.autoDetectRenderer(this.width, this.height,{backgroundColor : 0x000000, antialias: true, resolution: 1});
        this.renderer.view.style.maxWidth = '100%';
        this.renderer.view.style.maxHeight = '100%';
        document.body.appendChild(this.renderer.view);
        this.stage = new PIXI.Container();

        this.spaceShips = [];
        this.bullets = [];

        this.scoreText = null;
        this.score = 0;

        this.io = io();
        this.io.on('imConnected', function(responce){
            game.id = responce.id;
            var mySpaceShip = new SpaceShip(responce.id, game, true);

            for(var i in responce.spaceShips) var spaceShip = new SpaceShip(responce.spaceShips[i].id, game, false);

            game.init();
        });
    }

    Game.prototype.init = function(){
        var game = this;

        var text = new PIXI.Text(game.score+'', {fill: '#ffffff'});
        game.scoreText = text;
        game.stage.addChild(text);

        var controlsPanel = new PIXI.Container();
        for(var i= 0; i < 10; i++){
            var controlItem = new PIXI.Graphics();
            controlItem.beginFill(0xFFFFFF, 0.3);
            controlItem.drawRoundedRect(i*45,0,40,40, 5);
            controlItem.endFill();
            var text = new PIXI.Text(i+1 == 10 ? 0 : i+1, {font: 'bold 10px Arial', fill: 0xffffff});
            text.position.x = i*45 + 2;
            text.position.y = controlItem.height - text.height - 2;
            controlItem.addChild(text);
            controlsPanel.addChild(controlItem);
        }
        controlsPanel.position.x = 1920/2 - controlsPanel.width/2;
        controlsPanel.position.y = 1080 - controlsPanel.height - 10;

        this.stage.addChild(controlsPanel);

        game.io.on('connected', function(responce){
            if(responce.id != game.id){
                var spaceShip = new SpaceShip(responce.id, game, false);
            }
        });
        game.io.on('disconnected', function(responce){
            game.spaceShips[responce.id].remove();
        });
        game.io.on('update', function(responce){
            var mySpaceShip = responce.spaceShips[game.id];
            game.scoreText.text = mySpaceShip.score;

            var spaceShips = responce.spaceShips;
            var bullets = responce.bullets;
            for(var i in spaceShips){
                var spaceShipServer = spaceShips[i];
                var spaceShipClient = game.spaceShips[i];
                spaceShipClient.move(spaceShipServer.position.x, spaceShipServer.position.y);
                spaceShipClient.rotate(spaceShipServer.rotation);
                spaceShipClient.setProtectiveField(spaceShipServer.protectiveField.active);
            }
            for(var i in bullets){
                var bulletServer = bullets[i];
                var bulletClient = game.bullets[i];
                if(!bulletClient) {
                    bulletClient = new Bullet(game, bulletServer.id, bulletServer.spaceShipId);
                }
                bulletClient.move(bulletServer.position.x, bulletServer.position.y);
            }

            for(var clientBulletId in game.bullets){
                if(!bullets[clientBulletId]) game.bullets[clientBulletId].remove();
            }
        });
    };

    Game.prototype.update = function(){
    };

    Game.prototype.animate = function(){
        this.renderer.render(this.stage);
    };

    Game.prototype.initKeys = function(keyCode, value){
        if(keyCode == 37) {
            this.io.emit(!value ? 'upKeyLeft' : 'downKeyLeft');
        }
        if(keyCode == 38) {
            this.io.emit(!value ? 'upKeyUp' : 'downKeyUp');
        }
        if(keyCode == 39) {
            this.io.emit(!value ? 'upKeyRight' : 'downKeyRight');
        }
        if(keyCode == 40) {
            this.io.emit(!value ? 'upKeyDown' : 'downKeyDown');
        }

        if(keyCode == 48) this.io.emit(!value ? 'up0' : 'down0');
        if(keyCode == 49) this.io.emit(!value ? 'up1' : 'down1');
        if(keyCode == 50) this.io.emit(!value ? 'up2' : 'down2');
        if(keyCode == 51) this.io.emit(!value ? 'up3' : 'down3');
        if(keyCode == 52) this.io.emit(!value ? 'up4' : 'down4');
        if(keyCode == 53) this.io.emit(!value ? 'up5' : 'down5');
        if(keyCode == 54) this.io.emit(!value ? 'up6' : 'down6');
        if(keyCode == 55) this.io.emit(!value ? 'up7' : 'down7');
        if(keyCode == 56) this.io.emit(!value ? 'up8' : 'down8');
        if(keyCode == 57) this.io.emit(!value ? 'up9' : 'down9');
    };

    Game.prototype.setFullscreen = function(){
        var element = window.document.body;
        if(element.requestFullscreen) {
            element.requestFullscreen();
        } else if(element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if(element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if(element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    };

    return Game;
})();