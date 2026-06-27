import { useState, useEffect } from 'react'

function fetchUsers(search, signal) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = [
        { id: 1, name: 'Ivan', email: 'ivan@mail.com' },
        { id: 2, name: 'Anna', email: 'anna@mail.com' },
        { id: 3, name: 'John', email: 'john@mail.com' },
      ]

      const filtered = data.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase())
      )

      resolve(filtered)
    }, 500)
  })
}

export default function App() {
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!search) {
      setUsers([])
      return
    }

    const controller = new AbortController()

    const timer = setTimeout(() => {
      setLoading(true)

      fetchUsers(search, controller.signal)
        .then(data => {
          setUsers(data)
        })
        .catch(err => {
          if (err.name !== 'AbortError') {
            console.error(err)
          }
        })
        .finally(() => setLoading(false))
    }, 300)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [search])

  return (
    <div>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search user..."
      />

      {loading && <p>Loading...</p>}

      {!loading && users.length === 0 && search && (
        <p>Не найдено</p>
      )}

      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} — {user.email}
          </li>
        ))}
      </ul>
    </div>
  )
}