import React,{useState} from 'react'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Vendors from './pages/Vendors'
import Orders from './pages/Orders'
import Reports from './pages/Reports'
import Users from './pages/Users'

export default function App(){

const[
page,
setPage
]=useState(
'login'
)

const role=
localStorage.getItem(
'role'
)

function navigate(p){

setPage(p)

}

function handleLogout(){

localStorage.clear()

setPage(
'login'
)

}

function NavButton({

title,
route

}){

return(

<button

onClick={()=>
navigate(
route
)
}

className="
px-5
py-3
rounded-2xl
text-white
font-medium
transition-all
duration-300
hover:bg-white/10
hover:text-cyan-300
hover:scale-105
"

>

{title}

</button>

)

}

return(

<div className="min-h-screen bg-slate-100">

{

page!=='login'

&&

(

<header
className="
sticky
top-0
z-50
bg-gradient-to-r
from-slate-950
via-slate-900
to-blue-950
shadow-xl
"
>

<div
className="
max-w-screen-2xl
mx-auto
px-8
h-20
flex
items-center
"
>

<div
className="
text-white
text-2xl
font-bold
mr-10
"
>

VendorCRM

</div>

<div
className="
flex
items-center
gap-2
w-full
"
>

<NavButton
title="Dashboard"
route="dashboard"
/>

<NavButton
title="Vendors"
route="vendors"
/>

<NavButton
title="Orders"
route="orders"
/>

<NavButton
title="Reports"
route="reports"
/>

{

role==='admin'

&&

<NavButton
title="Users"
route="users"
/>

}

<button

onClick={
handleLogout
}

className="
ml-auto
bg-red-500
hover:bg-red-600
text-white
font-semibold
px-6
py-3
rounded-2xl
transition-all
duration-300
hover:scale-105
shadow-lg
"

>

Logout

</button>

</div>

</div>

</header>

)

}

<main>

{

page==='login'

&&

<Login

onLogin={()=>

navigate(
'dashboard'
)

}

/>

}

{

page==='dashboard'

&&

<Dashboard/>

}

{

page==='vendors'

&&

<Vendors/>

}

{

page==='orders'

&&

<Orders/>

}

{

page==='reports'

&&

<Reports/>

}

{

page==='users'

&&

role==='admin'

&&

<Users/>

}

</main>

</div>

)

}