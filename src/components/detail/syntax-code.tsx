"use client";

import * as React from "react";

export type SyntaxTokenType =
  | "comment"
  | "identifier"
  | "keyword"
  | "number"
  | "punctuation"
  | "string";

export interface SyntaxToken {
  type: SyntaxTokenType;
  value: string;
}

const KEYWORDS = new Set(
  [
    "as",
    "async",
    "await",
    "break",
    "case",
    "catch",
    "class",
    "const",
    "continue",
    "default",
    "delete",
    "do",
    "else",
    "export",
    "extends",
    "false",
    "finally",
    "for",
    "from",
    "function",
    "if",
    "implements",
    "import",
    "in",
    "instanceof",
    "interface",
    "let",
    "new",
    "null",
    "of",
    "return",
    "static",
    "super",
    "switch",
    "this",
    "throw",
    "true",
    "try",
    "type",
    "typeof",
    "undefined",
    "var",
    "void",
    "while",
    "with",
    "yield",
  ]
);

function appendToken(tokens: SyntaxToken[], type: SyntaxTokenType, value: string) {
  if (!value) return;
  const previous = tokens[tokens.length - 1];
  if (previous?.type === type) {
    previous.value += value;
  } else {
    tokens.push({ type, value });
  }
}

function scanQuotedString(
  source: string,
  start: number,
  quote: "'" | '"'
): { token: SyntaxToken; end: number } {
  let end = start + 1;
  while (end < source.length) {
    if (source[end] === "\\") {
      end += 2;
    } else if (source[end] === quote) {
      end += 1;
      break;
    } else {
      end += 1;
    }
  }
  return {
    token: { type: "string", value: source.slice(start, end) },
    end,
  };
}

function scanTemplate(
  source: string,
  start: number
): { tokens: SyntaxToken[]; end: number } {
  const tokens: SyntaxToken[] = [];
  appendToken(tokens, "punctuation", "`");
  let textStart = start + 1;
  let cursor = textStart;

  while (cursor < source.length) {
    if (source[cursor] === "\\") {
      cursor += 2;
      continue;
    }
    if (source[cursor] === "`") {
      appendToken(tokens, "string", source.slice(textStart, cursor));
      appendToken(tokens, "punctuation", "`");
      return { tokens, end: cursor + 1 };
    }
    if (source[cursor] === "$" && source[cursor + 1] === "{") {
      appendToken(tokens, "string", source.slice(textStart, cursor));
      appendToken(tokens, "punctuation", "${");
      const expression = scanCode(source, cursor + 2, true);
      expression.tokens.forEach((token) =>
        appendToken(tokens, token.type, token.value)
      );
      cursor = expression.end;
      textStart = cursor;
      continue;
    }
    cursor += 1;
  }

  appendToken(tokens, "string", source.slice(textStart));
  return { tokens, end: source.length };
}

function scanCode(
  source: string,
  start: number,
  inTemplateExpression = false
): { tokens: SyntaxToken[]; end: number } {
  const tokens: SyntaxToken[] = [];
  let cursor = start;
  let nestedBraceDepth = 0;

  while (cursor < source.length) {
    const character = source[cursor];
    const next = source[cursor + 1];

    if (inTemplateExpression && character === "}") {
      if (nestedBraceDepth === 0) {
        appendToken(tokens, "punctuation", "}");
        return { tokens, end: cursor + 1 };
      }
      nestedBraceDepth -= 1;
      appendToken(tokens, "punctuation", character);
      cursor += 1;
      continue;
    }

    if (character === "/" && next === "/") {
      const endOfLine = source.indexOf("\n", cursor);
      const end = endOfLine === -1 ? source.length : endOfLine;
      appendToken(tokens, "comment", source.slice(cursor, end));
      cursor = end;
      continue;
    }

    if (character === "/" && next === "*") {
      const endOfComment = source.indexOf("*/", cursor + 2);
      const end = endOfComment === -1 ? source.length : endOfComment + 2;
      appendToken(tokens, "comment", source.slice(cursor, end));
      cursor = end;
      continue;
    }

    if (character === "'" || character === '"') {
      const string = scanQuotedString(source, cursor, character);
      appendToken(tokens, string.token.type, string.token.value);
      cursor = string.end;
      continue;
    }

    if (character === "`") {
      const template = scanTemplate(source, cursor);
      template.tokens.forEach((token) =>
        appendToken(tokens, token.type, token.value)
      );
      cursor = template.end;
      continue;
    }

    if (/[A-Za-z_$]/.test(character)) {
      let end = cursor + 1;
      while (end < source.length && /[\w$]/.test(source[end])) end += 1;
      const identifier = source.slice(cursor, end);
      appendToken(
        tokens,
        KEYWORDS.has(identifier) ? "keyword" : "identifier",
        identifier
      );
      cursor = end;
      continue;
    }

    if (/\d/.test(character)) {
      const number = source.slice(cursor).match(
        /^(?:0[xX][\da-fA-F]+|0[bB][01]+|0[oO][0-7]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/
      );
      if (number) {
        appendToken(tokens, "number", number[0]);
        cursor += number[0].length;
        continue;
      }
    }

    if (inTemplateExpression && character === "{") nestedBraceDepth += 1;
    appendToken(tokens, "punctuation", character);
    cursor += 1;
  }

  return { tokens, end: cursor };
}

export function tokenizeCode(source: string): SyntaxToken[] {
  return scanCode(source, 0).tokens;
}

const tokenClasses: Record<SyntaxTokenType, string> = {
  comment: "text-peel-text-tertiary",
  identifier: "text-peel-text-mono",
  keyword: "text-peel-text-primary",
  number: "text-peel-text-secondary",
  punctuation: "text-peel-text-mono",
  string: "text-peel-lime",
};

export default function SyntaxCode({ value }: { value: string }) {
  const tokens = React.useMemo(() => tokenizeCode(value), [value]);
  const lineCount = React.useMemo(() => value.split("\n").length, [value]);

  return (
    <div className="max-h-[42vh] overflow-auto border border-peel-border-subtle bg-peel-surface text-[10px] leading-[1.8]">
      <div className="flex min-w-max">
        <div
          aria-hidden="true"
          className="sticky left-0 select-none border-r border-peel-border-subtle bg-peel-surface px-3 py-3 text-right text-peel-text-mono"
        >
          {Array.from({ length: lineCount }, (_, index) => (
            <div key={index}>{index + 1}</div>
          ))}
        </div>
        <pre className="select-text px-4 py-3 font-mono text-peel-text-mono">
          <code>
            {tokens.map((token, index) => (
              <span className={tokenClasses[token.type]} key={index}>
                {token.value}
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
