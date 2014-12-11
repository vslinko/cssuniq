/**
 * cssuniq by @vslinko
 */
/* global jest, describe, it, expect */

jest.autoMockOff();

var stringifySelector = require('../stringifySelector');

describe('stringifySelector', function() {
  it('should stringify selector AST', function() {
    expect(stringifySelector({
      type: 'selector',
      parts: [
        {type: 'class', name: 'cls'}
      ]
    })).toEqual('.cls');

    expect(stringifySelector({
      type: 'selector',
      parts: [
        {type: 'id', name: 'uniq'}
      ]
    })).toEqual('#uniq');

    expect(stringifySelector({
      type: 'selector',
      parts: [
        {type: 'tag', name: 'a'}
      ]
    })).toEqual('a');

    expect(stringifySelector({
      type: 'selector',
      parts: [
        {type: 'pseudo', name: 'after'}
      ]
    })).toEqual(':after');

    expect(stringifySelector({
      type: 'selector',
      parts: [
        {type: 'pseudo', name: ':after'}
      ]
    })).toEqual('::after');

    expect(stringifySelector({
      type: 'selector',
      parts: [
        {type: 'id', name: 'uniq'},
        {type: 'class', name: 'cls'},
        {type: 'tag', name: 'a'}
      ]
    })).toEqual('#uniq .cls a');

    expect(stringifySelector({
      type: 'selector',
      parts: [
        {type: 'union', parts: [
          {type: 'tag', name: 'a'},
          {type: 'id', name: 'uniq'},
          {type: 'class', name: 'cls'},
          {type: 'pseudo', name: 'after'},
          {type: 'pseudo', name: 'checked'}
        ]}
      ]
    })).toEqual('a#uniq.cls:after:checked');
  });
});
