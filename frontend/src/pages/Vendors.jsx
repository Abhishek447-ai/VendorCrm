import React,{useEffect,useState} from 'react'

import{
fetchVendors,
createVendor,
updateVendor,
deleteVendor,
getRole
}
from '../api'

const empty={

vendor_id:'',
name:'',
email:'',
contact:'',
location:'',
vendor_type:'',
description:'',
is_active:0

}

export default function Vendors(){

const role=getRole()

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

const data=
await fetchVendors()

setVendors(data)

}

catch(err){

console.log(err)

}

}

async function handleSubmit(e){

e.preventDefault()

if(

!editing &&

vendors.some(
v=>
v.vendor_id===form.vendor_id
)

){

alert('Vendor ID already exists')

return

}

if(

!/^[^\s@]+@[^\s@]+\.[^\s@]+$/
.test(form.email)

){

alert('Enter valid email')

return

}

if(
form.contact.length!==10
){

alert('Phone must be 10 digits')

return

}

try{

const payload={

...form,

is_active:
form.is_active
?1
:0

}

if(editing){

await updateVendor(
form.vendor_id,
payload
)

setMsg(
'Vendor Updated ✅'
)

}

else{

await createVendor(
payload
)

setMsg(
'Vendor Created ✅'
)

}

setTimeout(()=>{

setMsg('')

},3000)

setForm(
empty
)

setEditing(false)

load()

}

catch(err){

alert(err.message)

}

}

async function remove(id){

if(
!window.confirm(
'Delete Vendor?'
)
)
return

await deleteVendor(id)

setMsg(
'Vendor Deleted ✅'
)

setTimeout(()=>{

setMsg('')

},3000)

load()

}

function edit(v){

setForm({

vendor_id:
v.vendor_id,

name:
v.name,

email:
v.email,

contact:
v.contact,

location:
v.location,

vendor_type:
v.vendor_type,

description:
v.description,

is_active:
Number(v.is_active)===1

})

setEditing(true)

window.scrollTo({

top:0,

behavior:'smooth'

})

}

return(

<div className="space-y-10">

{
(

<div className="bg-white rounded-3xl shadow p-8">

{

msg && (

<div
className="
mb-6
bg-green-100
text-green-700
p-4
rounded-xl
font-semibold
"
>

{msg}

</div>

)

}

<h1 className="text-5xl font-bold mb-8">

Vendors

</h1>

<form
onSubmit={handleSubmit}
autoComplete="off"
className="
grid
grid-cols-2
gap-4
"
>

<input

type="text"

placeholder="Vendor ID"

autoComplete="off"

name="vendor_unique"

disabled={editing}

value={form.vendor_id}

onChange={e=>

setForm({

...form,

vendor_id:
e.target.value

})

}

className="
border
p-4
rounded
"

required

/>

<input
name="vendor_name_new"
autoComplete="off"
placeholder="Vendors name"
value={form.name}
onChange={e=>

setForm({

...form,

name:
e.target.value

})

}
className="border p-4 rounded"
required
/>

<input
type="email"
name="vendor_email_new"
autoComplete="new-password"
placeholder="Email"
value={form.email}
onChange={e=>

setForm({

...form,

email:
e.target.value

})

}
className="border p-4 rounded"
required
/>

<input
type="tel"
name="vendor_phone_new"
autoComplete="off"
placeholder="Phone no."
maxLength={10}
value={form.contact}
onChange={e=>{

const value=

e.target.value.replace(
/\D/g,
''
)

setForm({

...form,

contact:value

})

}}
className="border p-4 rounded"
required
/>

<input
name="vendor_location_new"
autoComplete="off"
placeholder="Location"
value={form.location}
onChange={e=>

setForm({

...form,

location:
e.target.value

})

}
className="border p-4 rounded"
/>

<input
name="vendor_type_new"
autoComplete="off"
placeholder="Vendors type"
value={form.vendor_type}
onChange={e=>

setForm({

...form,

vendor_type:
e.target.value

})

}
className="border p-4 rounded"
/>

<input
name="vendor_description_new"
autoComplete="off"
placeholder="Description"
value={form.description}
onChange={e=>

setForm({

...form,

description:
e.target.value

})

}
className="border p-4 rounded"
/>

<label
className="
flex
items-center
gap-4
text-lg
font-medium
mt-2
"
>

<input
type="checkbox"

checked={
Boolean(
form.is_active
)
}

onChange={e=>

setForm({

...form,

is_active:

e.target.checked

?

1

:

0

})

}

className="
w-6
h-6
accent-green-600
cursor-pointer
"
/>

<span
className="select-none"
>

Active Vendor

</span>

</label>
<button
className="
bg-slate-900
text-white
rounded
p-4
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

</div>

)

}

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

Created Vendors

</h2>

<table
className="
w-full
text-center
"
>

<thead>

<tr>

<th>Vendor ID</th>
<th>Name</th>
<th>Email</th>
<th>Contact</th>
<th>Location</th>
<th>Type</th>
<th>Status</th>
<th>Action</th>

</tr>

</thead>

<tbody>

{

vendors.map(v=>(

<tr
key={v.vendor_id}
className="
h-24
border-t
"
>

<td>{v.vendor_id}</td>

<td>{v.name}</td>

<td>{v.email}</td>

<td>{v.contact}</td>

<td>{v.location}</td>

<td>{v.vendor_type}</td>

<td>

{

Number(
v.is_active
)

===1

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

onClick={()=>{
edit(v)
}}

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
remove(v.vendor_id)
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