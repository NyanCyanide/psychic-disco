var song;
var fft;
var particles = [];
var img;
var middleimg;

function preload() {
  song = loadSound("./src/Music/cyberpunk.mp3");
  img = loadImage("./src/Background/1.jpg");
  middleimg = loadImage('./src/Background/5.png')
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  imageMode(CENTER);
  frameRate(60);
  fft = new p5.FFT();
}

function draw() {
  noFill();
  translate(width / 2, height / 2);
  image(img, 0, 0, width, height);
  image(middleimg, 0, 0, 240, 240)
  fft.analyze();
  amp = fft.getEnergy(20, 2000);
  var wave = fft.waveform();
  initial = 0;
  final = 180;
  

  for (var xx = 0; xx < 3; xx = xx + 1) {
    colorSwitch = 255;
    strokeWeigh = 4;
    for (var xy = 0; xy < 2; xy = xy + 1) {
      for (var t = -1; t <= 1; t += 2) {
        strokeWeight(strokeWeigh);
        xx == 0? stroke(0, 204, 200, colorSwitch) : (xx == 1 ? stroke(255, 20, 147, colorSwitch) : stroke(0, 0, 255, colorSwitch));
        beginShape();
        for (var i = initial; i <= final; i = i + 0.2) {
          var index = floor(map(i, 0, width, 0, wave.length - 1));
          var r = map(wave[index], -1, 1, 100, (xx == 0 ? 230 : xx == 1 ? 200 : 170));
          var x = r * sin(i) * t;
          var y = r * cos(i);
          vertex(x, y);
        }
        endShape();
      }
      strokeWeigh = 20;
      colorSwitch = 50;
    }
    initial = 180
    final = 360
  }

  var p = new Particle();
  particles.push(p);

  for (var i = particles.length - 1; i >= 0; i--) {
    if (!particles[i].edges()) {
      particles[i].update(amp > 150);
      particles[i].show();
    }
  }
}

function mouseClicked() {
  if (song.isPlaying()) {
    song.pause();
    noLoop();
  } else {
    song.play();
    loop();
  }
}

class Particle {
  constructor() {
    this.pos = p5.Vector.random2D().mult(150);
    this.vel = createVector(0, 0);
    this.acc = this.pos.copy().mult(random(0.0001, 0.00001));
    this.color = (5, 0, 0);
    this.w = random(2, 7);
  }
  edges() {
    if (
      this.pos.x < -width / 2 ||
      this.pos.x > width / 2 ||
      this.pos.y < -height / 2 ||
      this.pos.y > height / 2
    ) {
      return true;
    } else {
      return false;
    }
  }
  update(cond) {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    if (cond) {
      this.pos.add(this.vel);
      this.pos.add(this.vel);
      this.pos.add(this.vel);
    }
  }
  show() {
    strokeWeight(this.w);
    stroke(255, 200, 0);
    ellipse(this.pos.x, this.pos.y, 4);
    strokeWeight(this.w + 8);
    stroke(255, 200, 0, 60);
    ellipse(this.pos.x, this.pos.y, 4);
  }
}
