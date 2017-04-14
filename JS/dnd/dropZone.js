"use strict";

/**
 * Zone that contains pockets that can accept shapes.
 * Usage: Initialize the object and store inside the DOM element (container) as `node.dropZone`.
 * @param options.container {Node} - DOM node of the zone
 * @param options.droppableSelector {string} - CSS selector to find pockets
 * @constructor
 */
function DropZone(options) {
  options.container.dropZone = this;  // save in DOM

  this._container = options.container;
  this._pocketSelector = options.droppableSelector || '.pocket';
  this._pocketHighlightClass = options.pocketHighlightClass || '.pocket_active';

  this._pocket = null; // active pocket
}

/**
 * Drop dragObject onto a dropZone.
 * @param e {event} - source mouse event
 * @param dragObject {DragObject}
 * @returns {boolean} - true if dropZone accepted the object, false otherwise
 */
DropZone.prototype.drop = function (e, dragObject) {
  let pocket = this._findPocket(e, dragObject);

  if (!pocket) {
    this.onDragCancel(dragObject);
    this.reset();
    return false;
  } else {
    this.onDragEnd(dragObject, pocket);
    this.reset();
    return true;
  }
};


DropZone.prototype._findPocket = function (e, dragObject) {
  // hide the topmost avatar element (otherwise elementFromPoint would return it)
  // dragObject.hideAvatar();
  // let target = document.elementFromPoint(e.clientX, e.clientY);
  let target = e.target;
  while (target !== document && !target.classList.contains(normalizeToClass(this._pocketSelector))) {
    if(target === this._container) break;
    target = target.parentNode;
  }
  // dragObject.showAvatar();

  if (target === document || target === this._container) {
    return null;
  }
  return target;

  // if (target == null) {  // possible if mouse pointer went outside the window
  //   return null;
  // }

  // return target.closest(this._pocketSelector);
};


/**
 * Place the element inside of the pocket.
 * @param dragObject {DragObject}
 * @param pocket
 */
DropZone.prototype.onDragEnd = function (dragObject, pocket) {
};

/**
 * No pocket found. Dragging is cancelled.
 * @param dragObject {DragObject}
 */
DropZone.prototype.onDragCancel = function (dragObject) {
};

/**
 * Drag object entered the drop zone.
 * @param e - mouse event
 * @param dragObject {DragObject}
 */
DropZone.prototype.onDragEnter = function (e, dragObject) {
};

/**
 * Drag object leaved the drop zone.
 * @param e - mouse event
 * @param dragObject {DragObject}
 */
DropZone.prototype.onDragLeave = function (e, dragObject) {
};


DropZone.prototype._onDragMove = function (e, dragObject) {
  let newPocket = this._findPocket(e, dragObject);

  if(newPocket !== this._pocket) {  // moved out of an active pocket
    newPocket && this.highlightPocket(newPocket);
    this._pocket && this.deHighlightPocket(this._pocket);
  }

  this._pocket = newPocket;
};


/**
 * Highlight the active pocket.
 * @param pocket
 */
DropZone.prototype.highlightPocket = function (pocket) {
  pocket.classList.add(normalizeToClass(this._pocketHighlightClass));
};

/**
 * Cancel highlighting on the active pocket.
 * @param pocket
 */
DropZone.prototype.deHighlightPocket = function (pocket) {
  pocket.classList.remove(normalizeToClass(this._pocketHighlightClass));
};


DropZone.prototype.reset = function () {
  this._pocket && this.deHighlightPocket(this._pocket);
  this._pocket = null;
};
