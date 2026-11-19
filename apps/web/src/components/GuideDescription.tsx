import { Fragment, type ReactNode } from 'react'

// Guide text can contain Markdown links or plain URLs. Render text as React nodes,
// and only turn HTTP(S) URLs into links.
function inlineText(value: string): ReactNode[] {
  const pattern = /\[([^\]\n]+)\][ \t]*\((https?:\/\/(?:[^\s()]|\([^\s()]*\))+)\)|(https?:\/\/[^\s<>]+)/gi
  const result: ReactNode[] = []
  let offset = 0
  for (const match of value.matchAll(pattern)) {
    const start = match.index
    if (start > offset) result.push(value.slice(offset, start))
    const rawUrl = match[2] ?? match[3]!
    let url = rawUrl
    if (match[3]) {
      const brackets: Record<string, string> = { ')': '(', ']': '[', '}': '{' }
      while (url) {
        const last = url.at(-1)!
        if (/[.,;:!?]/.test(last)) { url = url.slice(0, -1); continue }
        const opening = brackets[last]
        if (opening && [...url].filter((char) => char === last).length > [...url].filter((char) => char === opening).length) {
          url = url.slice(0, -1)
          continue
        }
        break
      }
    }
    const suffix = rawUrl.slice(url.length)
    let safe = false
    try {
      const parsed = new URL(url)
      safe = parsed.protocol === 'https:' || parsed.protocol === 'http:'
    } catch {
      // Leave malformed content as text.
    }
    if (safe) {
      result.push(<a key={start} href={url} target="_blank" rel="noreferrer">{match[1] ?? url}</a>)
      if (suffix) result.push(suffix)
    } else {
      result.push(match[0])
    }
    offset = start + match[0].length
  }
  if (offset < value.length) result.push(value.slice(offset))
  return result
}

export function GuideDescription({ text }: { text: string }) {
  const lines = text.split(/\r?\n/)
  const blocks: Array<{ kind: 'text' | 'list'; lines: string[] }> = []
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue
    const bullet = trimmed.match(/^(?:[-*•]|\d+[.)])\s+(.+)$/)
    const kind = bullet ? 'list' : 'text'
    const content = bullet?.[1] ?? trimmed
    const last = blocks.at(-1)
    if (kind === 'list' && last?.kind === 'list') last.lines.push(content)
    else blocks.push({ kind, lines: [content] })
  }
  return <div className="topic-description">{blocks.map((block, index) => (
    <Fragment key={index}>
      {block.kind === 'list'
        ? <ul>{block.lines.map((line, lineIndex) => <li key={lineIndex}>{inlineText(line)}</li>)}</ul>
        : <p>{inlineText(block.lines[0]!)}</p>}
    </Fragment>
  ))}</div>
}
