export default (to, from, next) => {
  if (localStorage.getItem("token")) {
    next();
  } else {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    next({ name: "login" });
  }
};
