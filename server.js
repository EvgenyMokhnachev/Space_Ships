var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var SpaceShip = require('./entities/SpaceShip');
var Bullet = require('./entities/Bullet');
var GameProcessing = require('./processing/GameProcessing');

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
    SpaceShip.forItems(function (spaceShip) {
        spaceShip.processingAcceleration();
        spaceShip.processingProtectiveField();

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
            spaceShip.shoot();
        }

        if(spaceShip.keys.key2) {
            spaceShip.fastShoot();
        }

        if(spaceShip.keys.key3) {
            if(spaceShip.canSetAcceleration()) {
                spaceShip.setAcceleration();
            }
        }
        if(spaceShip.keys.key4) {
            if(spaceShip.canSetProtectiveField()) {
                spaceShip.setProtectiveField();
            }
        }

        if(spaceShip.keys.key5) {
            spaceShip.tripleShoot();
        }
    });

    Bullet.forItems(function (bullet) {
        if(bullet.move()){
            SpaceShip.forItems(function (spaceShip) {
                return GameProcessing.processingBulletAndShip(bullet, spaceShip);
            });
        }
    });

    io.emit('update', {spaceShips: spaceShips, bullets: bullets});

    setTimeout(update, 10);
}

io.on('connection', function(socket){
    io.emit('connected', {id: socket.id});
    socket.emit('imConnected', {id: socket.id, spaceShips: spaceShips, bullets: bullets});

    new SpaceShip(socket.id);

    socket.on('disconnect', function(){
        io.emit('disconnected', {id: socket.id});
        SpaceShip.getById(socket.id).delete();
    });

    socket.on('upKeyUp', function(){
        SpaceShip.getById(socket.id).keys.up = false;
    });
    socket.on('upKeyDown', function(){
        SpaceShip.getById(socket.id).keys.down = false;
    });
    socket.on('upKeyRight', function(){
        SpaceShip.getById(socket.id).keys.right = false;
    });
    socket.on('upKeyLeft', function(){
        SpaceShip.getById(socket.id).keys.left = false;
    });

    socket.on('downKeyUp', function(){
        SpaceShip.getById(socket.id).keys.up = true;
    });
    socket.on('downKeyDown', function(){
        SpaceShip.getById(socket.id).keys.down = true;
    });
    socket.on('downKeyRight', function(){
        SpaceShip.getById(socket.id).keys.right = true;
    });
    socket.on('downKeyLeft', function(){
        SpaceShip.getById(socket.id).keys.left = true;
    });

    socket.on('down1', function(){SpaceShip.getById(socket.id).keys.key1 = true;});
    socket.on('up1', function(){SpaceShip.getById(socket.id).keys.key1 = false;});
    socket.on('down2', function(){SpaceShip.getById(socket.id).keys.key2 = true;});
    socket.on('up2', function(){SpaceShip.getById(socket.id).keys.key2 = false;});
    socket.on('down3', function(){SpaceShip.getById(socket.id).keys.key3 = true;});
    socket.on('up3', function(){SpaceShip.getById(socket.id).keys.key3 = false;});
    socket.on('down4', function(){SpaceShip.getById(socket.id).keys.key4 = true;});
    socket.on('up4', function(){SpaceShip.getById(socket.id).keys.key4 = false;});
    socket.on('down5', function(){SpaceShip.getById(socket.id).keys.key5 = true;});
    socket.on('up5', function(){SpaceShip.getById(socket.id).keys.key5 = false;});
    socket.on('down6', function(){SpaceShip.getById(socket.id).keys.key6 = true;});
    socket.on('up6', function(){SpaceShip.getById(socket.id).keys.key6 = false;});
    socket.on('down7', function(){SpaceShip.getById(socket.id).keys.key7 = true;});
    socket.on('up7', function(){SpaceShip.getById(socket.id).keys.key7 = false;});
    socket.on('down8', function(){SpaceShip.getById(socket.id).keys.key8 = true;});
    socket.on('up8', function(){SpaceShip.getById(socket.id).keys.key8 = false;});
    socket.on('down9', function(){SpaceShip.getById(socket.id).keys.key9 = true;});
    socket.on('up9', function(){SpaceShip.getById(socket.id).keys.key9 = false;});
    socket.on('down0', function(){SpaceShip.getById(socket.id).keys.key0 = true;});
    socket.on('up0', function(){SpaceShip.getById(socket.id).keys.key0 = false;});
});