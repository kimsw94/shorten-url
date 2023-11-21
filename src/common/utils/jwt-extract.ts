import { Request } from 'express'
import { JwtFromRequestFunction } from 'passport-jwt'

export const JwtExtractorFromHeaders: JwtFromRequestFunction = (
  request: Request,
): string | null => {
  try {
    const jwt = request.cookies['jwt']
    // const jwt = request?.headers?.authorization?.replace('JWT ', '')
    return jwt
  } catch (error) {
    return null
  }
}