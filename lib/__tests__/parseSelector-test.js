/**
 * cssuniq by @vslinko
 */
/* global jest, describe, it, expect */

jest.autoMockOff();

var parseSelector = require('../parseSelector');

describe('parseSelector', function() {
  it('should parse selector', function() {
    expect(parseSelector('.cls')).toEqual({
      type: 'selector',
      parts: [
        {type: 'class', name: 'cls'}
      ]
    });

    expect(parseSelector('#uniq')).toEqual({
      type: 'selector',
      parts: [
        {type: 'id', name: 'uniq'}
      ]
    });

    expect(parseSelector('a')).toEqual({
      type: 'selector',
      parts: [
        {type: 'tag', name: 'a'}
      ]
    });

    expect(parseSelector(':after')).toEqual({
      type: 'selector',
      parts: [
        {type: 'pseudo', name: 'after'}
      ]
    });

    expect(parseSelector('::after')).toEqual({
      type: 'selector',
      parts: [
        {type: 'pseudo', name: ':after'}
      ]
    });

    expect(parseSelector('#uniq .cls a')).toEqual({
      type: 'selector',
      parts: [
        {type: 'id', name: 'uniq'},
        {type: 'class', name: 'cls'},
        {type: 'tag', name: 'a'}
      ]
    });

    expect(parseSelector('a#uniq.cls:after:checked')).toEqual({
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
    });
  });
});
