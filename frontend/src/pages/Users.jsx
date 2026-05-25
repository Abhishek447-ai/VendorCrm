import React,{useState}
from 'react'

import{
request,
getRole
}
from '../api'

export default function Users(){

const role=
getRole()

const[
form,
setForm
]=useState({

email:'',
password:'',
role:'user'

})

const[
msg,
setMsg
]=useState('')


async function handleCreate(e){

e.preventDefault()


if(

!/^[^\s@]+@[^\s@]+\.[^\s@]+$/

.test(
form.email
)

){

setMsg(
'Enter valid email'
)

setTimeout(()=>{

setMsg('')

},3000)

return

}


if(

!form.password.trim()

){

setMsg(
'Password required'
)

setTimeout(()=>{

setMsg('')

},3000)

return

}


try{

await request(

'/auth/users',

{

method:'POST',

body:

JSON.stringify(
form)

}

)


setMsg(

form.role===

'admin'

?

'Successfully created admin ✅'

:

'Successfully created user ✅'

)


setTimeout(()=>{

setMsg('')

},3000)


setForm({

email:'',
password:'',
role:'user'

})

}

catch(err){

if(

err.message
.toLowerCase()
.includes(
'exists'
)

||

err.message
.toLowerCase()
.includes(
'email'
)

){

setMsg(
'Email already exists'
)

}

else{

setMsg(
'Error: '
+
err.message
)

}


setTimeout(()=>{

setMsg('')

},3000)

}

}



if(

role

!==

'admin'

){

return(

<div
className="
text-center
text-red-600
text-2xl
font-bold
mt-20
"
>

Unauthorized

</div>

)

}



return(

<div
className="
mx-auto
max-w-xl
space-y-6
rounded-3xl
bg-white
p-6
shadow-sm
ring-1
ring-slate-200
"
>

<div>

<h2
className="
text-2xl
font-semibold
text-slate-900
"
>

Users (Admin)

</h2>

<p
className="
mt-2
text-sm
text-slate-500
"
>

Create new users with role-based access.

</p>

</div>


<form
onSubmit={
handleCreate
}
className="
grid
gap-4
"
>


<input

type="email"

placeholder="Email"

value={form.email}

onChange={e=>

setForm({

...form,

email:
e.target.value

})

}

className="
rounded-2xl
border
border-slate-300
bg-slate-50
px-4
py-3
outline-none
focus:ring-2
"

required

/>


<input

type="password"

placeholder="Password"

value={form.password}

onChange={e=>

setForm({

...form,

password:
e.target.value

})

}

className="
rounded-2xl
border
border-slate-300
bg-slate-50
px-4
py-3
outline-none
focus:ring-2
"

required

/>


<select

value={form.role}

onChange={e=>

setForm({

...form,

role:
e.target.value

})

}

className="
rounded-2xl
border
border-slate-300
bg-slate-50
px-4
py-3
"

>

<option value="user">

User

</option>

<option value="admin">

Admin

</option>

</select>


<button
className="
rounded-2xl
bg-slate-900
text-white
py-3
font-semibold
hover:bg-slate-700
"
>

Create

</button>

</form>


{

msg&&(

<div
className={`

rounded-xl
p-4

${

msg.includes(
'Successfully'
)

?

'bg-green-100 text-green-700'

:

'bg-red-100 text-red-700'

}

`}

>

{msg}

</div>

)

}

</div>

)

}