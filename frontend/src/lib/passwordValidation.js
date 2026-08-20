export const passwordRequirements = [
  { label: 'At least 8 characters', test: (password) => password.length >= 8 },
  { label: 'One uppercase letter', test: (password) => /[A-Z]/.test(password) },
  { label: 'One lowercase letter', test: (password) => /[a-z]/.test(password) },
  { label: 'One number', test: (password) => /\d/.test(password) },
  { label: 'One special character', test: (password) => /[^A-Za-z0-9]/.test(password) },
]

export function getPasswordValidationError(password) {
  const missingRequirement = passwordRequirements.find(
    (requirement) => !requirement.test(password),
  )

  return missingRequirement
    ? `Password must contain ${missingRequirement.label.toLowerCase()}`
    : null
}
