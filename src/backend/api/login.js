/**
 * Created by frank on 2017/4/25.
 */
const router = require('express').Router()

const config = require('../config')

//用户登录密码验证
router.post('/login', (req, res)=> {
  if (req.body.account === config.account && req.body.password === config.password) {
    return res.json({
      code: 200
    })
  } else {
    return res.json({
      code: 401
    })
  }
})


module.exports = router