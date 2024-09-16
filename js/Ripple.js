const MIN_LINES_PER = 30;
const MAX_LINES_PER = 50;
const MIN_STEPS = 10;
const MAX_STEPS = 30;

const lineWidthMin = 5;
const lineWidthMax = 50;
const lineLengthMin = 150;
const lineLengthMax = 350;
const lineDiameterGrow = 0.1;
const paddingBetween = 1;
const movementSpeed = 10;
const allowedMinLineLength = 30;

const noiseScale = 0.001;
const curlyness = 10;
let rippleId = 0;

class Ripple {
  constructor(txt, x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.txt = txt;
    this.startTime = millis() + 500;
    this.dy = radius;
    const col = random(50, 100);
    this.col = color("#3BB9FF"); // " ");
    this.lineDiameter = random(lineWidthMin, lineWidthMax);
    this.txtSize = random(14, 30);
    this.id = rippleId++;
  }

  displayRipple() {
    push();
    rotateX(PI / 3);

    this.displayTextAroundCircle(this.getLetters(), this.radius, 12);
    pop();
  }

  display() {
    push();
    fill(this.col);
    let c1 = color("#8BB3EC");
    let c2 = color("#0F5AE5");
    let c = lerpColor(c1, c2, (this.id + (1 % 5)) / 5);
    fill(c);
    noStroke();
    translate(this.x, this.y, 0);
    textSize(this.txtSize);
    // text(this.getLetters(), 0, 0);
    this.displayTextOnSineWaveWithRotation(this.txtSize * 0.65);
    pop();
  }

  displayTextOnSineWaveWithRotation(letterSpacing = 14) {
    const str = this.getLetters();
    const amplitude = 10;
    const phase = frameCount * 0.01 + this.id * 0.2;
    let x = 0; // Start at x = 0 and move right by letterSpacing for each letter
    let wavelength = 200; // Adjust this value to control the wavelength of the sine wave
    let k = TWO_PI / wavelength; // Angular frequency of the wave

    for (let i = 0; i < str.length; i++) {
      // Calculate y based on the sine wave equation
      let y = amplitude * sin(k * x + phase);

      // while (
      //   egret.isOver(this.x + x, this.y + amplitude / 2) &&
      //   this.x + x < width
      // ) {
      //   x += 50;
      // }

      // Calculate the derivative (slope) of the sine wave at this point
      let slope = amplitude * k * cos(k * x + phase);

      // Use atan2 to calculate the angle of the tangent based on the slope
      let angle = atan2(slope, 1); // The '1' is the horizontal distance between letters (constant)

      // Display each letter at the calculated (x, y) position and rotate it
      push();
      // fill(255);
      translate(x, y);
      rotate(angle); // Rotate the letter to be tangent to the curve
      text(str[i], 0, 0);
      pop();

      // Move to the next letter's position by the fixed spacing
      x += letterSpacing;
    }
  }
  displayBrush() {
    let numVerts = lineLengthMin + random(lineLengthMax - lineLengthMin);

    // diameter
    let lineDiameter = random(lineWidthMin, lineWidthMax);
    // let swMax = 10

    noFill();
    let dir = random() < 0.5 ? 1 : -1;

    let cx = this.x;
    let cy = this.y;

    let addedCircles = [];
    for (let j = 0; j < numVerts; j++) {
      let d = this.computeCurl(noise, cx, cy);

      // move
      cx += d[0] * dir * movementSpeed;
      // cy += d[1] * dir * movementSpeed;

      // break outside circle
      // if (!check_a_point(cx, cy, width/2, height/2, height/2)) break

      // let c = packer.tryToAddCircle(cx, cy, lineDiameter/2, lineDiameter/2, false)
      // if (!c) break
      let c = { x: cx, y: cy, r: this.lineDiameter / 2, t: [] };
      addedCircles.push(c);

      lineDiameter += lineDiameterGrow;
    }

    if (addedCircles.length > allowedMinLineLength) {
      // addedCircles.forEach(c => packer.addCircle(c))
      this.drawThroughCircles(addedCircles);
    }
  }

  drawThroughCircles(items) {
    push();
    const lines = [];

    for (let i = 0; i < items.length - 1; i++) {
      // draw a number of lines from this circle to X circles forward
      for (let j = 0; j < floor(random(MIN_LINES_PER, MAX_LINES_PER)); j++) {
        // current

        const verts = [];
        const lenPerc = random();

        // get an angle withing circle to draw from=>to
        const ang = random(Math.PI * 2);

        for (let k = 0; k < floor(random(MIN_STEPS, MAX_STEPS)); k++) {
          if (!items[i + k + 1]) break;

          const c1 = items[i + k];
          const c2 = items[i + k + 1];

          // angle from here to next
          const v = createVector(c2.x - c1.x, c2.y - c1.y);
          v.setMag(c1.r * lenPerc);
          v.rotate(ang);

          verts.push([c1.x + v.x, c1.y + v.y, ang]);
        }

        lines.push(verts);
      }
    }

    let red = true; //random() > 0.9;
    lines.forEach((line) => {
      noFill();
      // let f = random(0, 30)
      let f = random(0, 100);
      stroke(f, f, f, random(30, 50));
      if (red) stroke(150, 10, 10, random(10, 50));
      beginShape();
      // curveVertex(line[0][0], line[0][1]);
      line.forEach((v) => {
        strokeWeight(v[2] / Math.PI);
        // curveVertex(v[0], v[1]);
        vertex(v[0], v[1], 0);
      });
      endShape();
    });

    pop();
  }

  getLetters() {
    const msPerLetter = 100;
    const msPerStr = msPerLetter * this.txt.length;
    const dt = this.startTime + msPerStr;

    if (dt < this.startTime) {
      return "";
    }

    let numLetters = floor(
      map(millis(), this.startTime, dt, 0, this.txt.length, true)
    );
    return this.txt.substring(0, numLetters);
  }

  displayTextAroundCircle(str, radius, letterSpacing = 14) {
    let totalArcLength = 0; // Accumulator for the arc length
    push();
    rotate(frameCount * 0.01);
    let startAngle = PI;

    // while (totalArcLength < 2 * PI * radius) {
    push();
    rotate(0.005 * radius);

    for (let i = 0; i < str.length; i++) {
      radius += 0.2;
      // if (totalArcLength > 2 * radius * PI) {
      //   break;
      // }
      // Calculate the angle for each letter based on its position along the circle
      let angle = startAngle - totalArcLength / radius; // Subtract to rotate clockwise

      // Calculate the x and y positions for the letter along the circumference
      let x = cos(angle) * radius;
      let y = sin(angle) * radius;

      const phase = (2 * PI) / (radius / 50) / 2;
      let z = 10 * sin(phase + frameCount / 80);

      fill(80, 120, 255);
      fill(this.col);
      // let colorB =

      // Rotate each letter to match the circle's curvature
      let rotationAngle = angle + HALF_PI; // Rotate to align with the circle

      // Display each character at the calculated position
      push();
      translate(x, y, z);
      rotate(rotationAngle + PI); // Rotate 180 degrees to make text upright
      text(str[i], 0, 0);
      pop();

      // Increment the arc length by letterSpacing for the next character
      totalArcLength += letterSpacing;
    }
    pop();
    // }
    pop();
  }

  // from https://al-ro.github.io/projects/curl/
  computeCurl(n, x, y) {
    var eps = 1 / curlyness;

    //Find rate of change in X direction
    let n1 = n(x * noiseScale + eps, y * noiseScale);
    let n2 = n(x * noiseScale - eps, y * noiseScale);
    //Average to find approximate derivative
    let a = (n1 - n2) / (2 * eps);

    //Find rate of change in Y direction
    n1 = n(x * noiseScale, y * noiseScale + eps);
    n2 = n(x * noiseScale, y * noiseScale - eps);
    //Average to find approximate derivative
    let b = (n1 - n2) / (2 * eps);

    //Curl
    return [b, -a];
  }

  check_a_point(a, b, x, y, r) {
    var dist_points = (a - x) * (a - x) + (b - y) * (b - y);
    r *= r;
    if (dist_points < r) {
      return true;
    }
    return false;
  }
}
