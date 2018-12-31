var ambientSound = new Audio('assets/audio/ambience.wav');
ambientSound.loop = true;
var heartbeatVolume = 1;
var vol = 0.1;

var random = function(min, max){
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var positive = {
  happyThoughtsWrap: document.getElementById('happyThoughts'),
  happyThoughts: document.getElementsByClassName('happyThought'),
  cachedColor: null,
  colors: ['#ff4c65', '#37eefe', '#ffd74c', '#4cff83'],
  input: function(){
    var that = this;
    window.addEventListener('mousedown', function(){
      negative.reset();
      function selectColor(){
        that.happyThoughtsWrap.style.backgroundColor = that.colors[random(0,that.colors.length-1)];
        if(that.happyThoughtsWrap.style.backgroundColor==that.cachedColor){
          selectColor();
        } else {
          that.cachedColor = that.happyThoughtsWrap.style.backgroundColor;
        }
      }
      selectColor();
      that.happyThoughtsWrap.style.opacity=1;
      for(var i=0; i<that.happyThoughts.length; i++){
        that.happyThoughts[i].style.opacity = 0;
      }
      that.happyThoughts[negative.chosen].style.opacity = random(60,90)/100;

      ambientSound.volume = 0;
      vol = 0;
      heartbeatVolume = 0;
    });
  },
  update: function(){
    if(ambientSound.volume<0.95){
      this.happyThoughtsWrap.style.opacity -= 0.005;
      ambientSound.volume += 0.005;
      heartbeatVolume += 0.005;
    } else {
      this.happyThoughtsWrap.style.opacity = 0;
      ambientSound.volume = 1;
      heartbeatVolume = 1;
    }
    if(vol<0.1){
      vol += 0.002;
    }
  }
}

var negative = {
  body: document.getElementsByTagName('body')[0],
  anxiousThoughts: document.getElementsByClassName('anxiousThought'),
  cachedChosen: 0,
  chosen: 0,
  target: 0,
  pace: 30,
  fontSize: 13,
  timer: null,
  reset: function(){
    this.pace = 30;
    this.fontSize = 13;
    clearTimeout(negative.timer);
    negative.flip();
  },
  flip: function(){
    var heartbeat = new Audio('assets/audio/beat.wav');
    heartbeat.volume = heartbeatVolume;

    this.target = random(0, this.anxiousThoughts.length-1);
    if(this.pace>=4){
      this.pace--;
    }
    if(vol<1){
      vol+=0.02;
    } else {
      vol=1;
    }
    if(this.fontSize<70){
      this.fontSize+=0.7;
    }
    this.timer = setTimeout(function(){
      negative.flip();
      heartbeat.play();
    },this.pace*100)
  },
  update: function(){
    positive.update();
    if(this.target>this.chosen){
      this.chosen++;
    } else if (this.target<this.chosen){
      this.chosen--;
    }
    if(this.chosen!=this.cachedChosen){
      this.body.style.background = 'rgba(0, 0, 0,0.' + random(90,99) + ')';
      this.anxiousThoughts[this.cachedChosen].style.opacity = random(0,7)/100;
      this.anxiousThoughts[this.chosen].style.opacity = random(50,90)/100;

      this.anxiousThoughts[this.cachedChosen].style.fontSize = this.fontSize + 'px';
      this.anxiousThoughts[this.chosen].style.fontSize = '13px';

      this.cachedChosen = this.chosen;
    }
  }
}

function loop(){
  negative.update();
  setTimeout(loop,1000/30);
}

document.getElementById('startMenu').addEventListener('mousedown', function(){
  ambientSound.play();
  setInterval(function(){
    var s = new Audio('assets/audio/beat.wav');
    s.volume = vol;
    s.play();
  },200);

  this.style.display = 'none';
  negative.flip();
  setTimeout(function(){
    positive.input();
  },50);
  loop();
});
