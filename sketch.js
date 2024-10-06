const bird = {
  imgs: [],
  imgIndex: 0,
  x: 0,
  y: 0,
  display: function () {
    if (this.imgs[this.imgIndex]) {
      image(this.imgs[this.imgIndex], this.x, this.y); // 200, 200, 0, 0, 0, 0, CONTAIN);
    }
  },
  update: function () {
    this.x += 2;
    this.x %= width;
    if (frameCount % 8 === 0) {
      this.imgIndex++;
      if (this.imgIndex > this.imgs.length - 1) {
        this.imgIndex = 0;
      }
    }
  },
};

function preload() {
  for (let i = 1; i < 13; i++) {
    bird.imgs[i - 1] = loadImage("assets/walk/" + i + ".png");
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  bird.display();
  bird.update();
}
