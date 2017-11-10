
// 敌人
function Enemy(obj) {
  var self = this;
  this.x = obj.x; 
  this.y = obj.y; 
  this.w = CONFIG.enemySize; 
  this.h = CONFIG.enemySize; 
  this.speed = CONFIG.enemySpeed;
  this.path = imageFromPath(CONFIG.enemyIcon);
  this.boomPath = imageFromPath(CONFIG.enemyBoomIcon);
  this.direction = "right";
  this.boomStatus = "alive";
  this.boomFrame = 0;
  this.hasHit = false;
  this.boom = {
  	path: imageFromPath(CONFIG.enemyBoomIcon),
  	x: self.x,
  	y: self.y,
  	w: self.w,
  	h: self.h,
  }
}
Enemy.prototype.moveDown = function(){
  this.y += this.h;
}
Enemy.prototype.move = function(direction){
  if (direction === "left" ){
    this.x -= this.speed;
  }else{
    this.x += this.speed;
  }
}
Enemy.prototype.booming = function(){
  this.boomStatus = "booming";
  this.boomFrame += 1;
  if(this.boomFrame > 3){
    this.boomStatus = "boomed";
  }
}
