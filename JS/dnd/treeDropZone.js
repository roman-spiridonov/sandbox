"use strict";

/**
 * Drop zone for tree lists.
 * @extends DropZone
 * @constructor
 */
function TreeDropZone(options) {
  DropZone.apply(this, arguments);
  this._pocketSelector = 'li';
  this._separatorClass = options.separatorClass || '.separator';
  this._hasSeparators = options.hasSeparators || false;
}

extend(TreeDropZone, DropZone);

/**
 * Inserts <li> element to the another list's <ul> level in alphabetical order
 * @param li
 * @param ul
 * @param mode {string} - can be one of the following options.
 * 'end' - insert to the end of ul list (default)
 * 'begin' - insert to the beginning of ul list
 * 'alphabetical' - insert keeping alphabetical in the ul list
 * @returns {*}
 */
TreeDropZone.prototype.appendLiToUl = function (li, ul, mode = 'end') {
  let title = li.textContent; // list title being dragged
  let targetLi = null;

  switch(mode) {
    case 'begin':
      targetLi = ul.children[0];
      break;

    case 'end':
      targetLi = null;
      break;

    case 'alphabetical':
      for (let i = 0; i < ul.children.length; i++) {
        targetLi = ul.children[i];
        let childTitle = targetLi.textContent;
        if (childTitle > title) {
          // insert before this element
          break;
        }
      }
      break;

    default:
      throw new Error(`Incorrect mode parameter specified: ${mode}. Should be one of 'begin', 'end', 'alphabetical'`);
  }

  ul.insertBefore(li, targetLi);
  return li;
};


TreeDropZone.prototype.onDragEnd = function(dragObject, pocket) {
  if(pocket.isSeparator) {
    let sortingLi;
    if(dragObject.shape.previousElementSibling && dragObject.shape.previousElementSibling.isSeparator) {
      // make sure there is no repetitive separator
      sortingLi = dragObject.shape.previousElementSibling;
    } else {
      sortingLi = this._createSortingLi();
    }

    // insert element in place of a separator
    pocket.parentNode.insertBefore(dragObject.shape, pocket);

    // make sure it is wrapped around with separators
    if(!dragObject.shape.previousElementSibling || !dragObject.shape.previousElementSibling.isSeparator) {
      pocket.parentNode.insertBefore(sortingLi, dragObject.shape);
    }

    return;
  }

  // pocket is not a separator (not reordering)
  // get container for li elements in pocket
  let ul = pocket.querySelector('ul');

  if(!ul) {
    // leaf (no descendants) => add as a child
    ul = document.createElement('ul');
    pocket.appendChild(ul);
    ul.appendChild(dragObject.shape);
  } else {
    // has descendants => add to the list in alphabetical order
    this.appendLiToUl(dragObject.shape, ul, 'begin');
  }
};

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
  sortingLi.style.width = '50px';
  sortingLi.classList.add(normalizeClass(this._separatorClass));
  sortingLi.isSeparator = true;  // store in DOM

  return sortingLi;
};
