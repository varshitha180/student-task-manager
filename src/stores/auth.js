import { defineStore } from 'pinia'

// Simulated user database (replace with a real API in production).
// Stored in localStorage so registered users persist across refreshes.
const USERS_KEY = 'stm_users'
const SESSION_KEY = 'stm_session'

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  } catch {
    return []
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export const useAuthStore = defineStore('auth', {
  // State = the data this store holds.
  state: () => ({
    user: null,
    token: null,
  }),

  // Getters = derived/computed values (like computed properties).
  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  // Actions = functions that mutate state.
  actions: {
    // Called on app startup — restore session from localStorage.
    init() {
      try {
        const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
        if (session && session.token) {
          this.user = session.user
          this.token = session.token
        }
      } catch {
        // Corrupt storage — ignore.
      }
    },

    async register({ email, password, name }) {
      const users = loadUsers()
      if (users.find(u => u.email === email)) {
        throw new Error('An account with this email already exists.')
      }
      const newUser = { id: Date.now().toString(), email, name, password }
      users.push(newUser)
      saveUsers(users)
      // Auto-login after register.
      this._setSession(newUser)
      return newUser
    },

    async login({ email, password }) {
      const users = loadUsers()
      const user = users.find(u => u.email === email && u.password === password)
      if (!user) {
        throw new Error('Invalid email or password.')
      }
      this._setSession(user)
      return user
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem(SESSION_KEY)
    },

    _setSession(user) {
      // Fake JWT-style token — in real app, this comes from your backend.
      this.user = { id: user.id, email: user.email, name: user.name }
      this.token = `fake-jwt-${user.id}-${Date.now()}`
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        user: this.user,
        token: this.token,
      }))
    },
  },
})