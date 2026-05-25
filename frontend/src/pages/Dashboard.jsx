import React,{useEffect,useState} from 'react'

import{
fetchVendors,
fetchOrders
}
from '../api'

export default function Dashboard(){

const[
vendorCount,
setVendorCount
]=useState(0)

const[
orderCount,
setOrderCount
]=useState(0)

const[
userCount,
setUserCount
]=useState(0)

useEffect(()=>{

load()

},[])

async function load(){

try{

const vendors=
await fetchVendors()

setVendorCount(
vendors.length
)

const orders=
await fetchOrders()

setOrderCount(
orders.length
)

const users=

await fetch(

'http://localhost:3000/api/auth/users',

{

headers:{

Authorization:
`Bearer ${localStorage.getItem('token')}`

}

}

)

const userData=

await users.json()

setUserCount(
userData.length
)

}

catch(err){

console.log(err)

}

}

return(

<div className="space-y-8">

<h1
className="
text-5xl
font-bold
"
>

Dashboard

</h1>

<div
className="
grid
md:grid-cols-3
gap-6
"
>

<div
className="
bg-white
p-8
rounded-3xl
shadow
"
>

<h2>

Total Vendors

</h2>

<p
className="
text-blue-600
text-5xl
font-bold
mt-4
"
>

{vendorCount}

</p>

</div>

<div
className="
bg-white
p-8
rounded-3xl
shadow
"
>

<h2>

Orders

</h2>

<p
className="
text-green-600
text-5xl
font-bold
mt-4
"
>

{orderCount}

</p>

</div>

<div
className="
bg-white
p-8
rounded-3xl
shadow
"
>

<h2>

Users

</h2>

<p
className="
text-purple-600
text-5xl
font-bold
mt-4
"
>

{userCount}

</p>

</div>

</div>

<div
className="
bg-white
rounded-3xl
shadow
overflow-hidden
"
>

<img
src="https://images.unsplash.com/photo-1552664730-d307ca884978"
alt="dashboard"
className="
w-full
h-[450px]
object-cover
"
/>

<div className="p-8">

<h2
className="
text-3xl
font-bold
"
>

Vendor CRM System

</h2>

<p
className="
mt-4
text-gray-600
"
>

Manage vendors, orders and users.

</p>

</div>

</div>

</div>

)

}