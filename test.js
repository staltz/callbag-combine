const test = require('tape');
const combine = require('./index');

test('it combines 1 async finite listenable source', (t) => {
  t.plan(14);
  const downwardsExpectedType = [
    [0, 'function'],
    [1, 'object'],
    [1, 'object'],
    [1, 'object'],
    [2, 'undefined']
  ];
  const downwardsExpected = [[1], [2], [3]];

  function sourceA(type, data) {
    if (type === 0) {
      const sink = data;
      let i = 0;
      const id = setInterval(() => {
        i++;
        sink(1, i);
        if (i === 3) {
          clearInterval(id);
          sink(2);
        }
      }, 100);
      sink(0, sourceA);
    }
  }

  function sink(type, data) {
    const et = downwardsExpectedType.shift();
    t.equals(type, et[0], 'downwards type is expected: ' + et[0]);
    t.equals(typeof data, et[1], 'downwards data type is expected: ' + et[1]);
    if (type === 1) {
      const e = downwardsExpected.shift();
      t.deepEquals(data, e, 'downwards data is expected: ' + JSON.stringify(e));
    }
  };

  const source = combine(sourceA);
  source(0, sink);

  setTimeout(() => {
    t.pass('nothing else happens');
    t.end();
  }, 700);
});

test('it combines 2 async finite listenable sources', (t) => {
  t.plan(20);

  const downwardsExpectedType = [
    [0, 'function'],
    [1, 'object'],
    [1, 'object'],
    [1, 'object'],
    [1, 'object'],
    [1, 'object'],
    [2, 'undefined']
  ];
  const downwardsExpected = [
    [2, 'a'],
    [3, 'a'],
    [4, 'a'],
    [4, 'b'],
    [5, 'b'],
  ];

  function sourceA(type, data) {
    if (type === 0) {
      const sink = data;
      let i = 0;
      const id = setInterval(() => {
        i++;
        sink(1, i);
        if (i === 5) {
          clearInterval(id);
          sink(2);
        }
      }, 100);
      sink(0, sourceA);
    }
  }

  function sourceB(type, data) {
    if (type === 0) {
      const sink = data;
      setTimeout(() => { sink(1, 'a'); }, 230);
      setTimeout(() => { sink(1, 'b'); }, 460);
      setTimeout(() => { sink(2); }, 550);
      sink(0, sourceB);
    }
  }

  function sink(type, data) {
    const et = downwardsExpectedType.shift();
    t.equals(type, et[0], 'downwards type is expected: ' + et[0]);
    t.equals(typeof data, et[1], 'downwards data type is expected: ' + et[1]);
    if (type === 1) {
      const e = downwardsExpected.shift();
      t.deepEquals(data, e, 'downwards data is expected: ' + JSON.stringify(e));
    }
  };

  const source = combine(sourceA, sourceB);
  source(0, sink);

  setTimeout(() => {
    t.pass('nothing else happens');
    t.end();
  }, 700);
});

test('it returns a source that disposes upon upwards END', (t) => {
  t.plan(16);
  const upwardsExpected = [
    [0, 'function'],
    [2, 'undefined']
  ];
  const downwardsExpectedType = [
    [0, 'function'],
    [1, 'object'],
    [1, 'object'],
    [1, 'object'],
  ];
  const downwardsExpected = [[10], [20], [30]];

  function makeSource() {
    let sent = 0;
    let id;
    const source = (type, data) => {
      const e = upwardsExpected.shift();
      t.equals(type, e[0], 'upwards type is expected: ' + e[0]);
      t.equals(typeof data, e[1], 'upwards data is expected: ' + e[1]);
      if (type === 0) {
        const sink = data;
        id = setInterval(() => {
          sink(1, (++sent)*10);
        }, 100);
        sink(0, source);
      } else if (type === 2) {
        clearInterval(id);
      }
    };
    return source;
  };

  function makeSink(type, data) {
    let talkback;
    return (type, data) => {
      const et = downwardsExpectedType.shift();
      t.equals(type, et[0], 'downwards type is expected: ' + et[0]);
      t.equals(typeof data, et[1], 'downwards data type is expected: ' + et[1]);
      if (type === 0) {
        talkback = data;
      }
      if (type === 1) {
        const e = downwardsExpected.shift();
        t.deepEquals(data, e, 'downwards data is expected: ' + JSON.stringify(e));
      }
      if (downwardsExpected.length === 0) {
        talkback(2);
      }
    };
  }

  const source = combine(makeSource());
  const sink = makeSink();
  source(0, sink);

  setTimeout(() => {
    t.pass('nothing else happens');
    t.end();
  }, 700);
});

test('it combines two infinite listenable sources', (t) => {
  t.plan(26);
  const upwardsExpectedA = [
    [0, 'function'],
    [2, 'undefined']
  ];
  const upwardsExpectedB = [
    [0, 'function'],
    [2, 'undefined']
  ];

  const downwardsExpectedType = [
    [0, 'function'],
    [1, 'object'],
    [1, 'object'],
    [1, 'object'],
    [1, 'object'],
    [1, 'object']
  ];
  const downwardsExpected = [
    [2, 'a'],
    [3, 'a'],
    [4, 'a'],
    [4, 'b'],
    [5, 'b']
  ];

  function sourceA(start, sink) {
    const e = upwardsExpectedA.shift();
    t.equals(start, e[0], 'upwards A type is expected: ' + e[0]);
    t.equals(typeof sink, e[1], 'upwards A data is expected: ' + e[1]);

    if (start !== 0) return;
    let i = 0;
    const id = setInterval(() => {
      sink(1, ++i);
    }, 100);
    sink(0, (type, data) => {
      const e = upwardsExpectedA.shift();
      t.equals(type, e[0], 'upwards A type is expected: ' + e[0]);
      t.equals(typeof data, e[1], 'upwards A data is expected: ' + e[1]);
      if (type === 2) {
        clearInterval(id);
      }
    });
  }

  function sourceB(start, sink) {
    const e = upwardsExpectedB.shift();
    t.equals(start, e[0], 'upwards B type is expected: ' + e[0]);
    t.equals(typeof sink, e[1], 'upwards B data is expected: ' + e[1]);

    if (start !== 0) return;
    let id;
    id = setTimeout(() => {
      sink(1, 'a');
      id = setTimeout(() => {
        sink(1, 'b');
        id = setTimeout(() => {
          sink(1, 'c');
          id = setTimeout(() => {
            sink(1, 'd');
          }, 230);
        }, 230);
      }, 230);
    }, 230);
    sink(0, (type, data) => {
      const e = upwardsExpectedB.shift();
      t.equals(type, e[0], 'upwards B type is expected: ' + e[0]);
      t.equals(typeof data, e[1], 'upwards B data is expected: ' + e[1]);
      if (type === 2) {
        clearTimeout(id);
      }
    });
  }

  function makeSink() {
    let talkback;
    return (type, data) => {
      const et = downwardsExpectedType.shift();
      t.equals(type, et[0], 'downwards type is expected: ' + et[0]);
      t.equals(typeof data, et[1], 'downwards data type is expected: ' + et[1]);
      if (type === 0) {
        talkback = data;
      }
      if (type === 1) {
        const e = downwardsExpected.shift();
        t.deepEquals(data, e, 'downwards data is expected: ' + JSON.stringify(e));
      }
      if (downwardsExpected.length === 0) {
        talkback(2);
      }
    };
  }

  const source = combine(sourceA, sourceB);
  const sink = makeSink();
  source(0, sink);

  setTimeout(() => {
    t.pass('nothing else happens');
    t.end();
  }, 800);
});

