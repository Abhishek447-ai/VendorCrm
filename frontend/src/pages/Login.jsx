import React,{useState} from 'react'

import {
login,
saveToken,
saveRole
}
from '../api'

export default function Login({
onLogin
}){

const[email,setEmail]=
useState('')

const[password,setPassword]=
useState('')

const[error,setError]=
useState('')

async function handleLogin(){

try{

const res=

await login(
email,
password
)

saveToken(
res.token
)

saveRole(
res.role
)

onLogin()

}

catch(err){

setError(
err.message
)

}

}

return(

<div
className=
"min-h-screen flex items-center justify-center bg-slate-100"
>

<div
className=
"bg-white p-10 rounded-xl shadow w-[420px]"
>

<h1
className=
"text-4xl font-bold mb-8"
>

Vendor CRM System

</h1>


<input

type="email"

placeholder=
"Email"

value=
{email}

onChange=
{
e=>
setEmail(
e.target.value
)
}

className=
"w-full border p-3 rounded mb-4"

/>


<input

type="password"

placeholder=
"Password"

value=
{password}

onChange=
{
e=>
setPassword(
e.target.value
)
}

className=
"w-full border p-3 rounded mb-4"

/>


{

error &&

<p
className=
"text-red-600 mb-4"
>

{error}

</p>

}


<button

onClick=
{
handleLogin
}

className=
"w-full bg-green-600 text-white p-3 rounded"

>

Login

</button>

</div>

</div>

)

}