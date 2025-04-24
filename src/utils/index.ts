import { THINK_TAG_REGEX } from '@/constants';
import type { Message } from '@shared/types';
import { v4 } from 'uuid';

export function getLastAssistantMessageIndex(messages: Message[]) {
  return messages.length > 0
    ? messages.map((message) => message.role).lastIndexOf('assistant')
    : -1;
}

export function generateUniqueId() {
  return v4();
}

// We are considering here that reasoning models will
// always return both opening and closing tags
// and we remove the content in between
export const removeThinkingContent = (text: string): string => {
  return text.replace(THINK_TAG_REGEX, '').trim();
};

export const wrapBoxedMathInDollarSigns = (text: string) => {
  let result = text;
  let startIndex = 0;

  while ((startIndex = result.indexOf('\\boxed{', startIndex)) !== -1) {
    let isAlreadyWrapped = false;

    for (let i = startIndex - 1; i >= 0; i--) {
      if (result[i] === '$') {
        isAlreadyWrapped = true;
        break;
      } else if (!result[i].match(/\s/)) {
        break;
      }
    }

    if (!isAlreadyWrapped) {
      let openBraces = 0;
      let closingIndex = -1;

      for (let i = startIndex + 7; i < result.length; i++) {
        if (result[i] === '{') {
          openBraces++;
        } else if (result[i] === '}') {
          if (openBraces === 0) {
            closingIndex = i;
            break;
          }
          openBraces--;
        }
      }

      if (closingIndex !== -1) {
        result =
          result.substring(0, startIndex) +
          '$' +
          result.substring(startIndex, closingIndex + 1) +
          '$' +
          result.substring(closingIndex + 1);

        startIndex = closingIndex + 3;
      } else {
        startIndex += 7;
      }
    } else {
      startIndex += 7;
    }
  }

  return result;
};
