// импортируем роутер
const router = require('express').Router();

// импортируем bcrypt, здесь он нужен для сверки пароля с хешем из БД
const bcrypt = require('bcrypt');

// импортируем jwt чтобы создавать web-token'ы для последующей отправки пользователю
const jwt = require('jwt-simple');

// импортируем файл конфигурации
const config = require('../../config');

// импортируем модельку user
const User = require('../../models/user');
// для генерации ключа
const crypto = require('crypto');



/**
 * Этот модуль имеет единственный метод. При получении запроса типа POST, в котором содержится логин и пароль,
 * эта функция ищет в БД пользователя с таким username, получает хеш его пароля и сверяет с помощью bcrypt с полученным
 * в запросе паролем. При ошибках обработки возвращает статус 500. При неправильных данных - 401 - Unauthorized.
 * При успехе возвращает токен.
 */

router.post ('/login', function(req, res, next){
    let username;
    let password;
    if (!req.body.username || !req.body.password) {
        console.log('Bad auth');
        return res.json({message: "Bad auth"}).status(401);// если один или оба параметра запроса опущены, возвращаем 400 - Bad Request
    } else {
        username = req.body.username;
        password = req.body.password;
        User.findOne(
          {
            $or: [
              {username: username},
              {email: username}
            ]
          }
           )
        .select('password') // указываем явно, что нам нужно значение поля password (ибо его выборка отключена в модели)
        .exec(function(err, user){
            if (err) {
                return res.json(err)
            }
            if (!user) {
              return res.json({message: "Incorrect user"}).status(401);
              }
            bcrypt.compare(password, user.password, function(err, valid){
            if (err) {
              return res.json(err)
            }
            if (!valid){
              return res.json({message: "Incorrect password"}).status(401);
            }
            const tokenKey = crypto.randomBytes(20).toString('hex');
            const token = jwt.encode({username: username}, tokenKey); // config.secretkey 
            res.json({success: true, access_token: token, token_key: tokenKey});
          })
        })
    }
})

module.exports = router;
