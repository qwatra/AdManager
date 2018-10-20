import * as fb from 'firebase'

class User {
  constructor (uid) {
    this.uid = uid
  }
}

export default {
  state: {
    user: null
  },
  actions: {
    async registerUser ({commit}, {email, password}) {
      commit('setLoading', true)
      commit('clearError')
      try {
        let auth = await fb.auth().createUserWithEmailAndPassword(email, password)
        commit('setUser', new User(auth.user.uid))
        commit('setLoading', false)
      } catch(error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    async loginUser ({commit}, {email, password}) {
      commit('setLoading', true)
      commit('clearError')
      try {
        let auth = await fb.auth().signInWithEmailAndPassword(email, password)
        commit('setUser', new User(auth.user.uid))
        commit('setLoading', false)
      } catch(error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    autoLogin({commit}, user) {
      commit('setUser', new User(user.uid))
    },
    logoutUser({commit}) {
      localStorage.removeItem('SignIn')
      fb.auth().signOut()
      commit('setUser', null)
    }
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    }
  },
  getters: {
    user (state) {
      return state.user
    },
    isUserLoggedIn(state) {
      return state.user
    }
  }
}
