function Bullet(){
  this.x = plane.x + 30;
  this.y = plane.y;
  this.speed = CONFIG.bulletSpeed;
  this.w = 1;
  this.h = CONFIG.bulletSize;
}
Bullet.prototype.draw = function(){
  ctx.fillStyle = 'white';
  ctx.fillRect(this.x, this.y, this.w, this.h);
}
Bullet.prototype.move = function(){
  this.y -= this.speed;
}