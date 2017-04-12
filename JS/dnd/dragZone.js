"use strict";
function DragZone(container, shapeSelector = '.draggable') {
  container.dragZone = this;  // save in DOM

  this._shapeSelector = shapeSelector;
  this._container = container;
  this._dragObject = {};
}

DragZone.prototype._onDragInit = function (e) {
  let shape = this.findShape(e, this._shapeSelector);
  if(!shape) return false;

  // save element on which click occurred
  this._dragObject.shape = shape;
  this._dragObject.downX = e.pageX;
  this._dragObject.downY = e.pageY;

  return true;
};

/**
 * Returns shape element under cursor (or undefined).
 * @param e - mouse left click event
 * @param selector {string} - CSS selector to find draggable elements (by default, '.draggable')
 * @returns {HTMLElement} - shape element to drag
 */
DragZone.prototype.findShape = function (e, selector = '.draggable') {
  let shape = e.target.closest(selector);
  return shape;
};

DragZone.prototype._onDragStart = function (e) {
  this._dragObject.avatar = new Avatar(this._dragObject);
  if (!this._dragObject.avatar) { // cancel dragging, could not create avatar element
    delete this._dragObject.avatar;
    this._dragObject = {};
    return false;
  }

  return true; // avatar created successfully
};

DragZone.prototype._onDragMove = function (e) {
  this._dragObject.avatar._onDragMove(e);
};

DragZone.prototype._onDragEnd = function (e) {
  dropZone = this._findDropZone(e);
  dropZone.drop(e, this._dragObject);
  this._dragObject.avatar.rollback();
};

DragZone.prototype._findDropZone = function (e) {
  // спрячем переносимый элемент (иначе elementFromPoint найдет его)
  this._dragObject.avatar.hide();
  let target = document.elementFromPoint(e.clientX, e.clientY);
  // показать переносимый элемент обратно
  this._dragObject.avatar.show();

  return target.dropZone;
};

/**
 * Allow to drop shapes to the specified drop zone.
 * @param dropZone
 */
DragZone.prototype.addDropZone = function (dropZone) {

};