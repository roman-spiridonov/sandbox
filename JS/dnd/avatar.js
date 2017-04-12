"use strict";
function Avatar(dragObject = {}, dragClone = false) {
  this.dragClone = dragClone;
  this._shiftX = 0;
  this._shiftY = 0;
  this._downX = dragObject.downX;
  this._downY = dragObject.downY;
  this._elem = dragObject.shape;

  this.createAvatar(dragObject, dragClone);
}

Avatar.prototype._onDragMove = function (e) {
  // sync position on mouse move
  this._avatarEl.style.left = e.pageX - this._shiftX + 'px';
  this._avatarEl.style.top = e.pageY - this._shiftY + 'px';
};

/**
 * Creates avatar from
 * @param dragObject
 * @param dragClone
 * @returns {boolean}
 */
Avatar.prototype.createAvatar = function (dragObject, dragClone = false) {
  let avatar = this._avatarEl = dragClone ? dragObject.shape.cloneNode(true) : dragObject.shape;
  // save old props to be able to restore
  this._old = {
    parent: avatar.parentNode,
    nextSibling: avatar.nextSibling,
    position: avatar.style.position || '',
    left: avatar.style.left || '',
    top: avatar.style.top || '',
    zIndex: avatar.style.zIndex || ''
  };

  // initialize props of avatar object, including shiftX/shiftY
  let coords = getCoords(dragObject.shape);
  this._shiftX = dragObject.downX - coords.left;
  this._shiftY = dragObject.downY - coords.top;
  this._downX = dragObject.downX;
  this._downY = dragObject.downY;
  this._elem = dragObject.shape;

  // prepare for dragging in DOM
  document.body.appendChild(avatar);
  avatar.style.zIndex = 9999;
  avatar.style.position = 'absolute';

  return true;
};

/**
 * Returns true if avatar was created.
 * @returns {boolean}
 */
Avatar.prototype.isCreated = function () {
  return !!this._avatarEl;
};

Avatar.prototype.hide = function () {
  this._avatarEl.hidden = true;
};

Avatar.prototype.show = function () {
  this._avatarEl.hidden = false;
};

Avatar.prototype.rollback = function () {
  let avatar = this._avatarEl;
  let old = this._old;

  if (this.dragClone) {
    avatar.remove();
  } else {  // not a clone => dragging initial element => restore
    this._old.parent.insertBefore(avatar, old.nextSibling);
    avatar.style.position = old.position;
    avatar.style.left = old.left;
    avatar.style.top = old.top;
    avatar.style.zIndex = old.zIndex
  }
};