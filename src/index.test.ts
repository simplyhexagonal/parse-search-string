import parseSearchString from './';

describe('parseSearchString function', () => {
  it('can parse empty strings', () => {
    let result = parseSearchString('');
    expect(result).toEqual([]);

    result = parseSearchString(' ');
    expect(result).toEqual([]);

    result = parseSearchString('  ');
    expect(result).toEqual([]);
  });

  it('can tokenize words', () => {
    let result = parseSearchString('foo');
    expect(result).toEqual(
      [
        {
          "children": [],
          "tokenType": "optionalWord",
          "value": "foo",
          "index": 0
        }
      ]
    );

    result = parseSearchString('foo bar');
    expect(result).toEqual(
      [
        {
          "children": [],
          "tokenType": "optionalWord",
          "value": "foo",
          "index": 0
        },
        {
          "children": [],
          "tokenType": "optionalWord",
          "value": "bar",
          "index": 4
        }
      ]
    );

    result = parseSearchString('foo bar 3');
    expect(result).toEqual(
      [
        {
          "children": [],
          "tokenType": "optionalWord",
          "value": "foo",
          "index": 0
        },
        {
          "children": [],
          "tokenType": "optionalWord",
          "value": "bar",
          "index": 4
        },
        {
          "children": [],
          "tokenType": "optionalWord",
          "value": "3",
          "index": 8
        }
      ]
    );

    result = parseSearchString('+foo');
    expect(result).toEqual(
      [
        {
          "children": [],
          "tokenType": "requiredWord",
          "value": "foo",
          "index": 1
        }
      ]
    );

    result = parseSearchString('foo -bar');
    expect(result).toEqual(
      [
        {
          "children": [],
          "tokenType": "optionalWord",
          "value": "foo",
          "index": 0
        },
        {
          "children": [],
          "tokenType": "forbiddenWord",
          "value": "bar",
          "index": 5
        }
      ]
    );

    result = parseSearchString('-foo bar +3');
    expect(result).toEqual(
      [
        {
          "children": [],
          "tokenType": "forbiddenWord",
          "value": "foo",
          "index": 1
        },
        {
          "children": [],
          "tokenType": "optionalWord",
          "value": "bar",
          "index": 5
        },
        {
          "children": [],
          "tokenType": "requiredWord",
          "value": "3",
          "index": 10
        }
      ]
    );
  });

  it('can tokenize conditions', () => {
    let result = parseSearchString('AND');
    expect(result).toEqual([]);

    result = parseSearchString('AND foo');
    expect(result).toEqual(
      [
        {
          "index": 4,
          "tokenType": "optionalWord",
          "value": "foo",
          "children": []
        }
      ]
    );

    result = parseSearchString('AND foo bar');
    expect(result).toEqual(
      [
        {
          "index": 4,
          "tokenType": "optionalWord",
          "value": "foo",
          "children": []
        },
        {
          "index": 8,
          "tokenType": "optionalWord",
          "value": "bar",
          "children": []
        }
      ]
    );

    result = parseSearchString('foo AND bar');
    expect(result).toEqual(
      [
        {
          "index": 0,
          "tokenType": "andConjunction",
          "value": "AND",
          "children": [
            {
              "index": 0,
              "tokenType": "optionalWord",
              "value": "foo",
              "children": []
            },
            {
              "index": 8,
              "tokenType": "optionalWord",
              "value": "bar",
              "children": []
            }
          ]
        }
      ]
    );

    result = parseSearchString('foo AND bar OR caz');
    expect(result).toEqual(
      [
        {
          "index": 0,
          "tokenType": "orConjunction",
          "value": "OR",
          "children": [
            {
              "index": 0,
              "tokenType": "andConjunction",
              "value": "AND",
              "children": [
                {
                  "index": 0,
                  "tokenType": "optionalWord",
                  "value": "foo",
                  "children": []
                },
                {
                  "index": 8,
                  "tokenType": "optionalWord",
                  "value": "bar",
                  "children": []
                }
              ]
            },
            {
              "index": 15,
              "tokenType": "optionalWord",
              "value": "caz",
              "children": []
            }
          ]
        }
      ]
    );
  });

  it('can tokenize phrases', () => {
    let result = parseSearchString('"this is a phrase"');
    expect(result).toEqual(
      [
        {
          "index": 1,
          "tokenType": "optionalPhrase",
          "value": "this is a phrase",
          "children": []
        }
      ]
    );

    result = parseSearchString('"all well AND here another phrase"');
    expect(result).toEqual(
      [
        {
          "index": 1,
          "tokenType": "optionalPhrase",
          "value": "all well AND here another phrase",
          "children": []
        }
      ]
    );

    result = parseSearchString('"to phrase" OR -"not to phrase"');
    expect(result).toEqual(
      [
        {
          "index": 0,
          "tokenType": "orConjunction",
          "value": "OR",
          "children": [
            {
              "index": 1,
              "tokenType": "optionalPhrase",
              "value": "to phrase",
              "children": []
            },
            {
              "index": 17,
              "tokenType": "forbiddenPhrase",
              "value": "not to phrase",
              "children": []
            }
          ]
        }
      ]
    );

    result = parseSearchString('+word "optional phrase"');
    expect(result).toEqual(
      [
        {
          "index": 1,
          "tokenType": "requiredWord",
          "value": "word",
          "children": []
        },
        {
          "index": 7,
          "tokenType": "optionalPhrase",
          "value": "optional phrase",
          "children": []
        }
      ]
    );
  });

  it('can tokenize groups', () => {
    let result = parseSearchString('(this is a group)');
    expect(result).toEqual(
      [
        {
          "index": 0,
          "tokenType": "optionalGroup",
          "value": "(this is a group)",
          "children": [
            {
              "index": 1,
              "tokenType": "optionalWord",
              "value": "this",
              "children": []
            },
            {
              "index": 6,
              "tokenType": "optionalWord",
              "value": "is",
              "children": []
            },
            {
              "index": 9,
              "tokenType": "optionalWord",
              "value": "a",
              "children": []
            },
            {
              "index": 11,
              "tokenType": "optionalWord",
              "value": "group",
              "children": []
            }
          ]
        }
      ]
    );

    result = parseSearchString('(all well AND here another group)');
    expect(result).toEqual(
      [
        {
          "index": 0,
          "tokenType": "optionalGroup",
          "value": "(all well AND here another group)",
          "children": [
            {
              "index": 1,
              "tokenType": "optionalWord",
              "value": "all",
              "children": []
            },
            {
              "index": 5,
              "tokenType": "andConjunction",
              "value": "AND",
              "children": [
                {
                  "index": 5,
                  "tokenType": "optionalWord",
                  "value": "well",
                  "children": []
                },
                {
                  "index": 14,
                  "tokenType": "optionalWord",
                  "value": "here",
                  "children": []
                }
              ]
            },
            {
              "index": 19,
              "tokenType": "optionalWord",
              "value": "another",
              "children": []
            },
            {
              "index": 27,
              "tokenType": "optionalWord",
              "value": "group",
              "children": []
            }
          ]
        }
      ]
    );

    result = parseSearchString('(to group) OR -(not to group)');
    expect(result).toEqual(
      [
        {
          "index": 0,
          "tokenType": "orConjunction",
          "value": "OR",
          "children": [
            {
              "index": 0,
              "tokenType": "optionalGroup",
              "value": "(to group)",
              "children": [
                {
                  "index": 1,
                  "tokenType": "optionalWord",
                  "value": "to",
                  "children": []
                },
                {
                  "index": 4,
                  "tokenType": "optionalWord",
                  "value": "group",
                  "children": []
                }
              ]
            },
            {
              "index": 15,
              "tokenType": "forbiddenGroup",
              "value": "(not to group)",
              "children": [
                {
                  "index": 16,
                  "tokenType": "optionalWord",
                  "value": "not",
                  "children": []
                },
                {
                  "index": 20,
                  "tokenType": "optionalWord",
                  "value": "to",
                  "children": []
                },
                {
                  "index": 23,
                  "tokenType": "optionalWord",
                  "value": "group",
                  "children": []
                }
              ]
            }
          ]
        }
      ]
    );

    result = parseSearchString('+word (optional group)');
    expect(result).toEqual(
      [
        {
          "index": 1,
          "tokenType": "requiredWord",
          "value": "word",
          "children": []
        },
        {
          "index": 6,
          "tokenType": "optionalGroup",
          "value": "(optional group)",
          "children": [
            {
              "index": 7,
              "tokenType": "optionalWord",
              "value": "optional",
              "children": []
            },
            {
              "index": 16,
              "tokenType": "optionalWord",
              "value": "group",
              "children": []
            }
          ]
        }
      ]
    );
  });

  it('can parse absolute (but valid) insanity', () => {
    let result = parseSearchString(`\n0 \t([1, 2, 3,]) +AND -OR
    (
      +this
      AND
      +(
        that
        OR
        -(
          -"not those"
          +"neither these, but for sure"
        )
      )
    )`);
    expect(result).toEqual(
      [
        {
          "index": 1,
          "tokenType": "optionalWord",
          "value": "0",
          "children": []
        },
        {
          "index": 4,
          "tokenType": "optionalGroup",
          "value": "([1, 2, 3,])",
          "children": [
            {
              "index": 5,
              "tokenType": "optionalWord",
              "value": "[1,",
              "children": []
            },
            {
              "index": 9,
              "tokenType": "optionalWord",
              "value": "2,",
              "children": []
            },
            {
              "index": 12,
              "tokenType": "optionalWord",
              "value": "3,]",
              "children": []
            }
          ]
        },
        {
          "index": 18,
          "tokenType": "requiredWord",
          "value": "AND",
          "children": []
        },
        {
          "index": 23,
          "tokenType": "forbiddenWord",
          "value": "OR",
          "children": []
        },
        {
          "index": 30,
          "tokenType": "optionalGroup",
          "value": "(\n      +this\n      AND\n      +(\n        that\n        OR\n        -(\n          -\"not those\"\n          +\"neither these, but for sure\"\n        )\n      )\n    )",
          "children": [
            {
              "index": 38,
              "tokenType": "andConjunction",
              "value": "AND",
              "children": [
                {
                  "index": 39,
                  "tokenType": "requiredWord",
                  "value": "this",
                  "children": []
                },
                {
                  "index": 61,
                  "tokenType": "requiredGroup",
                  "value": "(\n        that\n        OR\n        -(\n          -\"not those\"\n          +\"neither these, but for sure\"\n        )\n      )",
                  "children": [
                    {
                      "index": 71,
                      "tokenType": "orConjunction",
                      "value": "OR",
                      "children": [
                        {
                          "index": 71,
                          "tokenType": "optionalWord",
                          "value": "that",
                          "children": []
                        },
                        {
                          "index": 96,
                          "tokenType": "forbiddenGroup",
                          "value": "(\n          -\"not those\"\n          +\"neither these, but for sure\"\n        )",
                          "children": [
                            {
                              "index": 110,
                              "tokenType": "forbiddenPhrase",
                              "value": "not those",
                              "children": []
                            },
                            {
                              "index": 133,
                              "tokenType": "requiredPhrase",
                              "value": "neither these, but for sure",
                              "children": []
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    );
  });
});
