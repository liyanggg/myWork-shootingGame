var KeyBoard = function(){ 
    var k = {
      space: false,
      left: false,
      right: false,
      lastShoot: Date.now(),
  
    };
    k.keydown = function(e){
      var key = e.keyCode || e.which || e.charCode;
      switch(key){
        case 37:
          k.left = true;
          break;
        case 39:
          k.right = true;
          break;
        case 32:
          if (Date.now() - k.lastShoot > 150) {
          k.space = true;
          k.lastShoot = new Date();
          break;
          }
        }
    };
    k.keyup = function(e) {
      var key = e.keyCode || e.which || e.charCode;
      switch(key){
        case 37:
          k.left = false;
          break;
        case 39:
          k.right = false;
          break;
        case 32:
          k.space = false;
          break;
      }
    };
    document.onkeydown = k.keydown;
    document.onkeyup = k.keyup;
    return k;
  };
  