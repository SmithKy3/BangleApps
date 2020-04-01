const W = g.getWidth();
const H = g.getHeight();
const buf = Graphics.createArrayBuffer(W, 200, 1,{msb:true});

class Vec3 {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  clone() {
    return new Vec3(this.x, this.y, this.z);
  }
  originise() {
    this.x -= W*0.25;
    this.y -= H*0.25;
  }
  deOriginise() {
    this.x += W*0.25;
    this.y += H*0.25;
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
}

class RotatingHexagon {
  constructor() {
    this.vertices = [new Vec3(W *0.25, 0, 0)];

    for (let i=1; i<6; i++) {
      const next = this.vertices[i-1].clone();
      next.rotateZ(60);
      this.vertices.push(next);
    }
  }
  drawFrame() {
    const start = this.vertices[0];
    buf.moveTo(start.x, start.y);

    for (let i=1; i<6; i++) {
      let vert = this.vertices[i];
      buf.lineTo(vert.x, vert.y);
    }

    buf.lineTo(start.x, start.y);

    this.rotateX(5);
    this.rotateY(5);
    this.rotateZ(5);
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

function drawTime() {
  const today = new Date();
  let minutes = today.getMinutes().toString();
  minutes = minutes.length === 1 ? '0'+minutes : minutes;
  let seconds = today.getSeconds().toString();
  seconds = seconds.length === 1 ? '0'+seconds : seconds;
  const time = today.getHours() + ':' + minutes + ':' + seconds;
  const date = today.getDate() + ' / ' + today.getMonth() + ' / ' + today.getFullYear();
  buf.setFont('6x8', 5);
  buf.setFontAlign(0); // centers text
  buf.drawString(time, W*0.5, H*0.5, true);
  buf.setFont('Vector12', 15);
  buf.drawString(date, W*0.5, H*0.65, true);
}

const hex = new RotatingHexagon();
function frame() {
  buf.clear();
  g.setColor(0.5, 1, 0.75);
  hex.drawFrame();
  drawTime();
  g.drawImage({width:W,height:H,buffer:buf.buffer},0,40);
}

Bangle.on('lcdPower',function(on) {
  if (on)
    frame();
});

g.clear();
Bangle.loadWidgets();
Bangle.drawWidgets();
// Update time once a second
setInterval(frame, 1000);
frame();

// Show launcher when middle button pressed
setWatch(Bangle.showLauncher, BTN2, {repeat:false,edge:"falling"});