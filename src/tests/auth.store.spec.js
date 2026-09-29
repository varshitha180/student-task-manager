import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../stores/auth'

beforeEach(() => {
  setActivePinia(createPinia())
  localStorage.clear()
})

describe('auth store', () => {
  it('starts unauthenticated', () => {
    const auth = useAuthStore()
    expect(auth.isAuthenticated).toBe(false)
    expect(auth.user).toBeNull()
  })

  it('registers a new user and logs them in', async () => {
    const auth = useAuthStore()
    await auth.register({ name: 'Varsha', email: 'v@x.com', password: 'secret' })
    expect(auth.isAuthenticated).toBe(true)
    expect(auth.user.name).toBe('Varsha')
  })

  it('rejects duplicate registration', async () => {
    const auth = useAuthStore()
    await auth.register({ name: 'A', email: 'a@x.com', password: 'secret' })
    await expect(auth.register({ name: 'B', email: 'a@x.com', password: 'secret' }))
      .rejects.toThrow('already exists')
  })

  it('logs in an existing user', async () => {
    const auth = useAuthStore()
    await auth.register({ name: 'A', email: 'a@x.com', password: 'secret' })
    auth.logout()
    expect(auth.isAuthenticated).toBe(false)
    await auth.login({ email: 'a@x.com', password: 'secret' })
    expect(auth.isAuthenticated).toBe(true)
  })

  it('rejects wrong password', async () => {
    const auth = useAuthStore()
    await auth.register({ name: 'A', email: 'a@x.com', password: 'secret' })
    auth.logout()
    await expect(auth.login({ email: 'a@x.com', password: 'wrong' }))
      .rejects.toThrow('Invalid')
  })

  it('persists session across init()', async () => {
    const auth = useAuthStore()
    await auth.register({ name: 'A', email: 'a@x.com', password: 'secret' })
    // Simulate a page reload by creating a fresh store + calling init.
    const fresh = useAuthStore()
    fresh.user = null
    fresh.token = null
    fresh.init()
    expect(fresh.isAuthenticated).toBe(true)
    expect(fresh.user.email).toBe('a@x.com')
  })

  it('logout clears state and storage', async () => {
    const auth = useAuthStore()
    await auth.register({ name: 'A', email: 'a@x.com', password: 'secret' })
    auth.logout()
    expect(auth.isAuthenticated).toBe(false)
    expect(auth.user).toBeNull()
    expect(localStorage.getItem('stm_session')).toBeNull()
  })
})