/**
 * cssuniq by @vslinko
 */

function parseSelector(selector) {
  var parts = [];
  var char;
  var part;
  var parentPart;

  function appendParts() {
    if (parentPart) {
      parentPart.parts.push(part);
      part = parentPart;
      parentPart = null;
    }

    parts.push(part);
    part = null;
  }

  function newPart(type) {
    if (part) {
      if (!parentPart) {
        parentPart = {type: 'union', parts: []};
      }

      parentPart.parts.push(part);
    }

    part = {type: type, name: ''};
  }

  selector = selector.trim();

  for (var i = 0; i < selector.length; i++) {
    char = selector[i];

    switch (char) {
      case '.':
        newPart('class');
        break;

      case '#':
        newPart('id');
        break;

      case ':':
        if (part && part.type === 'pseudo' && part.name.length === 0) {
          part.name += char;
        } else {
          newPart('pseudo');
        }
        break;

      case ' ':
        appendParts();
        break;

      default:
        if (!part) {
          newPart('tag');
        }

        part.name += char;
        break;
    }
  }

  if (part) {
    appendParts();
  }

  return {
    type: 'selector',
    parts: parts
  };
}

module.exports = parseSelector;
