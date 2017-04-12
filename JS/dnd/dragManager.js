"use strict";

/**
 * Handles global mouse events and dispatches them to the appropriate dragZones.
 * @constructor
 */
function DragManager() {
  let downX, downY;  // coordinates of the last mouse click
  let dragZone;  // currently active dragZone
  let isDragging = false;  // there is a shape being dragged right now

  document.onmousemove = onMouseMove;
  document.onmouseup = onMouseUp;
  document.onmousedown = onMouseDown;

  let self = this;

  function onMouseDown(e) {

    if (e.which != 1) return;  // not left-mouse click

    dragZone = findDragZone(e);
    if (!dragZone) {
      reset();
      return;
    }

    if (!dragZone._onDragInit(e)) {
      reset();
      return;
    }

    downX = e.downX;
    downY = e.downY;

    return false;
  }

  function onMouseMove(e) {
    if (!dragZone) return;

    if (!isDragging) {
      let moveX = e.pageX - downX;
      let moveY = e.pageY - downY;

      // accidental click
      if (Math.abs(moveX) < 3 && Math.abs(moveY) < 3) {
        reset();
        return;
      }

      // start dragging
      if (!dragZone._onDragStart(e)) {
        reset();
        return;
      }

      isDragging = true;
    }

    dragZone._onDragMove(e);
    return false;
  }

  function onMouseUp(e) {
    if (dragZone) { // dragging is in progress
      dragZone._onDragEnd(e);
    }

    reset();
  }

  function findDragZone(e) {
    let target = e.target;
    while (target != document && !target.dragZone) {
      target = target.parentNode;
    }

    return target.dragZone;
  }

  function reset() {
    dragZone = downX = downY = undefined;
    isDragging = false;
  }


}