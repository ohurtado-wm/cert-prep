import type { DatabaseHandle } from '../db/client'
import { recordGatewayUser } from '../db/repository'
import type { UserProvider } from '../gateway/user-provider'

export async function resolveCurrentUser(request: Request, db: DatabaseHandle, userProvider: UserProvider) {
  const gatewayUser = await userProvider(request)
  await recordGatewayUser(db, gatewayUser.id)

  return {
    id: gatewayUser.id,
    email: gatewayUser.email,
    avatar: gatewayUser.avatar,
  }
}
