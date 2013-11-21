# Private State

A JavaScript utility for managing (really) _true_ per object private state.

**private-state.js** is an implementation of the _Safe Factory Pattern_, for [node.js](http://nodejs.org/) and the browser environment. You can read more about the pattern [here](http://www.codeproject.com/Articles/133118/Safe-Factory-Pattern-Private-instance-state-in-Jav/).

Unlike with other "private" state utilities, in which privacy is only a word expressing an actually unachieved intent (or in which it is achieved by leaking memory, the objects and/or the stored secrets), with the _safe factory_ pattern you actually get to store, with each object, in some predetermined property, an unbreakable _safe_ that stores the object's private state. This technique does not prevent an object from being garbage collected; when it is so, the private state goes with it.

Knowledge of the name of the property where a _safe_ is stored is of no use. The only way to open a _safe_ stored in an object is with its associated _key_ function. This function must be kept in a "safe" place — usually a closure, the scope of the JavaScript module that creates the objects holding private state.

## Usage

It's best to just show an example.
The following is the content of a file named "robot.js":

```javascript
define(['private-state'], function(privState) {
  // Create a key and, from it,
  // a derived one that reads/stores safes
  // from a randomly named property.
  var keyProp = privState.key().property();

  function Robot() {
    // This instance's private state.
    var priv = {
        state:  'stopped',
        target: null
    };

    // Store it publicly, in the instance itself,
    // in the randomly named property.
    keyProp.init(this, priv);
  }

  Robot.prototype.move = function(to) {
    var priv = keyProp(this);
    switch(priv.state) {
      case 'stopped':
        priv.state  = 'moving';
        priv.target = to;
        this._startMoving(); // not shown...
        break;
      case 'moving':
        var from = priv.target;
        if(from !== to) {
          priv.target = to;
          this._changeTarget(to, from); // not shown...
        }
        break;
    }
  };

  // Export the class, but **keep `keyProp` for yourself**.
  return SomeClass;
});
```

## Install

For [node.js](http://nodejs.org/), just execute the following on the command line:

```
$ npm install private-state
```

For the browser environment, `private-state` is available in two flavors:

* an anonymous AMD module: [amd/private-state.min.js](https://raw.github.com/dcleao/private-state/master/dist/amd/private-state.min.js) [min: 472B, gzip: 145B]
* a global state polluting module, that installs itself in the global variable `privateState`: [global/private-state.min.js](https://raw.github.com/dcleao/private-state/master/dist/global/private-state.min.js) [min: 479B, gzip: 147B]

## Source and Tests

Check the source code and tests at [github](https://github.com/dcleao/private-state).
To build or run the tests you need [node.js](http://nodejs.org/).

Clone the repository and install all dev-time dependencies by executing:
```
$ git clone git://github.com/dcleao/private-state.git
$ cd private-state
$ npm install
```

Build it:
```
$ grunt
```

Test it:
```
$ karma start
```