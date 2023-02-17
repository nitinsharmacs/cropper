const px = v => `${v}px`;
const value = pxValue => +pxValue.split('px')[0];

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
  }

  move(x, y) {
    this.dx = this.x - x;
    this.dy = this.y - y;
    this.x = x;
    this.y = y;
  }
}

class Selector {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  resize(dw, dh) {
    this.width -= dw;
    this.height -= dh;
  }

  move(x, y) {
    this.x = x;
    this.y = y;
  }
}

let seControlPoint;

const main = () => {

  const selector = document.getElementById('cropper-selector');
  const center = selector.querySelector('.selector-center');

  const selectorObj = new Selector(200, 200, 300, 300);

  selector.style.width = px(300);
  selector.style.height = px(300);

  seControlPoint = document.getElementById('control-point-se');
  const [seControlPointRects] = seControlPoint.getClientRects();

  const point = new Point(seControlPointRects.x, seControlPointRects.y);

  let dragStart = false;
  let offsetX = 0;
  let offsetY = 0;

  const mouseDown = (e) => {
    console.log(e);
    dragStart = true;
    // if (e.target.className === 'selector-center') {
    // offsetX = selectorObj.width - e.offsetX;
    // console.log(e.offsetX);
    // offsetY = selectorObj.height - e.clientY;
    // return;
    // }
    offsetX = e.offsetX;
    offsetY = e.offsetY;
  };

  const mouseUp = () => {
    dragStart = false;
    offsetX = 0;
    offsetY = 0;
  };

  const movebySe = (e) => {
    if (dragStart) {
      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;

      point.move(x, y);
      console.log(point.dx, point.dy);
      selectorObj.resize(point.dx, point.dy);
      console.log(selectorObj);
      selector.style.width = px(selectorObj.width);
      selector.style.height = px(selectorObj.height);
    }
  };

  seControlPoint.addEventListener('mousedown', mouseDown);

  seControlPoint.addEventListener('mouseup', mouseUp);

  document.addEventListener('mousemove', (e) => {
    if (!dragStart) return;
    if (e.target.className === 'control-point se') {
      movebySe(e);
      return;
    }
    moveByCenter(e);
  });

  const moveByCenter = (e) => {
    if (dragStart) {
      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;

      selectorObj.move(x, y);
      selector.style.left = px(x);
      selector.style.top = px(y);
    }
  };

  selector.addEventListener('mousedown', mouseDown);

  selector.addEventListener('mouseup', mouseUp);

};

window.onload = main;
