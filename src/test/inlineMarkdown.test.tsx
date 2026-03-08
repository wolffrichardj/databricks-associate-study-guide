import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderInlineMarkdown } from '../lib/inlineMarkdown'

describe('renderInlineMarkdown', () => {
  it('renders inline code segments as code tags', () => {
    const { container } = render(<p>{renderInlineMarkdown('Use `VERSION AS OF` for Delta time travel.')}</p>)

    expect(container.querySelector('code')?.textContent).toBe('VERSION AS OF')
    expect(container.textContent).toContain('for Delta time travel.')
  })
})
