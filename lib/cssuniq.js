/**
 * cssuniq by @vslinko
 */

var XXH = require('xxhashjs');
var css = require('css');
var parseSelector = require('./parseSelector');
var stringifySelector = require('./stringifySelector');

function visitRule(node, fn) {
  node.rules.forEach(function(rule) {
    if (rule.type === 'rule') {
      fn(rule);
      return;
    }

    if (rule.rules) {
      visitRule(rule, fn);
      return;
    }
  });
}

function visitSelectorPart(node, fn) {
  node.parts.forEach(function(part) {
    if (part.type === 'union') {
      visitSelectorPart(part, fn);
      return;
    }

    fn(part);
  });
}

function cssuniq(originalStyle, options) {
  options = options || {};
  options.separator = options.separator || '-';
  options.expect = options.expect || [];
  options.only = options.only || null;

  var classesObject = {};
  var hash = XXH(originalStyle, 0xCAFEBABE).toString(16);

  var ast = css.parse(originalStyle);

  visitRule(ast.stylesheet, function(rule) {
    rule.selectors = rule.selectors.map(function(selector) {
      var selectorAst = parseSelector(selector);

      visitSelectorPart(selectorAst, function(part) {
        if (part.type !== 'class') {
          return;
        }

        if (options.expect.indexOf(part.name) >= 0) {
          return;
        }

        if (options.only && !options.only.test(part.name)) {
          return;
        }

        part.name = [hash, part.name].join(options.separator);
      });

      return stringifySelector(selectorAst);
    });
  });

  var uniqueStyle = css.stringify(ast);

  function getStyle() {
    return uniqueStyle;
  }

  classesObject.getStyle = getStyle;

  return classesObject;
}

module.exports = cssuniq;
