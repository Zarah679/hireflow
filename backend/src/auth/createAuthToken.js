import jwt from 'jsonwebtoken'

export function createAuthToken(userId) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required. Add it to the backend .env file.')
  }

  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })
}
