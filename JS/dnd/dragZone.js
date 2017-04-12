"use strict";
/**
 * Zone that contains elements that can be dragged (shapes).
 * Usage: Initialize the object and store inside the DOM element (container) as `node.dragZone`.
 * @param container {Node} - DOM node of the zone
 * @param shapeSelector {string} - CSS selector to find draggable elements (by default, '.draggable')
 * @param cloneSelector {string} - CSS selector to identify elements that are dragged as clones
 * @constructor
 */
function DragZone(container, shapeSelector = '.draggable', cloneSelector = '.drag-clone') {
  container.dragZone = this;  // save in DOM

  this._shapeSelector = shapeSelector;
  this._cloneSelector = cloneSelector;
  this._container = container;
  this._dragObject = null;
}

DragZone.prototype._onDragInit = function (e) {
  let shape = this.findShape(e);
  if (!shape) return false;

  this._dragObject = new DragObject(shape, this.isDragClone(shape), e);

  return true;
};

/**
 * Returns shape element under cursor (or undefined).
 * @param e - mouse left click event
 * @returns {HTMLElement | null} - draggable element
 */
DragZone.prototype.findShape = function (e) {
  let shape = e.target.closest(this._shapeSelector);
  if(!shape) return null;

  return shape;
};

/**
 * Return true if the shape should be dragged as clone.
 * @param shape {Node} - shape element
 * @returns {boolean}
 */
DragZone.prototype.isDragClone = function (shape) {
  let dragClone = false;
  if (shape.classList.contains(this._cloneSelector)) {
    dragClone = true;
  }

  return dragClone;
};

DragZone.prototype._onDragStart = function (e) {
  let isAvatarCreated = this._dragObject._initAvatar();

  if (!isAvatarCreated) { // cancel dragging, could not create avatar element
    this.reset();
    return false;
  }

  if (!this._dragObject.dragClone) {
    this._dragObject.hide();
  }

  return true; // avatar created successfully
};

DragZone.prototype._onDragMove = function (e) {
  this._dragObject._onDragMove(e);
};

DragZone.prototype._onDragEnd = function (e) {
  dropZone = this._findDropZone(e);
  let isDropped = dropZone && dropZone.drop(e, this._dragObject);
  if (!this.dragClone) {
    if(isDropped) {  // not a clone => drop => remove
      this._dragObject.remove();
    } else {  // not a clone => cancel => restore
      this._dragObject.restore();
    }
  }

  this.reset();
};

DragZone.prototype._findDropZone = function (e) {
  // спрячем переносимый элемент (иначе elementFromPoint найдет его)
  this._dragObject.hideAvatar();
  let target = document.elementFromPoint(e.clientX, e.clientY);
  // показать переносимый элемент обратно
  this._dragObject.showAvatar();

  return target.dropZone;
};

/**
 * Allow to drop shapes to the specified drop zone.
 * @param dropZone
 */
DragZone.prototype.addDropZone = function (dropZone) {

};

/**
 * Abort any active dragging operation.
 */
DragZone.prototype.reset = function () {
  this._dragObject.removeAvatar();
  // restore initial element in case it was hidden
  this._dragObject.restore();
  // destroy dragging wrapper around it
  this._dragObject = null;
};