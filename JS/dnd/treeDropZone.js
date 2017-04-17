"use strict";

/**
 * Drop zone for tree lists.
 * @extends DropZone
 * @constructor
 */
function TreeDropZone(options) {
  DropZone.apply(this, arguments);
  this._pocketSelector = 'li';

  this._classes.container.push('rs-treednd__dropzone');
  this._classes.pocket.push('rs-treednd__pocket');
  this._classes.pocketHighlight.push('rs-treednd__pocket_active');
  this._classes.separator = ['rs-treednd__separator'];

  this._hasSeparators = options.hasSeparators || false;
}

extend(TreeDropZone, DropZone);

/**
 * Adds extra <li> separators to the existing list to allow sorting.
 */
TreeDropZone.prototype.appendSeparators = function() {
  if(this._hasSeparators) return;

  let lis = this._container.querySelectorAll('li');
  let li;

  for (let i=0; i<lis.length; i++) {
    li = lis[i];
    let sortingLi = this._createSortingLi();
    li.parentNode.insertBefore(sortingLi, li);
  }

  this._hasSeparators = true;
};

TreeDropZone.prototype._createSortingLi = function () {
  let sortingLi = document.createElement('li');
  // default CSS styling for a separator
  sortingLi.style.listStyle = 'none';
  sortingLi.style.height = '5px';
  sortingLi.style.width = '100px';
  sortingLi.classList.add(...this._classes.separator);
  sortingLi.isSeparator = true;  // store in DOM

  return sortingLi;
};


TreeDropZone.prototype._findPocket = function (e, dragObject) {
  let target = DropZone.prototype._findPocket.apply(this, arguments);
  if(!target) return null;

  // sub-element cannot be a pocket
  let testTarget = target;
  while (testTarget !== document) {
    if(testTarget === dragObject.shape) {
      return null;
    }
    testTarget = testTarget.parentNode;
  }

  return target;
};
