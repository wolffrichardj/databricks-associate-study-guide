interface MarkdownTextProps {
  text: string;
  inline?: boolean;
}

type Token =
  | { type: "text"; value: string }
  | { type: "bold"; value: string }
  | { type: "italic"; value: string }
  | { type: "code"; value: string };

const parseInline = (text: string): Token[] => {
  const tokens: Token[] = [];
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let lastIndex = 0;

  for (const match of text.matchAll(pattern)) {
    const full = match[0];
    const index = match.index ?? 0;

    if (index > lastIndex) {
      tokens.push({ type: "text", value: text.slice(lastIndex, index) });
    }

    if (full.startsWith("**") && full.endsWith("**")) {
      tokens.push({ type: "bold", value: full.slice(2, -2) });
    } else if (full.startsWith("*") && full.endsWith("*")) {
      tokens.push({ type: "italic", value: full.slice(1, -1) });
    } else if (full.startsWith("`") && full.endsWith("`")) {
      tokens.push({ type: "code", value: full.slice(1, -1) });
    } else {
      tokens.push({ type: "text", value: full });
    }

    lastIndex = index + full.length;
  }

  if (lastIndex < text.length) {
    tokens.push({ type: "text", value: text.slice(lastIndex) });
  }

  return tokens;
};

const renderInline = (line: string, keyPrefix: string) => {
  return parseInline(line).map((token, index) => {
    const key = `${keyPrefix}-${index}`;
    if (token.type === "bold") {
      return <strong key={key}>{token.value}</strong>;
    }
    if (token.type === "italic") {
      return <em key={key}>{token.value}</em>;
    }
    if (token.type === "code") {
      return <code key={key}>{token.value}</code>;
    }
    return <span key={key}>{token.value}</span>;
  });
};

export function MarkdownText({ text, inline = false }: MarkdownTextProps) {
  const lines = text
    .split("\n")
    .filter(
      (line, index, arr) => line || arr.length === 1 || index < arr.length - 1,
    );

  if (inline) {
    return <>{renderInline(text, "inline")}</>;
  }

  return (
    <>
      {lines.map((line, lineIndex) => (
        <p key={`line-${lineIndex}`}>
          {renderInline(line, `line-${lineIndex}`)}
        </p>
      ))}
    </>
  );
}
