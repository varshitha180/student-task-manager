import { describe, it, expect } from 'vitest'
import { validateEmail, validatePassword } from '../utils/validators'

describe('validateEmail', () => {
  it('accepts a standard email', () => {
    expect(validateEmail('user@college.edu')).toBe(true)
  })
  it('accepts a Gmail-style email', () => {
    expect(validateEmail('john.doe@gmail.com')).toBe(true)
  })
  it('rejects missing @', () => {
    expect(validateEmail('usercollege.edu')).toBe(false)
  })
  it('rejects missing domain', () => {
    expect(validateEmail('user@')).toBe(false)
  })
  it('rejects empty string', () => {
    expect(validateEmail('')).toBe(false)
  })
  it('rejects whitespace inside', () => {
    expect(validateEmail('user @college.edu')).toBe(false)
  })
})

describe('validatePassword', () => {
  it('accepts a 6+ char password', () => {
    expect(validatePassword('secret')).toBe(true)
  })
  it('rejects a short password', () => {
    expect(validatePassword('123')).toBe(false)
  })
  it('rejects empty', () => {
    expect(validatePassword('')).toBe(false)
  })
  it('rejects non-string', () => {
    expect(validatePassword(null)).toBe(false)
  })
})