/**
 * cssuniq by @vslinko
 */

function stringifyPart(part) {
  switch (part.type) {
    case 'class':
      return '.' + part.name;

    case 'id':
      return '#' + part.name;

    case 'tag':
      return part.name;

    case 'pseudo':
      return ':' + part.name;

    default:
      throw new Error('Invalid selector part type "' + part.type + '"');
  }
}

function stringifySelectorPart(part) {
  switch (part.type) {
    case 'union':
      return part.parts.map(stringifyPart).join('');

    default:
      return stringifyPart(part);
  }
}

function stringifySelector(ast) {
  switch (ast.type) {
    case 'selector':
      return ast.parts.map(stringifySelectorPart).join(' ');

    default:
      throw new Error('Invalid selector AST');
  }
}

module.exports = stringifySelector;
