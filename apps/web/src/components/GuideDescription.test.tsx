import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { GuideDescription } from './GuideDescription'

describe('guide description', () => {
  test('renders Markdown and plain web links while preserving surrounding text', () => {
    const html = renderToStaticMarkup(<GuideDescription text={'Read [the guide](https://example.com/guide) or https://example.com/path.'} />)
    expect(html).toContain('<a href="https://example.com/guide" target="_blank" rel="noreferrer">the guide</a>')
    expect(html).toContain('<a href="https://example.com/path" target="_blank" rel="noreferrer">https://example.com/path</a>.')
  })

  test('renders a Markdown link with whitespace before its URL', () => {
    const html = renderToStaticMarkup(<GuideDescription text={'Explore ([skills.google] (https://www.skills.google/paths/22)) for details.'} />)
    expect(html).toContain('(<a href="https://www.skills.google/paths/22" target="_blank" rel="noreferrer">skills.google</a>)')
    expect(html).not.toContain('[skills.google]')
  })

  test('keeps enclosing punctuation outside URLs while preserving balanced parentheses', () => {
    const html = renderToStaticMarkup(<GuideDescription text={'Ver (https://example.com/guide). Ver https://example.com/Foo_(bar). Ver [artículo](https://example.com/Foo_(bar)).'} />)
    expect(html).toContain('(<a href="https://example.com/guide" target="_blank" rel="noreferrer">https://example.com/guide</a>).')
    expect(html).toContain('<a href="https://example.com/Foo_(bar)" target="_blank" rel="noreferrer">https://example.com/Foo_(bar)</a>.')
    expect(html).toContain('<a href="https://example.com/Foo_(bar)" target="_blank" rel="noreferrer">artículo</a>.')
  })

  test('renders bullet lines as list items and does not turn unsafe URLs or HTML into markup', () => {
    const html = renderToStaticMarkup(<GuideDescription text={'Topics:\n- First\n- [Unsafe](javascript:alert(1))\n<script>alert(1)</script>'} />)
    expect(html).toContain('<ul><li>First</li><li>[Unsafe](javascript:alert(1))</li></ul>')
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;')
    expect(html).not.toContain('href="javascript:')
  })
})
