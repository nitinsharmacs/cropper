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
    this.dx = x - this.x;
    this.dy = y - this.y;
    this.x = x;
    this.y = y;
  }

  moveBy(dx, dy) {
    this.x += dx;
    this.dx = dx;

    this.y += dy;
    this.dy = dy;
  }
}

class Selector {
  constructor(pos, width, height, controlPoint) {
    this.pos = pos;
    this.width = width;
    this.height = height;
    this.viewX = 0;
    this.viewY = 0;
    this.controlPoint = controlPoint;
  }

  resize(dw, dh) {
    this.width += dw;
    this.height += dh;
  }

  move(x, y) {
    this.pos.move(x, y);
    this.controlPoint.moveBy(this.pos.dx, this.pos.dy);
  }

  moveControlPoint(x, y) {
    this.controlPoint.move(x, y);
  }

  setViewCoor(x, y) {
    this.viewX = x;
    this.viewY = y;
  }
}

const createSelector = ({ x, y, width, height, controlPoint }) => {
  const pos = new Point(x, y);
  const cP = new Point(
    x + width - controlPoint.width / 2,
    y + height - controlPoint.height / 2
  );

  return new Selector(pos, width, height, cP);
};

const updateSelector = (selector) => {
  const selectorElement = document.getElementById('cropper-selector');

  selectorElement.style.width = px(selector.width);
  selectorElement.style.height = px(selector.height);
  selectorElement.style.left = px(selector.pos.x);
  selectorElement.style.top = px(selector.pos.y);
};

const isInsideLeftRight = (ele, view) => {
  return ele.viewX >= view.x
    && (ele.viewX + ele.width) <= (view.x + view.width);
};

const isInsideTopBottom = (ele, view) => {
  return ele.viewY >= view.y &&
    (ele.viewY + ele.height) <= (view.y + view.height);
};

const initControlPoint = (view, selector) => {
  let [viewRects] = view.getClientRects();
  const controlPointEle = document.getElementById('control-point-se');

  let dragStart = false;
  let offsetX = 0;
  let offsetY = 0;

  controlPointEle.addEventListener('mousedown', (event) => {
    event.stopPropagation();

    offsetX = event.offsetX;
    offsetY = event.offsetY;

    dragStart = true;
  });

  controlPointEle.addEventListener('mouseup', (event) => {
    event.stopPropagation();

    offsetX = 0;
    offsetY = 0;

    dragStart = false;
  });

  controlPointEle.addEventListener('mousemove', (event) => {
    event.stopPropagation();

    if (!dragStart) return;

    const x = event.clientX - offsetX - viewRects.x;
    const y = event.clientY - offsetY - viewRects.y;

    selector.moveControlPoint(x, y);

    selector.resize(selector.controlPoint.dx, selector.controlPoint.dy);
    updateSelector(selector);
  });
};

const initSelectorEvents = (view, selector) => {
  let [viewRects] = view.getClientRects();

  const selectorElement = document.getElementById('cropper-selector');

  let dragStart = false;
  let offsetX = 0;
  let offsetY = 0;

  selectorElement.addEventListener('mousedown', (event) => {
    offsetX = event.offsetX;
    offsetY = event.offsetY;

    dragStart = true;
  });

  selectorElement.addEventListener('mouseup', () => {
    offsetX = 0;
    offsetY = 0;

    dragStart = false;
    selectorElement.style.cursor = 'default';
  });

  selectorElement.addEventListener('mousemove', (event) => {
    if (!dragStart) {
      return;
    }

    const viewX = event.clientX - offsetX;
    const viewY = event.clientY - offsetY;

    selector.setViewCoor(viewX, viewY);

    let x = selector.pos.x;
    let y = selector.pos.y;

    if (isInsideLeftRight(selector, viewRects)) {
      x = viewX - viewRects.x;
    }

    if (isInsideTopBottom(selector, viewRects)) {
      y = viewY - viewRects.y;
    }

    selector.move(x, y);
    selectorElement.style.cursor = 'move';
    updateSelector(selector);
  });

  initControlPoint(view, selector);

  window.onresize = () => {
    [viewRects] = view.getClientRects();
  };
};

const renderSelector = (view, selector) => {
  const selectorElement = createDOMTree([
    'div', { class: 'selector', id: 'cropper-selector' }, {},
    ['span', { class: 'control-point se', id: 'control-point-se' }]
  ]);

  view.appendChild(selectorElement);

  updateSelector(selector);
  initSelectorEvents(view, selector);
};
