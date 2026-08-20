import jwt from 'jsonwebtoken'

export function requireAuth(request, response, next) {
  const authorizationHeader = request.headers.authorization

  if (!authorizationHeader?.startsWith('Bearer ')) {
    return response.status(401).json({ message: 'Authentication required' })
  }

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not configured')
    return response.status(500).json({ message: 'Authentication is not configured' })
  }

  const token = authorizationHeader.slice('Bearer '.length)

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    request.user = { id: decodedToken.userId }
    next()
  } catch (error) {
    return response.status(401).json({ message: 'Invalid or expired token' })
  }
}
