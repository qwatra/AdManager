import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import BuyModalComponent from '@/components/Shared/BuyModal'
import 'vuetify/dist/vuetify.min.css'
import * as fb from 'firebase'

Vue.use(Vuetify)
Vue.component('app-buy-modal', BuyModalComponent)
Vue.config.productionTip = false

if(localStorage.getItem('SignIn')) {
  store.dispatch('autoLogin', {uid: 0});
}

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created() {
    fb.initializeApp({
      apiKey: "AIzaSyCGmD4R7bKMvH1BBJdggXvVtutyZtIF8kA",
      authDomain: "itc-ads-158cb.firebaseapp.com",
      databaseURL: "https://itc-ads-158cb.firebaseio.com",
      projectId: "itc-ads-158cb",
      storageBucket: "itc-ads-158cb.appspot.com",
      messagingSenderId: "47232602404"
    });
    fb.auth().onAuthStateChanged(user => {
      if(user) {
        localStorage.setItem('SignIn', '1')
        this.$store.dispatch('autoLogin', user);
        this.$store.dispatch('fetchOrders');
      } else {
        localStorage.removeItem('SignIn')
        this.$store.commit('setUser', null)
      }
      this.$store.dispatch('fetchAds')
    })
  }
})
