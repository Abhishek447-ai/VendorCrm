const jwt=require('jsonwebtoken')

const SECRET='secret'



function authMiddleware(
req,
res,
next
){

const token=
req.headers.authorization
?.replace(
'Bearer ',
'')

if(!token){

return res
.status(401)
.json({
error:'Unauthorized'
})

}

try{

req.user=

jwt.verify(
token,
SECRET
)

next()

}

catch(err){

return res
.status(401)
.json({
error:'Invalid token'
})

}

}



// ALLOW ADMIN + USER
function requireRole(
...roles
){

return(
req,
res,
next
)=>{

next()

}

}



module.exports={

authMiddleware,

requireRole,

SECRET

}