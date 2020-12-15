/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.height = height;
  this.width = width;

  function getArea() {
    return this.height * this.width;
  }
  return Object.freeze({
    height,
    width,
    getArea,
  });
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  const values = Object.values(obj);

  return new proto.constructor(...values);
}


/** Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 *
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class Selector {
  constructor() {
    this.result = '';
    this.step = 0;
    this.error = {
      wrongOrder: 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      wrongOccurancy: 'Element, id and pseudo-element should not occur more then one time inside the selector',
    };
  }

  set position(next) {
    if (next < this.step) throw new Error(this.error.wrongOrder);
    this.step = next;
  }

  element(value) {
    this.position = 0;
    if (this.elementOccured) throw new Error(this.error.wrongOccurancy);
    this.elementOccured = true;
    this.result += value;
    return this;
  }

  id(value) {
    this.position = 1;
    if (this.idOccured) throw new Error(this.error.wrongOccurancy);
    this.idOccured = true;
    this.result += `#${value}`;
    return this;
  }

  class(value) {
    this.position = 2;
    this.result += `.${value}`;
    return this;
  }

  attr(value) {
    this.position = 3;
    this.result += `[${value}]`;
    return this;
  }

  pseudoClass(value) {
    this.position = 4;
    this.result += `:${value}`;
    return this;
  }

  pseudoElement(value) {
    this.position = 5;
    if (this.pseudoElementOccured) throw new Error(this.error.wrongOccurancy);
    this.pseudoElementOccured = true;
    this.result += `::${value}`;
    return this;
  }

  combine(selector1, combinator, selector2) {
    this.result = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    return this;
  }

  stringify() {
    return this.result;
  }
}

const cssSelectorBuilder = {
  generateMethods() {
    ['element', 'id', 'class', 'attr', 'pseudoClass', 'pseudoElement', 'combine']
      .forEach((selector) => {
        cssSelectorBuilder[selector] = (selector === 'combine')
          ? (s1, combinator, s2) => new Selector()[selector](s1, combinator, s2)
          : (value) => new Selector()[selector](value);
      });
  },
};

cssSelectorBuilder.generateMethods();
module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
