// импортируем роутер
const router = require('express').Router()

// импортируем jwt для декодирования web-token'а
const jwt = require('jwt-simple')

// импортируем конфиг
const config = require('../../config')

// импортируем модель user
const User = require('../../models/user')

/**
 * Эта функция при попытке доступа к URL без корректного web-token'а возвращает 401. При наличии оного - возвращает имя пользователя.
 */

router.get('/account', function(req, res, next){
  let username;
    if (!req.headers['authorization']) {
      return res.sendStatus(401)}
    try {
        username = jwt.decode(req.headers['authorization'], req.headers['token_key']).username
    } catch(err) {
        return res.sendStatus(401)
    }
    User.findOne({username: username}, function(err, user){
        if (err) {
            return res.sendStatus(500)
        } // ошибка БД, возвращаем 500 - Internal Server Error
        if (!user) {
          return res.sendStatus(401)} // пользователя нет в БД, возвращаем 401 - Unauthorized
        res.json(user) // если всё в порядке, возвращаем JSON с user
    })
})

module.exports = router;
