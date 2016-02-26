var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
//var fs = require('fs');
//var crypto = require('crypto');
//
//var privateKey = fs.readFileSync('privatekey.pem').toString();
//var certificate = fs.readFileSync('certificate.pem').toString();
//var credentials = crypto.createCredentials({key: privateKey, cert: certificate, passphrase: '5300'});
//
//http.setSecure(credentials);

http.listen(8080, function(){
    console.log('Server started on 8080 port');
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    res.sendfile('views/index.html');
});

var spaceShips = {};
var bullets = {};

update();
function update(){
    for(var i in spaceShips){
        var spaceShip = spaceShips[i];

        if(spaceShip.keys.right) {
            if(spaceShip.rotation >= Math.PI*2) spaceShip.rotation = 0;
            spaceShip.rotation += 0.05;
        }
        if(spaceShip.keys.left) {
            if(spaceShip.rotation <= Math.PI*(-2)) spaceShip.rotation = 0;
            spaceShip.rotation -= 0.05;
        }
        if(spaceShip.keys.up) {
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
        }

        if(spaceShip.keys.key1) {
            if(spaceShip.lastShot + 250 < Date.now()){
                spaceShip.lastShot = Date.now();
                var bulletId = spaceShip.id+(spaceShip.shotId++);
                bullets[bulletId] = {
                    id: bulletId,
                    spaceShipId: spaceShip.id,
                    position: {
                        x: spaceShip.position.x,
                        y: spaceShip.position.y
                    },
                    rotation: spaceShip.rotation,
                    power: 50
                }
            }
        }

        if(spaceShip.keys.key2) {
            if(spaceShip.lastShot + 50 < Date.now() && spaceShips[spaceShip.id].score >= 10){
                spaceShip.lastShot = Date.now();
                var bulletId = spaceShip.id+(spaceShip.shotId++);
                bullets[bulletId] = {
                    id: bulletId,
                    spaceShipId: spaceShip.id,
                    position: {
                        x: spaceShip.position.x,
                        y: spaceShip.position.y
                    },
                    rotation: spaceShip.rotation,
                    power: 50
                };
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
                var bulletId = spaceShip.id+(spaceShip.shotId++);
                bullets[bulletId] = {
                    id: bulletId,
                    spaceShipId: spaceShip.id,
                    position: {
                        x: spaceShip.position.x,
                        y: spaceShip.position.y
                    },
                    rotation: spaceShip.rotation + 0.1,
                    power: 50
                };

                var bulletId = spaceShip.id+(spaceShip.shotId++);
                bullets[bulletId] = {
                    id: bulletId,
                    spaceShipId: spaceShip.id,
                    position: {
                        x: spaceShip.position.x,
                        y: spaceShip.position.y
                    },
                    rotation: spaceShip.rotation,
                    power: 50
                };

                var bulletId = spaceShip.id+(spaceShip.shotId++);
                bullets[bulletId] = {
                    id: bulletId,
                    spaceShipId: spaceShip.id,
                    position: {
                        x: spaceShip.position.x,
                        y: spaceShip.position.y
                    },
                    rotation: spaceShip.rotation - 0.1,
                    power: 50
                }
            }
        }
    }

    for(var bulletIndex in bullets){
        var bullet = bullets[bulletIndex];
        bullet.position.x += Math.sin(bullet.rotation)*5;
        bullet.position.y -= Math.cos(bullet.rotation)*5;

        if((bullet.position.x > 1920+100 || bullet.position.x < 0-100) || (bullet.position.y > 1080+100 || bullet.position.y < 0-100)){
            delete bullets[bulletIndex];
        } else {
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

    spaceShips[socket.id] = {
        id: socket.id,
        keys: {
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
        },
        position: {
            x: 1920/2,
            y: 1080-100
        },
        rotation: 0,
        lastShot: Date.now(),
        shotId: 0,
        score: 0,
        lastDeath: Date.now(),
        half: 100,
        speed: 2,
        acceleration: {
            active: false,
            normalSpeed: 2,
            accelerationSpeed: 4,
            duration: 2000,
            lastUse: Date.now() - 10000
        },
        protectiveField: {
            active: false,
            lastUse: Date.now() - 20000,
            duration: 5000
        }
    };

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