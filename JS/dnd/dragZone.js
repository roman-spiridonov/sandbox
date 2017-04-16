"use strict";
/**
 * Zone that contains elements that can be dragged (shapes).
 * Drag zone creates Dragging Objects and drops them to the appropriate Drop zones.
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
  this._id = GIDMaker(this.constructor.name);

  options.container.dragZone = this;  // save in DOM
  this._container = options.container;

  this._dragClone = options.dragClone || false;
  this._many = options.many || false;
  this._shapeSelector = options.shapeSelector || '.draggable';
  this._manyOverrideSelector = options.manyOverrideSelector || '.many';

  /**
   * Wrapper around element being dragged.
   * @type {DragObject}
   * @private
   */
  this._dragObject = null;
  /**
   * Active drop zone - updated on mouse move.
   * @type {DropZone}
   * @private
   */
  this._dropZone = null;
}


DragZone.prototype._onDragInit = function (e) {
  let shape = this.findShape(e);
  if (!shape) return false;

  let many = this.isMany(shape);

  this._dragObject = new DragObject({shape: shape, many: many, dragClone: this._dragClone, e: e});

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
  let many = this._many;
  if (this._manyOverrideSelector && shape.matches(this._manyOverrideSelector)) {
    many = !many;
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
  let newDropZone = this._findDropZone(e);

  if(newDropZone !== this._dropZone) {  // moved to new drop zone
    // notify drop zones
    this._dropZone && this._dropZone.onDragLeave(e, this._dragObject);
    this._dropZone && this._dropZone.reset();
    newDropZone && newDropZone.onDragEnter(e, this._dragObject);
  }

  this._dropZone = newDropZone;
  this._dropZone && this._dropZone._onDragMove(e, this._dragObject);

  this._dragObject.moveTo(e.pageX, e.pageY);
};

DragZone.prototype._onDragEnd = function (e) {
  let dropZone = this._dropZone = this._findDropZone(e);
  let isDroppedToPocket = dropZone && dropZone.drop(e, this._dragObject);

  this.reset();
};

/**
 * Returns drop zone under the mouse.
 * @param e - mouse event
 * @returns {DropZone}
 * @private
 */
DragZone.prototype._findDropZone = function (e) {
  this._dragObject.hideAvatar();
  let target = document.elementFromPoint(e.clientX, e.clientY);
  this._dragObject.showAvatar();

  if (target == null) {  // possible if mouse pointer went outside the window
    return null;
  }

  while(target != document && !target.dropZone) {
    target = target.parentNode;
  }

  if(target === document) {
    return null;
  }

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