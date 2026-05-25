const API_BASE =
  import.meta.env.VITE_API_BASE ||
  'http://localhost:5000/api'
// if backend uses another port, change 5000


export async function request(path, opts = {}) {

  const headers = {
    ...(opts.headers || {})
  }

  const token =
    localStorage.getItem('token')

  if (token) {
    headers['Authorization'] =
      'Bearer ' + token
  }

  headers['Content-Type'] =
    'application/json'

  const res =
    await fetch(
      API_BASE + path,
      {
        ...opts,
        headers
      }
    )

  const text =
    await res.text()

  let data = {}

  try {

    data =
      text
        ? JSON.parse(text)
        : {}

  } catch {

    throw new Error(
      text ||
      'Invalid server response'
    )

  }

  if (!res.ok) {

    throw new Error(
      data.error ||
      data.message ||
      'Request failed'
    )

  }

  return data
}



export function saveToken(token) {

  localStorage.setItem(
    'token',
    token
  )

}

export function getToken() {

  return localStorage.getItem(
    'token'
  )

}

export function logout() {

  localStorage.removeItem(
    'token'
  )

  localStorage.removeItem(
    'role'
  )

}

export function saveRole(role) {

  localStorage.setItem(
    'role',
    role
  )

}

export function getRole() {

  return localStorage.getItem(
    'role'
  )

}



export async function login(
  email,
  password
) {

  return request(
    '/auth/login',
    {
      method: 'POST',

      body:
        JSON.stringify({
          email,
          password
        })
    }
  )

}



export async function fetchVendors() {

  return request(
    '/vendors'
  )

}

export async function createVendor(v) {

  return request(
    '/vendors',
    {
      method: 'POST',

      body:
        JSON.stringify(v)
    }
  )

}

export async function updateVendor(
  id,
  v
) {

  return request(
    '/vendors/' + id,
    {
      method: 'PUT',

      body:
        JSON.stringify(v)
    }
  )

}

export async function deleteVendor(
  id
) {

  return request(
    '/vendors/' + id,
    {
      method: 'DELETE'
    }
  )

}



export async function fetchOrders() {

  return request(
    '/orders'
  )

}

export async function createOrder(o) {

  return request(
    '/orders',
    {
      method: 'POST',

      body:
        JSON.stringify(o)
    }
  )

}

export async function updateOrder(
  id,
  o
) {

  return request(
    '/orders/' + id,
    {
      method: 'PUT',

      body:
        JSON.stringify(o)
    }
  )

}

export async function deleteOrder(
  id
) {

  return request(
    '/orders/' + id,
    {
      method: 'DELETE'
    }
  )

}

export async function markDelivered(
  id,
  delivered
) {

  return request(
    '/orders/' +
    id +
    '/delivered',
    {
      method: 'POST',

      body:
        JSON.stringify({
          delivered
        })
    }
  )

}



export async function report(
  path
) {

  return request(
    '/reports/' +
    path
  )

}



function qs(
  obj = {}
) {

  const parts = []

  for (const k in obj) {

    if (
      obj[k] !== undefined &&
      obj[k] !== null
    ) {

      parts.push(
        encodeURIComponent(k)
        +
        '='
        +
        encodeURIComponent(obj[k])
      )

    }

  }

  return parts.length
    ? '?' + parts.join('&')
    : ''

}



export async function reportWithParams(
  path,
  params = {}
) {

  return request(
    '/reports/' +
    path +
    qs(params)
  )

}



export async function exportReport(
  type,
  params = {}
) {

  const token =
    localStorage.getItem(
      'token'
    )

  const headers = {}

  if (token) {

    headers[
      'Authorization'
    ] =
      'Bearer ' +
      token

  }

  const url =

    API_BASE

    +

    '/reports/export/'

    +

    encodeURIComponent(
      type
    )

    +

    qs(params)

  const res =

    await fetch(
      url,
      {
        headers
      }
    )

  if (!res.ok) {

    throw new Error(
      'Export failed'
    )

  }

  return await res.blob()

}
export async function fetchUsers(){

return request(
'/auth/users'
)

}