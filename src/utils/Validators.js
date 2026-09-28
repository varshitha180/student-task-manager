// Shared validation helpers.
// Used by Login/Register forms (Week 2 deliverable).

/**
 * Validate an email address using a simple RFC-5322 inspired pattern.
 * @param {string} email
 * @returns {boolean}
 */
export function validateEmail(email) {
  if (!email) return false
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

/**
 * Validate password strength.
 * @param {string} password
 * @returns {boolean}
 */
export function validatePassword(password) {
  return typeof password === 'string' && password.length >= 6
}