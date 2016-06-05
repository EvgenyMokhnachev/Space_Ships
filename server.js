var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var SpaceShip = require('./entities/SpaceShip');
var Bullet = require('./entities/Bullet');

http.listen(8080, function(){
    console.log('Server started on 8080 port');
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    res.sendfile('views/index.html');
});

var spaceShips = SpaceShip.items;
var bullets = Bullet.items;

update();
function update(){
    for(var i in spaceShips){
        var spaceShip = spaceShips[i];

        if(spaceShip.keys.right) {
            spaceShip.turnRight();
        }
        if(spaceShip.keys.left) {
            spaceShip.turnLeft();
        }
        if(spaceShip.keys.up) {
            spaceShip.moveUp();
        }

        if(spaceShip.keys.key1) {
            if(spaceShip.lastShot + 250 < Date.now()){
                spaceShip.lastShot = Date.now();
                var bullet = new Bullet(spaceShip);
                bullets[bullet.id] = bullet;
            }
        }

        if(spaceShip.keys.key2) {
            if(spaceShip.lastShot + 50 < Date.now() && spaceShips[spaceShip.id].score >= 10){
                spaceShip.lastShot = Date.now();
                var bullet = new Bullet(spaceShip);
                bullets[bullet.id] = bullet;
                spaceShips[spaceShip.id].score -= 10;
            }
        }


        if(spaceShip.acceleration.active) {
            if(spaceShip.acceleration.lastUse + spaceShip.acceleration.duration <= Date.now()) {
                spaceShip.acceleration.active = false;
                spaceShip.speed = spaceShip.acceleration.normalSpeed;
            }
        }
        if(spaceShip.keys.key3) {
            if(!spaceShip.acceleration.active && spaceShip.acceleration.lastUse + 10000 < Date.now()) {
                spaceShip.acceleration.lastUse = Date.now();
                spaceShip.acceleration.active = true;
                spaceShip.speed = spaceShip.acceleration.accelerationSpeed;
            }
        }

        if(spaceShip.protectiveField.active){
            if(spaceShip.protectiveField.lastUse + spaceShip.protectiveField.duration <= Date.now()) {
                spaceShip.protectiveField.active = false;
            }
        }
        if(spaceShip.keys.key4) {
            if(spaceShip.protectiveField.lastUse + 20000 < Date.now() && !spaceShip.protectiveField.active) {
                spaceShip.protectiveField.lastUse = Date.now();
                spaceShip.protectiveField.active = true;
            }
        }

        if(spaceShip.keys.key5) {
            if(spaceShip.lastShot + 250 < Date.now()){
                spaceShip.lastShot = Date.now();
                var bullet1 = new Bullet(spaceShip);
                var bullet2 = new Bullet(spaceShip);
                var bullet3 = new Bullet(spaceShip);

                bullet1.rotation = bullet1.rotation + 0.1;
                bullet3.rotation = bullet3.rotation - 0.1;

                bullets[bullet1.id] = bullet1;
                bullets[bullet2.id] = bullet2;
                bullets[bullet3.id] = bullet3;
            }
        }
    }

    for(var bulletIndex in bullets){
        var bullet = bullets[bulletIndex];
        if(bullet.move()){
            for(var shipId in spaceShips){
                if(bullet.spaceShipId == spaceShips[shipId].id) continue;
                if(spaceShips[shipId].lastDeath + 2000 > Date.now()) continue;

                var dBulletShip = Math.sqrt(Math.pow(spaceShips[shipId].position.x-bullet.position.x, 2) + Math.pow(spaceShips[shipId].position.y-bullet.position.y, 2));
                if(dBulletShip < 30){
                    spaceShips[shipId].half -= bullets[bulletIndex].power;
                    if(spaceShips[shipId].half <= 0 && !spaceShips[shipId].protectiveField.active){
                        spaceShips[bullets[bulletIndex].spaceShipId].score += 100;
                        spaceShips[shipId].lastDeath = Date.now();
                        spaceShips[shipId].position.x = 1920/2;
                        spaceShips[shipId].position.y = 1080-100;
                        spaceShips[shipId].rotation = 0;
                        spaceShips[shipId].score -= 100;
                    }
                    delete bullets[bulletIndex];
                    break;
                }
            }
        }
    }

    io.emit('update', {spaceShips: spaceShips, bullets: bullets});

    setTimeout(update, 10);
}

io.on('connection', function(socket){
    io.emit('connected', {id: socket.id});
    socket.emit('imConnected', {id: socket.id, spaceShips: spaceShips, bullets: bullets});

    spaceShips[socket.id] = new SpaceShip(socket.id);

    socket.on('disconnect', function(){
        io.emit('disconnected', {id: socket.id});
        delete spaceShips[socket.id];
    });

    socket.on('upKeyUp', function(){
        spaceShips[socket.id].keys.up = false;
    });
    socket.on('upKeyDown', function(){
        spaceShips[socket.id].keys.down = false;
    });
    socket.on('upKeyRight', function(){
        spaceShips[socket.id].keys.right = false;
    });
    socket.on('upKeyLeft', function(){
        spaceShips[socket.id].keys.left = false;
    });

    socket.on('downKeyUp', function(){
        spaceShips[socket.id].keys.up = true;
    });
    socket.on('downKeyDown', function(){
        spaceShips[socket.id].keys.down = true;
    });
    socket.on('downKeyRight', function(){
        spaceShips[socket.id].keys.right = true;
    });
    socket.on('downKeyLeft', function(){
        spaceShips[socket.id].keys.left = true;
    });

    socket.on('down1', function(){spaceShips[socket.id].keys.key1 = true;});
    socket.on('up1', function(){spaceShips[socket.id].keys.key1 = false;});
    socket.on('down2', function(){spaceShips[socket.id].keys.key2 = true;});
    socket.on('up2', function(){spaceShips[socket.id].keys.key2 = false;});
    socket.on('down3', function(){spaceShips[socket.id].keys.key3 = true;});
    socket.on('up3', function(){spaceShips[socket.id].keys.key3 = false;});
    socket.on('down4', function(){spaceShips[socket.id].keys.key4 = true;});
    socket.on('up4', function(){spaceShips[socket.id].keys.key4 = false;});
    socket.on('down5', function(){spaceShips[socket.id].keys.key5 = true;});
    socket.on('up5', function(){spaceShips[socket.id].keys.key5 = false;});
    socket.on('down6', function(){spaceShips[socket.id].keys.key6 = true;});
    socket.on('up6', function(){spaceShips[socket.id].keys.key6 = false;});
    socket.on('down7', function(){spaceShips[socket.id].keys.key7 = true;});
    socket.on('up7', function(){spaceShips[socket.id].keys.key7 = false;});
    socket.on('down8', function(){spaceShips[socket.id].keys.key8 = true;});
    socket.on('up8', function(){spaceShips[socket.id].keys.key8 = false;});
    socket.on('down9', function(){spaceShips[socket.id].keys.key9 = true;});
    socket.on('up9', function(){spaceShips[socket.id].keys.key9 = false;});
    socket.on('down0', function(){spaceShips[socket.id].keys.key0 = true;});
    socket.on('up0', function(){spaceShips[socket.id].keys.key0 = false;});
});