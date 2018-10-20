import store from '../store'
export default function(to, from, next) {
  if(store.getters.user) {
    next()
  } else {
    console.log(to.fullPath)
    next(`/login?seсurityError=${to.name}`)
  }
}
