
function resetEmail(email, token) {
    return {
        from: 'admin@volodymyrkolchin.ru', //email
        to: email,
        subject: 'Восстановление доступа',
        html: `
      <h1>Вы забыли пароль?</h1>
      <p>Если нет, то проигнорируйте данное письмо</p>
      <p>Иначе нажмите на ссылку ниже:</p>
      <p><a href="http://desktop-hsg40jn:8080/password/${token}">Восстановить доступ</a></p>
      <hr />
      <a href="http://desktop-hsg40jn:8080/">Магазин курсов</a>
    `
    }
}

function regEmail(email) {
    return {
        from: 'admin@volodymyrkolchin.ru', //email
        to: email,
        subject: 'Аккаунт создан',
        html: `
              <h1>Добро пожаловать в наш магазин</h1>
              <p>Вы успешно создали аккаунт c email - ${email}</p>
              <hr />
              <a href="http://desktop-hsg40jn:8080/">Магазин курсов</a>
            `
    }
}

module.exports = {resetEmail, regEmail};