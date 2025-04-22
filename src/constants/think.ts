export const THINK_TAG_PATTERN = /(?:think|thinking|thought)/;
export const THINK_TAG_REGEX = new RegExp(
  `<${THINK_TAG_PATTERN.source}>.*?</${THINK_TAG_PATTERN.source}>`,
  'gs',
);
export const THINK_TAG_SPLIT_PATTERN = new RegExp(
  `<\\/?${THINK_TAG_PATTERN.source}>`,
);
export const OPENING_THINK_TAG_PATTERN = new RegExp(
  `<${THINK_TAG_PATTERN.source}>`,
);
export const CLOSING_THINK_TAG_PATTERN = new RegExp(
  `<\\/${THINK_TAG_PATTERN.source}>`,
);
