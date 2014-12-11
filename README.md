# cssuniq

> Library which makes all your CSS classes are unique.

## Usage

```jsx
var cssuniq = require('cssuniq');

var classes = cssuniq('.button {} .button-big {} .button-icon {} .button-icon .icon {}', {
  except: ['icon'] // or only: /^button/
});

classes.getStyle(); // ".UNIQUEHASH-button {} .UNIQUEHASH-button-icon {}"
classes.inject(); // Injects <style> tag with transformed style onto page
classes('button'); // "UNIQUEHASH-button"
classes('button button-big'); // "UNIQUEHASH-button UNIQUEHASH-button-big"
classes(['button', 'button-big']); // "UNIQUEHASH-button UNIQUEHASH-button-big"
classes({'button': true, 'button-big': false}); // "UNIQUEHASH-button"
classes('button', {'button-big': true}); // "UNIQUEHASH-button UNIQUEHASH-button-big"

var Button = React.createClass({
  getDefaultProps: function() {
    return {
      big: false
    };
  },

  render: function() {
    return (
      <button className={classes('button', {'button-big': this.props.big}) /* ".UNIQUEHASH-button" */}>
        <i className={classes('button-icon') /* ".UNIQUEHASH-button" */} />
        {this.props.children}
      </button>
    );
  }
});
```

## Pros & Cons

### Pros

* Makes your components more reusable and independent.
* Disables CSS inheritance. Simulates shadow DOM.

### Cons

* Impossible to quickly change classes style outside of the component.

## TODO

* [ ] Webpack loader
