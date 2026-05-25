import React,{useState} from 'react'

import{
fetchVendors,
fetchOrders
}
from '../api'

export default function Reports(){

const[
vendorId,
setVendorId
]=useState('')

const[
orderId,
setOrderId
]=useState('')

const[
vendor,
setVendor
]=useState(null)

const[
order,
setOrder
]=useState(null)

const[
vendorNotFound,
setVendorNotFound
]=useState(false)

const[
orderNotFound,
setOrderNotFound
]=useState(false)



async function searchVendor(){

const rows=
await fetchVendors()

const found=

rows.find(
v=>
v.vendor_id
.toLowerCase()
===
vendorId
.toLowerCase()
)

setVendor(
found||null
)

setVendorNotFound(
!found
)

}



async function searchOrder(){

const rows=
await fetchOrders()

const found=

rows.find(
o=>
o.order_id
.toLowerCase()
===
orderId
.toLowerCase()
)

setOrder(
found||null
)

setOrderNotFound(
!found
)

}



async function exportData(){

const vendors=
await fetchVendors()

const orders=
await fetchOrders()

let csv=[]


csv.push([

'Vendor ID',
'Name',
'Email',
'Contact',
'Location',
'Type',
'Status'

])


vendors.forEach(v=>{

csv.push([

v.vendor_id,

v.name,

v.email,

`="${v.contact}"`,

v.location,

v.vendor_type,

Number(
v.is_active
)===1

?

'Active'

:

'Inactive'

])

})


csv.push([])


csv.push([

'Order ID',
'Vendor',
'Type',
'Quantity',
'Amount',
'Status'

])


orders.forEach(o=>{

csv.push([

o.order_id,

o.vendor_name,

o.order_type,

o.quantity,

o.amount,

o.status

])

})


const csvContent=

csv

.map(
row=>

row

.map(
cell=>

`"${cell}"`
)

.join(',')

)

.join('\n')


const blob=

new Blob(

[
csvContent
],

{

type:
'text/csv;charset=utf-8;'

}

)

const url=

URL

.createObjectURL(
blob
)

const link=

document

.createElement(
'a'
)

link.href=
url

link.download=

'Vendor_Report.csv'

link.click()

URL.revokeObjectURL(
url
)

}



return(

<div className="space-y-8">

<h1
className="
text-5xl
font-bold
"
>

Reports

</h1>



<div className="bg-white p-8 rounded-3xl shadow">

<h2 className="text-3xl font-bold mb-5">

Search Vendor

</h2>

<div className="flex gap-5">

<input

placeholder="Vendor ID"

value={vendorId}

onChange={e=>
setVendorId(
e.target.value
)
}

className="
border
p-4
rounded-xl
flex-1
"
/>

<button

onClick={
searchVendor
}

className="
bg-blue-600
text-white
px-10
rounded-xl
"

>

Search

</button>

</div>


{

vendorNotFound&&(

<p
className="
text-red-600
text-xl
mt-6
"
>

Vendor Not Found

</p>

)

}



{

vendor&&(

<div className="mt-8">

<table
className="
w-full
table-fixed
text-center
"
>

<thead>

<tr
className="
border-b
h-20
"
>

<th>Name</th>

<th>Email</th>

<th>Contact</th>

<th>Location</th>

<th>Type</th>

<th>Status</th>

</tr>

</thead>

<tbody>

<tr
className="
border-b
h-28
"
>

<td>{vendor.name}</td>

<td
className="
break-words
"
>

{vendor.email}

</td>

<td>{vendor.contact}</td>

<td>{vendor.location}</td>

<td>{vendor.vendor_type}</td>

<td>

{

Number(
vendor.is_active
)

===1

?

<span
className="
text-green-600
font-bold
"
>

🟢 Active

</span>

:

<span
className="
text-red-600
font-bold
"
>

🔴 Inactive

</span>

}

</td>

</tr>

</tbody>

</table>

</div>

)

}

</div>




<div className="bg-white p-8 rounded-3xl shadow">

<h2 className="text-3xl font-bold mb-5">

Search Order

</h2>

<div className="flex gap-5">

<input

placeholder="Order ID"

value={orderId}

onChange={e=>
setOrderId(
e.target.value
)
}

className="
border
p-4
rounded-xl
flex-1
"
/>

<button

onClick={
searchOrder
}

className="
bg-green-600
text-white
px-10
rounded-xl
"

>

Search

</button>

</div>


{

orderNotFound&&(

<p
className="
text-red-600
text-xl
mt-6
"
>

Order Not Found

</p>

)

}



{

order&&(

<div className="mt-8">

<table
className="
w-full
table-fixed
text-center
"
>

<thead>

<tr
className="
border-b
h-20
"
>

<th>

Order ID

</th>

<th>

Vendor

</th>

<th>

Type

</th>

<th>

Qty

</th>

<th>

Amount

</th>

<th>

Status

</th>

</tr>

</thead>

<tbody>

<tr
className="
border-b
h-28
"
>

<td>{order.order_id}</td>

<td>{order.vendor_name}</td>

<td>{order.order_type}</td>

<td>{order.quantity}</td>

<td>{order.amount}</td>

<td>

{

order.status===

'active'

?

<span
className="
text-green-600
font-bold
"
>

🟢 Active

</span>

:

<span
className="
text-red-600
font-bold
"
>

🔴 Inactive

</span>

}

</td>

</tr>

</tbody>

</table>

</div>

)

}

</div>




<div className="bg-white p-8 rounded-3xl shadow">

<h2
className="
text-3xl
font-bold
mb-5
"
>

Export

</h2>

<button

onClick={
exportData
}

className="
bg-orange-600
text-white
px-10
py-4
rounded-xl
"

>

Export Data

</button>

</div>

</div>

)

}