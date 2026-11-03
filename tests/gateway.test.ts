import { describe, expect, test } from 'bun:test'
import { createGatewayUserProvider } from '../apps/api/src/gateway/user-provider'

describe('gateway user provider', () => {
  test('forwards the caller session and validates the resolved user', async () => {
    let receivedHeaders = new Headers()
    const provider = createGatewayUserProvider('https://gateway.example/users/me', async (_input, init) => {
      receivedHeaders = new Headers(init?.headers)
      return Response.json({
        id: 'resolved-id',
        email: 'learner@example.com',
        permissions: [],
      })
    })

    const user = await provider(new Request('https://app.example/api/v1/me', {
      headers: { cookie: 'session=opaque', authorization: 'Bearer opaque-token' },
    }))
    expect(user.id).toBe('resolved-id')
    expect(receivedHeaders.get('cookie')).toBe('session=opaque')
    expect(receivedHeaders.get('authorization')).toBe('Bearer opaque-token')
  })

  test('does not expose gateway response bodies on invalid response', async () => {
    const provider = createGatewayUserProvider('https://gateway.example/users/me', async () =>
      Response.json({ secret: 'must-not-leak' }))

    await expect(provider(new Request('https://app.example/api/v1/me'))).rejects.toMatchObject({
      code: 'INVALID_GATEWAY_RESPONSE',
      status: 502,
    })
  })
})
