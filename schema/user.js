const joi =require('joi')

const username = joi.string().alphanum().min(3).max(10).required()

const password = joi.string().pattern(/^[\S]{6,12}$/).required()

const repassword = joi.ref('password')

exports.register_schema = {
    body:{
        username,
        password,
        repassword
    }
}

exports.login_schema = {
    body:{
        username,
        password
    }
}


// 定义 id, nickname, emial 的验证规则
const id = joi.number().integer().min(1).required() 
const nickname = joi.string().required()
const email = joi.string().email().required()

exports.update_userinfo_schema = {
    body:{
        id,
        nickname,
        email,
    }
}

exports.update_password_schema = {
    body:{
        old_pwd:password,
        new_pwd:joi.not(joi.ref('old_pwd')).concat(password),
        re_pwd:joi.valid(joi.ref('new_pwd')).required()
    }
}

// dataUri() 指的是如下格式的字符串数据:
// data:image/png;base64,VE9PTUFOWVNFQ1JFVFM=
const avatar = joi.string().dataUri().required()
exports.update_avatar_schema = {
    body:{
        avatar
    }
}