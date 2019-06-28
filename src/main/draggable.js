/**
 * Mouse Dictionary (https://github.com/wtetsu/mouse-dictionary/)
 * Copyright 2018-present wtetsu, suiheilibe
 * Licensed under MIT
 */

import dom from "../lib/dom";

const MODE_NONE = 0;
const MODE_MOVING = 1;
const MODE_RESIZING = 2;

const POSITION_FIELDS = ["left", "top", "width", "height"];

export default class Draggable {
  constructor(normalStyles, movingStyles, scrollable) {
    this.normalStyles = normalStyles;
    this.movingStyles = movingStyles;
    this.mainElement = null;
    this.onchange = null;
    this.current = omap({}, null, POSITION_FIELDS);
    this.last = omap({}, null, POSITION_FIELDS);
    this.cursorEdge = this.getEdgeState();
    this.defaultCursor = null;
    this.selectable = false;
    this.initialize();

    if (scrollable) {
      this.onRightEdge = this.onEdgeWithScrollBar;
    } else {
      this.onRightEdge = this.onEdge;
    }
  }

  initialize() {
    this.starting = { x: null, y: null, width: null, height: null, left: null, right: null };
    this.mode = MODE_NONE;
  }

  onMouseMove(e) {
    if (this.current.width === null) {
      this.current.width = convertToInt(this.mainElement.style.width);
    }
    if (this.current.height === null) {
      this.current.height = convertToInt(this.mainElement.style.height);
    }

    switch (this.mode) {
      case MODE_MOVING:
        this.move(e);
        break;
      case MODE_RESIZING:
        this.resize(e);
        break;
      default:
        this.updateEdgeState(e);
    }
  }

  onMouseUp() {
    switch (this.mode) {
      case MODE_MOVING:
        dom.applyStyles(this.mainElement, this.normalStyles);
        break;
      case MODE_RESIZING:
        break;
    }
    this.finishChanging();
  }

  finishChanging() {
    this.initialize();
    this.callOnChange();
  }

  updateEdgeState(e) {
    if (this.selectable) {
      const insideWindow = this.isInsideWindow(e);
      if (insideWindow) {
        this.cursorEdge = this.getEdgeState();
        this.mainElement.style.cursor = "text";
      } else {
        this.selectable = false;
        this.mainElement.style.cursor = this.defaultCursor;
      }
      return;
    }
    this.cursorEdge = this.getEdgeState(e.x, e.y);
    const cursorStyle = getCursorStyle(this.cursorEdge) || this.defaultCursor;
    if (cursorStyle) {
      this.mainElement.style.cursor = cursorStyle;
    }
  }

  getEdgeState(x, y) {
    const edge = { top: false, right: false, bottom: false, left: false, any: false };
    if (isNaN(x) || isNaN(y)) {
      return edge;
    }

    const SPACE = 8;
    if (this.onEdge(x - this.current.left)) {
      edge.left = true;
    } else if (this.onRightEdge(this.current.left + (this.current.width + SPACE) - x)) {
      edge.right = true;
    }

    if (this.onEdge(y - this.current.top)) {
      edge.top = true;
    } else if (this.onEdge(this.current.top + (this.current.height + SPACE) - y)) {
      edge.bottom = true;
    }
    edge.any = edge.left || edge.right || edge.top || edge.bottom;
    return edge;
  }

  isInsideWindow(e) {
    return (
      e.x >= this.current.left &&
      e.x <= this.current.left + this.current.width &&
      e.y >= this.current.top &&
      e.y <= this.current.top + this.current.height
    );
  }

  onEdge(num) {
    return num <= 20;
  }

  onEdgeWithScrollBar(num) {
    return num <= 35;
  }

  move(e) {
    const latest = {
      left: this.starting.left + convertToInt(e.pageX) - this.starting.x,
      top: this.starting.top + convertToInt(e.pageY) - this.starting.y
    };
    if (areSame(this.current, latest)) {
      return;
    }
    Object.assign(this.current, latest);
    this.moveElement(this.current.left, this.current.top);
    dom.applyStyles(this.mainElement, this.movingStyles);
  }

  moveElement(left, top) {
    this.mainElement.style.left = `${left}px`;
    this.mainElement.style.top = `${top}px`;
  }

  resize(e) {
    const MIN_SIZE = 50;
    const x = convertToInt(e.pageX);
    const y = convertToInt(e.pageY);

    const latest = { height: null, width: null, top: null, left: null };
    if (this.cursorEdge.bottom) {
      latest.height = Math.max(this.starting.height + y - this.starting.y, MIN_SIZE);
    } else if (this.cursorEdge.top) {
      latest.height = Math.max(this.starting.height - y + this.starting.y, MIN_SIZE);
      latest.top = this.starting.top + y - this.starting.y;
    }
    if (this.cursorEdge.right) {
      latest.width = Math.max(this.starting.width + x - this.starting.x, MIN_SIZE);
    } else if (this.cursorEdge.left) {
      latest.width = Math.max(this.starting.width - x + this.starting.x, MIN_SIZE);
      latest.left = this.starting.left + x - this.starting.x;
    }
    this.applyNewStyle(latest, "height");
    this.applyNewStyle(latest, "width");
    this.applyNewStyle(latest, "top");
    this.applyNewStyle(latest, "left");
  }

  applyNewStyle(latest, prop) {
    const cval = this.current[prop];
    const lval = latest[prop];
    if (lval !== null && lval !== cval) {
      this.current[prop] = lval;
      this.mainElement.style[prop] = `${cval}px`;
    }
  }

  callOnChange() {
    if (!this.onchange) {
      return;
    }
    if (areSame(this.current, this.last)) {
      return;
    }
    this.onchange(Object.assign({}, this.current));
    Object.assign(this.last, this.current);
  }

  add(mainElement) {
    this.defaultCursor = "move";

    this.mainElement = mainElement;
    this.makeElementDraggable(mainElement);

    this.mainElement.addEventListener("click", () => {
      this.current.width = convertToInt(this.mainElement.style.width);
      this.current.height = convertToInt(this.mainElement.style.height);
    });
  }
  makeElementDraggable(mainElement) {
    mainElement.addEventListener("dblclick", e => {
      if (this.selectable) {
        return;
      }
      const edge = this.getEdgeState(e.x, e.y);
      const insideWindow = this.isInsideWindow(e);
      if (insideWindow && !edge.any) {
        this.selectable = true;
        this.mainElement.style.cursor = "text";
        return;
      }
      const SPACE = 5;
      if (edge.left) {
        this.current.left = SPACE;
      } else if (edge.right) {
        this.current.left = document.documentElement.clientWidth - this.mainElement.clientWidth - SPACE;
      }
      if (edge.top) {
        this.current.top = SPACE;
      } else if (edge.bottom) {
        this.current.top = window.innerHeight - this.mainElement.clientHeight - SPACE;
      }
      this.moveElement(this.current.left, this.current.top);
      this.finishChanging();
    });
    mainElement.style.cursor = this.defaultCursor;
    mainElement.addEventListener("mousedown", e => {
      if (this.selectable) {
        return;
      }
      this.mode = this.cursorEdge.any ? MODE_RESIZING : MODE_MOVING;
      this.startChanging(e, mainElement);
      e.preventDefault();
    });

    this.current.left = convertToInt(mainElement.style.left);
    this.current.top = convertToInt(mainElement.style.top);
  }
  startChanging(e, elem) {
    this.starting.x = convertToInt(e.pageX);
    this.starting.y = convertToInt(e.pageY);
    Object.assign(this.starting, omap(elem.style, convertToInt, POSITION_FIELDS));
  }
}

const omap = (o, funcOrValue, props) => {
  const result = {};
  for (let i = 0; i < props.length; i++) {
    const prop = props[i];
    result[prop] = funcOrValue ? funcOrValue(o[prop]) : funcOrValue;
  }
  return result;
};

const areSame = (a, b) => {
  // On the assumption that both have the same properties
  const props = Object.keys(b);
  let same = true;
  for (let i = 0; i < props.length; i++) {
    const prop = props[i];
    if (a[prop] !== b[prop]) {
      same = false;
      break;
    }
  }
  return same;
};

const convertToInt = str => {
  let r;
  if (str === null || str === undefined || str === "") {
    r = 0;
  } else {
    r = parseInt(str, 10);
    if (isNaN(r)) {
      r = 0;
    }
  }
  return r;
};

const getCursorStyle = edge => {
  let cursorStyle = null;
  if (edge.left && edge.top) {
    cursorStyle = "nwse-resize";
  } else if (edge.right && edge.bottom) {
    cursorStyle = "nwse-resize";
  } else if (edge.right && edge.top) {
    cursorStyle = "nesw-resize";
  } else if (edge.left && edge.bottom) {
    cursorStyle = "nesw-resize";
  } else if (edge.left) {
    cursorStyle = "ew-resize";
  } else if (edge.right) {
    cursorStyle = "ew-resize";
  } else if (edge.top) {
    cursorStyle = "ns-resize";
  } else if (edge.bottom) {
    cursorStyle = "ns-resize";
  }
  return cursorStyle;
};
