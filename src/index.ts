// @ts-ignore
export { version } from '../package.json';

export enum TokenTypeEnum {
  REQUIRED_GROUP = 'requiredGroup',
  FORBIDDEN_GROUP = 'forbiddenGroup',
	OPTIONAL_GROUP = 'optionalGroup',
  REQUIRED_PHRASE = 'requiredPhrase',
  FORBIDDEN_PHRASE = 'forbiddenPhrase',
	OPTIONAL_PHRASE = 'optionalPhrase',
	AND_CONJUNCTION = 'andConjunction',
  OR_CONJUNCTION = 'orConjunction',
  REQUIRED_WORD = 'requiredWord',
  FORBIDDEN_WORD = 'forbiddenWord',
	OPTIONAL_WORD = 'optionalWord',
};

export const TokenType = {...TokenTypeEnum};

enum NonTokenType {
	WHITESPACE = 'whitespace',
	UNKNOWN = 'unknown',
};

export interface SearchToken {
  index: number;
  tokenType: TokenTypeEnum;
  value: string;
  children: SearchToken[];
}

export const patterns = {
  [TokenTypeEnum.REQUIRED_GROUP]: /^\+\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)/g,

  [TokenTypeEnum.FORBIDDEN_GROUP]: /^\-\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)/g,

	[TokenTypeEnum.OPTIONAL_GROUP]: /^\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)/g,

  [TokenTypeEnum.REQUIRED_PHRASE]: /^\+("[^"]+")/g,

  [TokenTypeEnum.FORBIDDEN_PHRASE]: /^\-("[^"]+")/g,

	[TokenTypeEnum.OPTIONAL_PHRASE]: /^("[^"]+")/g,

	[TokenTypeEnum.AND_CONJUNCTION]: /^(AND)/,

  [TokenTypeEnum.OR_CONJUNCTION]: /^(OR)/,

  [TokenTypeEnum.REQUIRED_WORD]: /^\+([^\s]+)/,

  [TokenTypeEnum.FORBIDDEN_WORD]: /^\-([^\s]+)/,

	[TokenTypeEnum.OPTIONAL_WORD]: /^([^\s]+)/,

	[NonTokenType.WHITESPACE]: /^(\s+)/,

	[NonTokenType.UNKNOWN]: /^$/,
};

interface FindNextTokenResult {
  nextTokenType: TokenTypeEnum | NonTokenType;
  nextTokenValue: string;
  nextTokenIndex: number;
  nextSearchStringIndex: number;
}

const findNextToken = ({
  searchString,
  currentSearchStringIndex,
}: {
  searchString: string;
  currentSearchStringIndex: number;
}) => {
  let nextTokenType: TokenTypeEnum | NonTokenType = NonTokenType.UNKNOWN;
  let nextTokenValue = '';
  let nextTokenIndex = 0;
  let nextSearchStringIndex = 0;

  for (nextTokenType in patterns) {
    if (nextTokenType !== NonTokenType.UNKNOWN) {
      const pattern = patterns[nextTokenType as (TokenTypeEnum | NonTokenType)];
      const match = searchString.substr(currentSearchStringIndex).match(pattern);

      if (match) {
        nextTokenValue = match[0];
        nextTokenIndex = currentSearchStringIndex;
        nextSearchStringIndex = currentSearchStringIndex + nextTokenValue.length;

        break;
      }
    }
  }

  return {
    nextTokenType,
    nextTokenValue,
    nextTokenIndex,
    nextSearchStringIndex,
  } as FindNextTokenResult;
};

const parseSearchString = (searchString: string) => {
  const tokens: SearchToken[] = [];
  let token: SearchToken;
  let nextToken: FindNextTokenResult;
  let tokenType: TokenTypeEnum | NonTokenType = NonTokenType.UNKNOWN;
  let tokenValue = '';
  let tokenIndex = 0;
  let searchStringIndex = 0;
  let tokenChildren: SearchToken[] = [];
  let searchStringLength = searchString.length;

  const iterate = () => {
    nextToken = findNextToken({
      searchString,
      currentSearchStringIndex: searchStringIndex,
    });

    tokenType = nextToken.nextTokenType;
    tokenValue = nextToken.nextTokenValue;
    tokenIndex = nextToken.nextTokenIndex;
    searchStringIndex = nextToken.nextSearchStringIndex;
  };

  nextToken = findNextToken({
    searchString: '',
    currentSearchStringIndex: 0,
  });

  while (searchStringIndex < searchStringLength) {
    tokenChildren = [];

    iterate();

    if (tokenType && tokenType !== NonTokenType.WHITESPACE && tokenType !== NonTokenType.UNKNOWN) {
      if ((/^(and|or)/).test(tokenType)) {
        const prevToken = tokens.pop();

        if (prevToken) {
          const trimSymbolFactor = (
            (/^(required|forbidden)/).test(prevToken.tokenType)
          ) ? 1 : 0;

          const trimQuotesFactor = (
            (/Phrase$/).test(prevToken.tokenType)
          ) ? 1 : 0;

          const conditionToken = {
            index: prevToken.index - trimSymbolFactor - trimQuotesFactor,
            tokenType: tokenType,
            value: tokenValue,
            children: tokenChildren,
          };

          iterate();

          if (tokenType as TokenTypeEnum | NonTokenType === NonTokenType.WHITESPACE) {
            iterate()
          }

          let postConjunctionLength = tokenIndex + 1;

          tokenChildren.push(
            prevToken,
            ...parseSearchString(`${Array(postConjunctionLength).join(' ')}${tokenValue}`),
          );

          tokens.push(conditionToken);

          if (tokenChildren.length === 1) {
            return tokens;
          }

          const lastToken = tokenChildren[tokenChildren.length - 1];

          tokenType = lastToken.tokenType as TokenTypeEnum | NonTokenType;
          tokenValue = lastToken.value;
          tokenIndex = lastToken.index;
        }
      } else {
        const trimSymbolFactor = (
          (/^(required|forbidden)/).test(tokenType)
        ) ? 1 : 0;

        const trimQuotesFactor = (
          (/Phrase$/).test(tokenType)
        ) ? 1 : 0;

        tokenIndex = tokenIndex + trimSymbolFactor + trimQuotesFactor;

        tokenValue = tokenValue?.substr(trimSymbolFactor + trimQuotesFactor, tokenValue.length - trimSymbolFactor - trimQuotesFactor - trimQuotesFactor);

        if ((/Group$/).test(tokenType)) {
          tokenChildren = parseSearchString(`${Array(tokenIndex + 2).join(' ')}${tokenValue.substr(1, tokenValue.length - 2)}`);
        }

        token = {
          index: tokenIndex,
          tokenType: tokenType as TokenTypeEnum,
          value: tokenValue,
          children: tokenChildren,
        };

        tokens.push(token);
      }
    }
  }

  return tokens;
};

export default parseSearchString;
