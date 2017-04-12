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
  this._droppableSelector = options.droppableSelector || '.droppable';
}

/**
 * Drop dragObject onto a dropZone.
 * @param e {event} - source mouse event
 * @param dragObject {DragObject}
 * @returns {boolean} - true if dropZone accepted the object, false otherwise
 */
DropZone.prototype.drop = function (e, dragObject) {
  let dropElem = this._findDroppable(e, dragObject);

  if (!dropElem) {
    this.onDragCancel(dragObject);
    return false;
  } else {
    this.onDragEnd(dragObject, dropElem);
    return true;
  }
};


DropZone.prototype._findDroppable = function(e, dragObject) {
  // hide the topmost avatar element (otherwise elementFromPoint would return it)
  dragObject.hideAvatar();
  let elem = document.elementFromPoint(e.clientX, e.clientY);
  dragObject.showAvatar();

  if (elem == null) {  // possible if mouse pointer went outside the window
    return null;
  }

  return elem.closest(this._droppableSelector);
};


/**
 * Place the element inside of the pocket.
 * @param dragObject {DragObject}
 * @param pocket
 */
DropZone.prototype.onDragEnd = function(dragObject, pocket) {
};

/**
 * No pocket found. Dragging is cancelled.
 * @param dragObject {DragObject}
 */
DropZone.prototype.onDragCancel = function(dragObject) {
};
