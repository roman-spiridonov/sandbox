"use strict";

function DragObject(shape, dragClone, e) {
  this.downX = e.pageX;
  this.downY = e.pageY;
  this.shape = shape;
  this.dragClone = dragClone;

  this.avatar = null;
  this._shiftX = 0;
  this._shiftY = 0;
}

/**
 * Hide initial element being dragged.
 */
DragObject.prototype.hide = function() {
  this.shape.style.display = 'none';
};

/**
 * Restore element being dragged to its initial state.
 */
DragObject.prototype.restore = function() {
  this.shape.style.display = '';
};

/**
 * Remove initial element being dragged (e.g. when successfully placed inside the pocket).
 */
DragObject.prototype.remove = function() {
  this.avatar && this.avatar.remove();
  this.shape && this.shape.remove();
};

/**
 * Initialize and create avatar object.
 * @param dragObject {DragObject}
 * @param dragClone
 * @returns {boolean} - returns true if avatar was successfully created
 */
DragObject.prototype._initAvatar = function () {
  this.avatar = this.createAvatarFromShape();
  if(!this.avatar) return false;

  // initialize props of avatar object, including shiftX/shiftY
  let coords = getCoords(this.shape);
  this._shiftX = this.downX - coords.left;
  this._shiftY = this.downY - coords.top;

  // prepare for dragging in DOM
  document.body.appendChild(this.avatar);
  this.avatar.style.zIndex = 9999;
  this.avatar.style.position = 'absolute';

  return true;
};

/**
 * Returns avatar element based on the shape.
 * @returns {Node}
 */
DragObject.prototype.createAvatarFromShape = function() {
  return this.shape.cloneNode(true)
};

DragObject.prototype._onDragMove = function (e) {
  // sync position on mouse move
  this.avatar.style.left = e.pageX - this._shiftX + 'px';
  this.avatar.style.top = e.pageY - this._shiftY + 'px';
};

/**
 * Returns true if avatar was created.
 * @returns {boolean}
 */
DragObject.prototype.isAvatarCreated = function () {
  return !!this.avatar;
};

/**
 * Hides avatar.
 */
DragObject.prototype.hideAvatar = function () {
  this.avatar && (this.avatar.hidden = true);
};

/**
 * Shows avatar.
 */
DragObject.prototype.showAvatar = function () {
  this.avatar && (this.avatar.hidden = false);
};

/**
 * Removes avatar.
 */
DragObject.prototype.removeAvatar = function () {
  this.avatar && (this.avatar.remove());
  this._shiftX = this._shiftY = 0;
};