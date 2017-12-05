var CONFIG = {
  status: 'start', // 游戏开始默认为开始中
  level: 1, // 游戏默认等级
  totalLevel: 3, // 总共6关
  num: 6, // 游戏默认每行多少个怪兽
  padding: 30, // 默认画布的间隔
  bulletSize: 10, // 默认子弹长度
  bulletSpeed: 10, // 默认子弹的移动距离
  enemySpeed: 2, // 默认敌人移动距离
  enemySize: 50, // 默认敌人的尺寸
  enemyGap: 10,  // 默认敌人之间的间距
  enemyIcon: './img/enemy.png', // 怪兽的图像
  enemyBoomIcon: './img/boom.png', // 怪兽死亡的图像
  enemyDirection: 'right', // 默认敌人一开始往右移动
  planeSpeed: 5, // 默认飞机每一步移动的距离
  planeSize: {
    width: 60,
    height: 100
  }, // 默认飞机的尺寸,
  planeIcon: './img/plane.png',
  scorePos: {
    x: 20,
    y: 20
  }
};
var log = console.log.bind(console);

var container = document.getElementById('game');
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var curScoreDiv = document.querySelector(".cur-score");
var curScore = document.querySelector(".cur-score .score");
var totalScore = document.querySelector(".game-failed .score");
var levelText = document.querySelector('.game-level');
var nextLevelText = document.querySelector('.game-next-level');

var GAME = {
  init: function() {
    this.score = 0;
    this.status = 'start';
    this.bindEvent();
    this.keyBoard;

    //定义怪兽活动边界
    this.eneLimitMinX = CONFIG.padding;
    this.eneLimitMaxX = canvas.width - CONFIG.padding - CONFIG.enemySize;
    this.eneLimitMaxY = canvas.height - CONFIG.padding - CONFIG.planeSize.height; 
  },
  bindEvent: function() {
    var self = this;
    var playBtn = document.querySelector('.js-play');
    var replayBtn = document.querySelectorAll('.js-replay');
    var nextBtn = document.querySelector('.js-next');
    playBtn.onclick = function() {
      self.level = 1;
      self.play();
    }
    replayBtn.forEach(function(replay) {
      replay.onclick = function(){
        self.score = 0;        
        self.level = 1;
        self.play();
      }
    })
    nextBtn.onclick = function() {
      self.level += 1;
      self.play();
    }
  },
  draw: function(ele){
    ctx.drawImage(ele.path, ele.x, ele.y, ele.w, ele.h);
  },
  setStatus: function(status) { //更新状态：start playing failed success
    this.status = status;
    container.setAttribute("data-status", status);
  },
  play: function() {
    //游戏元素初始化
    plane = new Plane();
    bullets = [];
    enemies = [];
    
    log(this.level);
    for(var line = 0; line < this.level; line++){
      for(var n = 0; n < CONFIG.num; n++){
        var eneObj = {
          x: CONFIG.padding + n * (CONFIG.enemyGap + CONFIG.enemySize),
          y: CONFIG.padding + line * CONFIG.enemySize
        };  
        enemies.push(new Enemy(eneObj));
      }
    };
    this.setStatus('playing');
    this.keyBoard = new KeyBoard();
    curScoreDiv.style.display = "block";
    curScore.innerText = this.score;

    this.update();   
  },
  update: function(){
    var k = this.keyBoard;
    var self = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(k.space){
      plane.shoot();
    };
    if(k.left){
      plane.moveLeft();
    };
    if(k.right){
      plane.moveRight();
    };

    this.updateEle();

    //成功消灭当前level所有怪兽时退出游戏
    if(enemies.length === 0){
      curScoreDiv.style.display = "none";
      plane = {};
      log(self.level);
      if(self.level == CONFIG.totalLevel){
        self.setStatus('all-success');
      }else{
        self.setStatus('success');
        self.renderLevel();
      }
      return; 
    }
    //通过所有level,游戏结束
    if(this.updateEle() === 'end'){
      return;
    }
    /*
     *绘制元素
     */    
    this.draw(plane);

    for(var i = 0; i < bullets.length; i++){
      var b = bullets[i];
      if(b.y >= b.h + CONFIG.padding){
        b.move(); 
        b.draw();
      }
    }
    
    var i = enemies.length;
    while(i--){
      var e = enemies[i];
      switch(e.boomStatus){
        case"alive": 
          this.draw(e);
          break;
        case"booming":
          ctx.drawImage(e.boomPath, e.x, e.y, e.w, e.h);
          break;
      }
    }

    requestAnimFrame(this.update.bind(this));

  },
  updateEle: function(){
    var self = this;
    var eneNeedDown = false;
    var h = getHorizonObj(enemies);
    if(h.minX < this.eneLimitMinX || h.maxX > this.eneLimitMaxX){
      eneNeedDown = true;
    }

    var i = enemies.length;
    while(i--){
      var e = enemies[i];
      if(eneNeedDown === true){
        e.moveDown();
        e.direction = e.direction === "left" ? "right" : "left";
      }
      e.move(e.direction); 
      /*
       *子弹击中怪兽，消除子弹，怪兽进入爆炸状态持续3帧后消除
       */
      var j = bullets.length;
      while(j--){
        var con1 = e.x < bullets[j].x && bullets[j].x < e.x + e.w;
        var con2 = e.y < bullets[j].y && bullets[j].y < e.y + e.h;
        if(con1 && con2){
          e.hasHit = true;
        }
      }
      switch(e.boomStatus){
        case"alive": 
          if(e.hasHit == true){
            bullets.splice(j, 1);
            e.booming();
          }   
          break;
        case"booming":
          e.booming();
          break;
        case"boomed":
          enemies.splice(i, 1);
          this.score += 1;
          curScore.innerText = this.score;
          break;
      } 
      /*
       *怪兽到达底部边界时退出游戏
       */
      if(e.y > self.eneLimitMaxY - CONFIG.enemySize){
        enemies.splice(i, 1);
        curScoreDiv.style.display = "none";
        totalScore.innerText = this.score;
        plane = {};
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        self.setStatus('failed'); 
        return 'end';
      }     
    }
  },
  renderLevel: function() {
    levelText.innerText = '当前Level：' + this.level;
    nextLevelText.innerText = '下一个Level： ' + (this.level + 1);
  },
};
// 初始化
GAME.init();

