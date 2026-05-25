const express = require('express');
const router = express.Router();

const { load, save } = require('../db');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const {
authMiddleware,
requireRole,
SECRET
} = require('../utils/auth_middleware');



// LOGIN
router.post(

'/login',

(req,res)=>{

try{

const {

email,
password

}

=

req.body


const data=
load()


if(
!Array.isArray(
data.users
)
){

data.users=[]

}


if(
!Array.isArray(
data.vendors
)
){

data.vendors=[]

}



let user=

data.users.find(

u=>

u.email===email

)



if(
!user
){

user=

data.vendors.find(

v=>

v.email===email

)

}



if(
!user
){

return res
.status(401)
.json({

error:
'Invalid credentials'

})

}



let ok=

password===user.password



if(

!ok

&&

user.password

&&

user.password.startsWith('$2')

){

ok=

bcrypt.compareSync(

password,

user.password

)

}



if(
!ok
){

return res
.status(401)
.json({

error:
'Invalid credentials'

})

}



const token=

jwt.sign(

{

id:
user.id
||
user.vendor_id,

email:
user.email,

role:
user.role
||
'vendor'

},

SECRET,

{

expiresIn:
'8h'

}

)



return res.json({

token,

role:
user.role
||
'vendor'

})

}

catch(err){

console.error(err)

return res
.status(500)
.json({

error:
err.message

})

}

}

)




// CREATE USER
router.post(

'/users',

authMiddleware,

requireRole(
'admin'
),

(req,res)=>{

try{

const {

email,

password,

role

}

=

req.body



if(

!email

||

!password

||

!role

){

return res
.status(400)
.json({

error:
'Missing fields'

})

}



const data=
load()


if(
!Array.isArray(
data.users
)
){

data.users=[]

}



if(

data.users.some(

u=>

u.email===email

)

){

return res
.status(400)
.json({

error:
'User exists'

})

}



const id=

data.users.length

?

Math.max(

...data.users.map(
u=>u.id
)

)

+1

:

1



data.users.push({

id,

email,

password,

role

})



save(
data
)



return res.json({

ok:true

})

}

catch(err){

console.error(err)

return res
.status(500)
.json({

error:
err.message

})

}

}

)
router.get(

'/users',

authMiddleware,

(req,res)=>{

const data=load()

res.json(

data.users||[]

)

}

)


module.exports =
router