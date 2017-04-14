/*jshint bitwise: false*/
"use strict";

(function () {
  function hashCode(str) {
    if (str.length === 0) {
      return 0;
    }

    let hash = 0,
      i, chr;
    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  let qs = (s) => document.body.querySelector(s); // shortcut for querySelector

  function getCoords(elem) { // кроме IE8-
    var box = elem.getBoundingClientRect();

    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset
    };

  }

  if (!Element.prototype.remove) {
    Element.prototype.remove = function() {
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
    }
  }

  /**
   * Returns "class" for ".class" or "class".
   * @param str
   * @returns {string}
   */
  function normalizeToClass(str) {
    return str.split('.').join('');
  }

  window.qs = qs;
  window.hashCode = hashCode;
  window.getCoords = getCoords;
  window.normalizeToClass = normalizeToClass;
})();
