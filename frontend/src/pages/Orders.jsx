import React,{
useEffect,
useState
} from 'react'

import{
fetchOrders,
createOrder,
updateOrder,
deleteOrder,
fetchVendors
}
from '../api'

const empty={

order_id:'',
vendor_id:'',
vendor_name:'',
order_type:'',
quantity:'',
amount:'',
order_date:'',
delivery_date:'',
status:'inactive'

}

export default function Orders(){

const[
orders,
setOrders
]=useState([])

const[
vendors,
setVendors
]=useState([])

const[
form,
setForm
]=useState(empty)

const[
editing,
setEditing
]=useState(false)

const[
msg,
setMsg
]=useState('')

useEffect(()=>{

load()

},[])

async function load(){

try{

const orderData=
await fetchOrders()

const vendorData=
await fetchVendors()

setVendors(
vendorData
)

const updatedOrders=

orderData.map(o=>{

const vendor=

vendorData.find(
v=>
v.vendor_id===
o.vendor_id
)

return{

...o,

status:

vendor
&&
Number(
vendor.is_active
)===1

?

'active'

:

'inactive'

}

})

setOrders(
updatedOrders
)

}

catch(err){

alert(
err.message
)

}

}



async function handleSubmit(e){

e.preventDefault()
if(

!form.order_id||

!form.vendor_id||

!form.vendor_name||

!form.order_type||

!form.quantity||

!form.amount||

!form.order_date||

!form.delivery_date

){

alert(
'Fill all fields'
)

return

}

try{

if(editing){

await updateOrder(
form.order_id,
form
)

setMsg(
'Order Updated ✅'
)

}

else{

await createOrder(
form
)

setMsg(
'Order Created ✅'
)

}

setTimeout(()=>{

setMsg('')

},3000)

setForm(
empty
)

setEditing(
false
)

load()

}

catch(err){

alert(
err.message
)

}

}

async function remove(id){

try{

if(
!window.confirm(
'Delete Order?'
)
)
return

await deleteOrder(
id
)

setMsg(
'Order Deleted ✅'
)

setTimeout(()=>{

setMsg('')

},3000)

load()

}

catch(err){

alert(
err.message
)

}

}

function edit(o){

setForm(
o
)

setEditing(
true
)

window.scrollTo({

top:0,

behavior:'smooth'

})

}

return(

<div>

<h1
className="
text-4xl
font-bold
mb-8
"
>

Orders

</h1>

{

msg&&(

<p
className="
text-green-600
mb-4
"
>

{msg}

</p>

)

}

<form
onSubmit={
handleSubmit
}
className="
grid
grid-cols-2
gap-4
mb-8
"
>

<input
placeholder="Order ID"
value={form.order_id}
disabled={editing}
onChange={e=>

setForm({

...form,

order_id:
e.target.value

})

}
className="
border
p-3
rounded
"
/>

<select

value={form.vendor_id}

onChange={e=>{

const selected=

vendors.find(
v=>
v.vendor_id===
e.target.value
)

setForm({

...form,

vendor_id:
e.target.value,

vendor_name:

selected

?

selected.name

:

'',

status:

selected

&&

Number(
selected.is_active
)

===1

?

'active'

:

'inactive'

})

}}

className="
border
p-3
rounded
"

>

<option value="">

Select Vendor ID

</option>

{

vendors.map(v=>(

<option
key={
v.vendor_id
}
value={
v.vendor_id
}
>

{v.vendor_id}

</option>

))

}

</select>

<input
placeholder="Vendor Name"
value={form.vendor_name}
readOnly
className="
border
p-3
rounded
bg-gray-100
"
/>

<input
placeholder="Order Type"
value={form.order_type}
onChange={e=>

setForm({

...form,

order_type:
e.target.value

})

}
className="
border
p-3
rounded
"
/>

<input
placeholder="Quantity"
value={form.quantity}
onChange={e=>

setForm({

...form,

quantity:
e.target.value

})

}
className="
border
p-3
rounded
"
/>

<input
placeholder="Amount"
value={form.amount}
onChange={e=>

setForm({

...form,

amount:
e.target.value
.replace(
/\D/g,
'')

})

}
className="
border
p-3
rounded
"
/>

<div>

<label
className="
block
mb-2
"
>

Order Date

</label>

<input
type="date"
value={form.order_date}
onChange={e=>

setForm({

...form,

order_date:
e.target.value

})

}
className="
border
p-3
rounded
w-full
"
/>

</div>

<div>

<label
className="
block
mb-2
"
>

Delivery Date

</label>

<input
type="date"
min={
form.order_date
}
value={form.delivery_date}
onChange={e=>

setForm({

...form,

delivery_date:
e.target.value

})

}
className="
border
p-3
rounded
w-full
"
/>

</div>

<button
className="
bg-slate-900
text-white
rounded
p-3
col-span-2
"
>

{

editing

?

'Update'

:

'Create'

}

</button>

</form>


<div
className="
bg-white
rounded-3xl
shadow
p-8
"
>

<h2
className="
text-5xl
font-bold
mb-10
"
>

Created Orders

</h2>

<table
className="
w-full
text-center
"
>

<thead>

<tr>

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

<th>

Action

</th>

</tr>

</thead>

<tbody>

{

orders.map(o=>(

<tr
key={
o.order_id
}
className="
h-24
border-t
"
>

<td>{o.order_id}</td>

<td>{o.vendor_name}</td>

<td>{o.order_type}</td>

<td>{o.quantity}</td>

<td>{o.amount}</td>

<td>

{

o.status===

'active'

?

<span
className="
text-green-600
font-bold
"
>

Active

</span>

:

<span
className="
text-red-600
font-bold
"
>

Inactive

</span>

}

</td>

<td>

<div
className="
flex
justify-center
gap-3
"
>

<button
type="button"
onClick={()=>
edit(o)
}
className="
bg-blue-600
text-white
px-5
py-2
rounded
"
>

Edit

</button>

<button
type="button"
onClick={()=>
remove(
o.order_id
)
}
className="
bg-red-600
text-white
px-5
py-2
rounded
"
>

Delete

</button>

</div>

</td>

</tr>

))

}

</tbody>

</table>

</div>

</div>

)

}