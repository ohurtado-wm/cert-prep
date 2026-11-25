import type { ReactNode } from 'react'

export function ErrorAlert({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={className} role="alert">{children}</p>
}
