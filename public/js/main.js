window.addEventListener('load', function(){
    var game = new Game();

    animate();
    function animate(){
        game.animate();
        game.update();
        requestAnimationFrame(animate);
    }

    window.addEventListener('keydown', function(e){
        game.setFullscreen();
        game.initKeys(e.keyCode, true);
    });

    window.addEventListener('keyup', function(e){
        game.initKeys(e.keyCode, false);
        //console.log(e.keyCode);
    });
});