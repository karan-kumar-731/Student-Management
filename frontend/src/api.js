const API_BASE = import.meta.env.VITE_API_URL || '/api'

async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) }
  if (options.body !== undefined && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong')
  }

  return data
}

export function fetchStudents() {
  return request('/get/students')
}

export function fetchStudentById(id) {
  return request(`/student/${id}`)
}

export function createStudent(student) {
  return request('/student', {
    method: 'POST',
    body: JSON.stringify(student)
  })
}

export function updateStudent(id, student) {
  return request(`/update/student/${id}`, {
    method: 'PUT',
    body: JSON.stringify(student)
  })
}

export function deleteStudent(id) {
  return request(`/delete/student/${id}`, {
    method: 'DELETE'
  })
}

export function normalizeStudent(student) {
  return {
    id: student.id ?? student.ID ?? null,
    name: student.name ?? student.Name ?? '',
    email: student.email ?? student.Email ?? '',
    age: student.age ?? student.Age ?? ''
  }
}
