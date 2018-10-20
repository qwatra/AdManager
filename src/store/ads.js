import * as fb from 'firebase'

class Ad {
  constructor(title, description, ownerId, imageSrc='', promo=false, id=null) {
    this.title = title
    this.description = description
    this.ownerId = ownerId
    this.imageSrc = imageSrc
    this.promo = promo
    this.id = id
  }
}

export default {
  state: {
    ads: []
  },
  actions: {
    async fetchAds({commit}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const fbVal = await fb.database().ref('ads').once('value')
        const ads = fbVal.val()

        if(ads != null) {
          commit('loadAds', Object.keys(ads).map(id => {
            let ad = ads[id]
            return new Ad(ad.title, ad.description, ad.ownerId, ad.imageSrc, ad.promo, id)
          }))
        }
        commit('setLoading', false)
      } catch(error) {
        commit('setError', error.message)
        commit('setLoading', false)
        throw error
      }
    },
    async createAd ({commit, getters}, payload) {
      commit('clearError')
      commit('setLoading', true)

      try {
        const image = payload.image
        const newAd = new Ad(
          payload.title,
          payload.description,
          getters.user.uid,
          '',
          payload.promo)

        const ad = await fb.database().ref('ads').push(newAd)
        const imageExt = image.name.slice(image.name.lastIndexOf('.'))
        const fileData = await fb.storage().ref(`ads/${ad.key}${imageExt}`).put(image)
        const imageSrc = await fileData.ref.getDownloadURL()

        await fb.database().ref('ads').child(ad.key).update({
          imageSrc
        })

        commit('setLoading', false)
        commit('createAd', {...newAd, id: ad.key, imageSrc})
      } catch(error) {
        commit('setError', error.message)
        commit('setLoading', false)
        throw error
      }
    },
    async updateAd ({commit}, {title, description, id}) {
      commit('clearError')
      commit('setLoading', true)

      try {
        await fb.database().ref('ads').child(id).update({
          title, description
        })
        commit('updateAd', {
          title, description, id
        })
        commit('setLoading', false)
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', false)
        throw error
      }
    }
  },
  mutations: {
    createAd (state, payload) {
      state.ads.push(payload)
    },
    loadAds (state,  payload) {
      state.ads = payload
    },
    updateAd (state, {title, description, id}) {
      const ad = state.ads.find(a => {
        return a.id === id
      })

      ad.title = title
      ad.description = description
    }
  },
  getters: {
    ads (state) {
      return state.ads
    },
    adsPromo (state) {
      return state.ads.filter(ad => ad.promo)
    },
    myAds (state, getters) {
      return state.ads.filter(ad => {
        return ad.ownerId === getters.user.uid
      })
    },
    adById (state) {
      return id => state.ads.filter(ad => ad.id === id)[0]
    }
  }
}
