"use strict";
/**
 * Zone that contains elements that can be dragged (shapes).
 * Usage: Initialize the object and store inside the DOM element (container) as `node.dragZone`.
 * @param options.container {Node} - DOM node of the zone
 * @param options.dragClone {boolean} - true if dragging clones not initial objects
 * @param options.many - true if each shape is a generator of many shapes
 * @param options.shapeSelector {string} - CSS selector to find draggable elements (by default, '.draggable')
 * @param options.manyOverrideSelector {string} - CSS selector to identify elements that are not removed from initial
 * position when placed into a pocket.
 * @constructor
 */
function DragZone(options) {
  options.container.dragZone = this;  // save in DOM
  this._container = options.container;

  this._dragClone = options.dragClone || false;
  this._many = options.many || false;
  this._shapeSelector = options.shapeSelector || '.draggable';
  this._manyOverrideSelector = options.manyOverrideSelector || '.many';

  this._dragObject = null;
}

DragZone.prototype._onDragInit = function (e) {
  let shape = this.findShape(e);
  if (!shape) return false;

  let many = this.isMany(shape);

  this._dragObject = new DragObject(shape, many, this._dragClone, e);

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
 * Return true if the shape should be dragged as clone of many shapes.
 * @param shape {Node} - shape element
 * @returns {boolean}
 */
DragZone.prototype.isMany = function (shape) {
  let many = false;
  if (shape.classList.contains(this._manyOverrideSelector.split('.').join(''))) {
    many = true;
  }

  return many;
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
  if (!this.many) {
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