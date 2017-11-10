window.requestAnimFrame =
window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame ||
window.oRequestAnimationFrame ||
window.msRequestAnimationFrame ||
function(callback) {
  window.setTimeout(callback, 1000 / 30);
}

var imageFromPath = function(path) {
    var img = new Image();
    img.src = path;
    return img;
};
/*
 *返回数组中处于左右边界的对象
 */
var getHorizonObj = function(arr){
    var minX, maxX;
    arr.forEach(function(item){
      if(!minX && !maxX){
        minX = item.x;
        maxX = item.x;
      }else{
        if(maxX < item.x){
          maxX = item.x;
        }
        if(minX > item.x){
          minX = item.x;
        }
      }
    });
    return {
      minX: minX,
      maxX: maxX
    }
  }