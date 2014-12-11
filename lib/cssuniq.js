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
  var hash = XXH(originalStyle, 0xCAFEBABE).toString(16);
  var knownClasses = {};
  var node;

  options = options || {};
  options.separator = options.separator || '-';
  options.expect = options.expect || [];
  options.only = options.only || null;

  var ast = css.parse(originalStyle);

  visitRule(ast.stylesheet, function(rule) {
    rule.selectors = rule.selectors.map(function(selector) {
      var selectorAst = parseSelector(selector);

      visitSelectorPart(selectorAst, function(part) {
        if (part.type !== 'class') {
          return;
        }

        knownClasses[part.name] = part.name;

        if (options.expect.indexOf(part.name) >= 0) {
          return;
        }

        if (options.only && !options.only.test(part.name)) {
          return;
        }

        var uniqueName = [hash, part.name].join(options.separator);
        knownClasses[part.name] = uniqueName;
        part.name = uniqueName;
      });

      return stringifySelector(selectorAst);
    });
  });

  var uniqueStyle = css.stringify(ast);

  function getStyle() {
    return uniqueStyle;
  }

  function inject() {
    if (node) {
      return;
    }

    node = document.createElement('style');
    node.type = 'text/css';

    var head = document.head || document.getElementsByTagName('head')[0];
    head.appendChild(node);

    if (node.styleSheet) {
      node.styleSheet.cssText = uniqueStyle;
    } else {
      while (node.firstChild) {
        node.removeChild(node.firstChild);
      }

      node.appendChild(document.createTextNode(uniqueStyle));
    }

    return node;
  }

  function classes() {
    var names = Array.prototype.slice.call(arguments)
      .reduce(function(names, arg) {
        if (typeof arg === 'string') {
          arg = arg.split(/\s+/g);
        }

        if (!Array.isArray(arg) && typeof arg === 'object') {
          arg = Object.keys(arg).reduce(function(arr, name) {
            if (arg[name]) {
              arr.push(name);
            }
            return arr;
          }, []);
        }

        if (!Array.isArray(arg)) {
          throw new Error('Invalid argument');
        }

        names = names.concat(arg);

        return names;
      }, []);

    return names
      .map(function(name) {
        return knownClasses[name] || name;
      })
      .join(' ');
  }

  classes.getStyle = getStyle;
  classes.inject = inject;

  return classes;
}

module.exports = cssuniq;
