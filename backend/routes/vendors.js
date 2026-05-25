const express=require('express')

const router=express.Router()

const{
load,
save
}=require('../db')

const{
authMiddleware,
requireRole
}=require('../utils/auth_middleware')



// CREATE

router.post(

'/',

authMiddleware,

requireRole(
'admin',
'user'
),

(req,res)=>{

const{

vendor_id,
name,
email,
contact,
location,
vendor_type,
description,
is_active

}=req.body


const data=load()

data.vendors=
data.vendors||[]


// CHECK DUPLICATE ID
if(

data.vendors.some(

v=>

v.vendor_id===vendor_id

)

){

return res
.status(400)
.json({

error:
'vendor_id exists'

})

}


// CREATE
data.vendors.push({

vendor_id,

name,

email,

contact,

location,

vendor_type,

description,

is_active:

Number(
is_active
)

===1

?

1

:

0

})


save(
data
)


return res.json({

ok:true

})

}

)




// UPDATE

router.put(

'/:vendor_id',

authMiddleware,

requireRole(
'admin',
'user'
),

(req,res)=>{

const{
vendor_id
}=req.params


const{

name,
email,
contact,
location,
vendor_type,
description,
is_active

}=req.body


const data=load()


const idx=

(data.vendors||[])

.findIndex(

v=>

v.vendor_id===vendor_id

)


if(
idx===-1
){

return res
.status(404)
.json({

error:
'Vendor not found'

})

}


// UPDATE
data.vendors[idx]={

...data.vendors[idx],

name,

email,

contact,

location,

vendor_type,

description,

is_active:

Number(
is_active
)

===1

?

1

:

0

}


save(
data
)


return res.json({

ok:true

})

}

)




// DELETE

router.delete(

'/:vendor_id',

authMiddleware,

requireRole(
'admin',
'user'
),

(req,res)=>{

const{
vendor_id
}=req.params


const data=load()


const before=

(data.vendors||[])

.length


data.vendors=

(data.vendors||[])

.filter(

v=>

v.vendor_id!==vendor_id

)


save(
data
)


return res.json({

deleted:

before-

data.vendors.length

})

}

)




// LIST

router.get(

'/',

authMiddleware,

(req,res)=>{

const{
active
}=req.query


const data=load()


let rows=
data.vendors||[]


if(
active==='1'
){

rows=

rows.filter(

r=>

Number(
r.is_active
)

===1

)

}


if(
active==='0'
){

rows=

rows.filter(

r=>

Number(
r.is_active
)

===0

)

}


return res.json(
rows
)

}

)



module.exports=
router