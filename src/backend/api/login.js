/**
 * Created by frank on 2017/4/25.
 */
const router = require('express').Router()

const config = require('../config')

function generateToken() {
  const crypto = require('crypto');
  return crypto.randomBytes(32).toString('hex')
}

//用户登录密码验证
router.post('/login', (req, res)=> {
  if (req.body.account === config.account && req.body.password === config.password) {
    const token = generateToken()
    //设置cookie
    res.cookie('vms_token', token, {
      path: '/vms',
      maxAge: config.cookieExp * 60 * 60 * 1000
    })
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