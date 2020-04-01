const LCDWidth = g.getWidth();
const LCDHeight = g.getHeight();

class Vec3 {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  originise() {
    this.x -= LCDWidth*0.5;
    this.y -= LCDHeight*0.5;
  }

  deOriginise() {
    this.x += LCDWidth*0.5;
    this.y += LCDHeight*0.5;
  }

  rotateX(deg) {
    const rad = deg * Math.PI / 180;
    const sin = Math.sin(rad);
    const cos = Math.cos(rad);

    this.originise();
    const Y = Number(this.y);
    const Z = Number(this.z);
    this.y = Y * cos - Z * sin;
    this.z = Y * sin + Z * cos;
    this.deOriginise();
  }

  rotateY(deg) {
    const rad = deg * Math.PI / 180;
    const sin = Math.sin(rad);
    const cos = Math.cos(rad);

    this.originise();
    const X = Number(this.x);
    const Z = Number(this.z);
    this.x = X * cos + Z * sin;
    this.z = Z * cos - X * sin;
    this.deOriginise();
  }

  rotateZ(deg) {
    const rad = deg * Math.PI / 180;
    const sin = Math.sin(rad);
    const cos = Math.cos(rad);

    this.originise();
    const X = this.x;
    const Y = this.y;
    this.x = cos * X - sin * Y;
    this.y = X * sin + Y * cos;
    this.deOriginise();
  }

  clone() {
    return new Vec3(this.x, this.y, this.z);
  }
}

class Hexagon {
  constructor() {
    this.vertices = [new Vec3(LCDWidth *0.5, LCDHeight*0.1, 0)];

    for (let i=1; i<6; i++) {
      const next = this.vertices[i-1].clone();
      next.rotateZ(60);
      this.vertices.push(next);
    }
  }

  draw() {
    g.clear();
    g.setColor(255, 0, 255);
    const start = this.vertices[0];
    g.moveTo(start.x, start.y);

    for (let i=1; i<6; i++) {
      let vert = this.vertices[i];
      g.lineTo(vert.x, vert.y);
    }

    g.lineTo(start.x, start.y);
  }

  rotateX(deg) {
    this.vertices.forEach(vert => vert.rotateX(deg));
  }

  rotateY(deg) {
    this.vertices.forEach(vert => vert.rotateY(deg));
  }

  rotateZ(deg) {
    this.vertices.forEach(vert => vert.rotateZ(deg));
  }
}


function draw() {
  const hex = new Hexagon();

  function frame() {
    hex.draw();
    hex.rotateZ(10);
  }

  setInterval(frame, 100);
}

Bangle.on('lcdPower', function(on) {
  if (on) draw();
});

setWatch(Bangle.showLauncher, BTN2, {repeat:false,edge:"falling"});