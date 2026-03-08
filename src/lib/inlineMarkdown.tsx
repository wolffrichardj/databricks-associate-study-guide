import type { ReactNode } from 'react'

export function renderInlineMarkdown(value: string): ReactNode[] {
  const tokens = value.split(/(`[^`]+`)/g)

  return tokens
    .filter((token) => token.length > 0)
    .map((token, index) => {
      if (token.startsWith('`') && token.endsWith('`')) {
        return <code key={`code-${index}`}>{token.slice(1, -1)}</code>
      }

      return <span key={`text-${index}`}>{token}</span>
    })
}
