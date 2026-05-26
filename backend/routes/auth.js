const express = require('express')
const router = express.Router()

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { load } = require('../db')

router.post('/login', async (req, res) => {

try{

const { email, password } = req.body

const data = load()

const user =
data.users.find(
u => u.email === email
)

if(!user){

return res
.status(401)
.json({
message:'Invalid credentials'
})

}

const valid =
bcrypt.compareSync(
password==
user.password
)

if(!valid){

return res
.status(401)
.json({
message:'Invalid credentials'
})

}

const token =
jwt.sign(

{
id:user.id,
role:user.role
},

process.env.JWT_SECRET
||

'secret',

{
expiresIn:'7d'
}

)

res.json({

token,
role:user.role

})

}

catch(err){

console.log(err)

res
.status(500)
.json({
message:'Server error'
})

}

})

module.exports = router