# Parse Search String
![Tests](https://github.com/simplyhexagonal/parse-search-string/workflows/tests/badge.svg)
[![Try parse-search-string on RunKit](https://badge.runkitcdn.com/@simplyhexagonal/parse-search-string.svg)](https://npm.runkit.com/@simplyhexagonal/parse-search-string)

Function to parse search strings into useful search tokens grouped by optional, required, or forbidden: 

- quoted phrases (`"this is a phrase"`)
- conjunction operators  (`AND`, `OR`)
- groups (`(word AND "phrase in a group")`)
- required/forbidden (`+word` or `-word` respectively)

## Open source notice

This project is open to updates by its users, [I](https://github.com/jeanlescure) ensure that PRs are relevant to the community.
In other words, if you find a bug or want a new feature, please help us by becoming one of the
[contributors](#contributors-) ✌️ ! See the [contributing section](#contributing)

## Like this module? ❤

Please consider:

- [Buying me a coffee](https://www.buymeacoffee.com/jeanlescure) ☕
- Supporting Simply Hexagonal on [Open Collective](https://opencollective.com/simplyhexagonal) 🏆
- Starring this repo on [Github](https://github.com/simplyhexagonal/parse-search-string) 🌟

## Install

```sh
pnpm i @simplyhexagonal/parse-search-string

# or
yarn add @simplyhexagonal/parse-search-string

# or
npm install @simplyhexagonal/parse-search-string
```

## Usage

```ts
import parseSearchString from '@simplyhexagonal/parse-search-string';

const result = parseSearchString('"Elon Musk" AND +(Bitcoin OR Doge)');

console.log(JSON.stringify(result, null, 2));

// [
//   {
//     "index": 0,
//     "tokenType": "andOperation",
//     "value": "AND",
//     "children": [
//       {
//         "index": 1,
//         "tokenType": "optionalPhrase",
//         "value": "Elon Musk",
//         "children": []
//       },
//       {
//         "index": 17,
//         "tokenType": "requiredGroup",
//         "value": "(Bitcoin OR Doge)",
//         "children": [
//           {
//             "index": 18,
//             "tokenType": "orOperation",
//             "value": "OR",
//             "children": [
//               {
//                 "index": 18,
//                 "tokenType": "optionalWord",
//                 "value": "Bitcoin",
//                 "children": []
//               },
//               {
//                 "index": 29,
//                 "tokenType": "optionalWord",
//                 "value": "Doge",
//                 "children": []
//               }
//             ]
//           }
//         ]
//       }
//     ]
//   }
// ]
```

The token object structure was designed to be human readable yet easy to transform into a `$search` aggregation query compatible with [MongoDB Query API](https://www.mongodb.com/atlas/search).

## Inspired By

Financial Time's [n-search-parser](https://github.com/Financial-Times/n-search-parser) (npm module) which is in turn inspired by [Lucene query parser](https://github.com/thoward/lucene-query-parser.js) (module) and [Building a search query parser](https://tgvashworth.com/2016/06/27/twitter-search-query-parser.html) (article).

## Contributing

Yes, thank you! This plugin is community-driven, most of its features are from different authors.
Please update the docs and tests and add your name to the `package.json` file.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://jeanlescure.cr"><img src="https://avatars2.githubusercontent.com/u/3330339?v=4" width="100px;" alt=""/><br /><sub><b>Jean Lescure</b></sub></a><br /><a href="#maintenance-jeanlescure" title="Maintenance">🚧</a> <a href="https://github.com/simplyhexagonal/parse-search-string/commits?author=jeanlescure" title="Code">💻</a> <a href="#userTesting-jeanlescure" title="User Testing">📓</a> <a href="https://github.com/simplyhexagonal/parse-search-string/commits?author=jeanlescure" title="Tests">⚠️</a> <a href="#example-jeanlescure" title="Examples">💡</a> <a href="https://github.com/simplyhexagonal/parse-search-string/commits?author=jeanlescure" title="Documentation">📖</a></td>
</table>
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

## License

Copyright (c) 2022-Present [Package Contributors](https://github.com/simplyhexagonal/parse-search-string/#contributors-).<br/>
Licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).
