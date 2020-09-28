

module.exports = function(email) {
    return {
        from: 'admin@volodymyrkolchin.ru', //email
        to: 'admin@volodymyrkolchin.ru',
        subject: 'Аккаунт создан',
        html: `
              <h1>Добро пожаловать в наш магазин</h1>
              <p>Вы успешно создали аккаунт c email - ${email}</p>
              <hr />
              <a href="http://desktop-hsg40jn:8080/">Магазин курсов</a>
            `
    }
}