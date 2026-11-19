import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { AccountAvatar } from './AccountAvatar'

describe('account avatar', () => {
  test('renders a provided profile image as decorative content', () => {
    const html = renderToStaticMarkup(<AccountAvatar avatar="https://example.com/avatar.png" />)
    expect(html).toContain('src="https://example.com/avatar.png"')
    expect(html).toContain('alt=""')
    expect(html).toContain('aria-hidden="true"')
  })

  test('shows the default avatar when no image is provided', () => {
    for (const avatar of [null, undefined, '', '  ']) {
      const html = renderToStaticMarkup(<AccountAvatar avatar={avatar} />)
      expect(html).toContain('account-avatar-fallback')
      expect(html).not.toContain('account-avatar-image')
    }
  })
})
