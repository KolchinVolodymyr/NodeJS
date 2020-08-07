module.exports = function  (request, response, next) {
    const isAuth = request.auth.isAuthenticated;
    console.log('qwe',isAuth);
    next();
}