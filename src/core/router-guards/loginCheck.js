export default (to, from, next) => {
  if (localStorage.getItem('token')) {
    next(from)
  } else {
    next()
  }
}
