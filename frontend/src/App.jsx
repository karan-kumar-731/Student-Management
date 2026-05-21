import { useEffect, useState } from 'react'
import {
  createStudent,
  deleteStudent,
  fetchStudentById,
  fetchStudents,
  normalizeStudent,
  updateStudent
} from './api'

const emptyForm = {
  name: '',
  email: '',
  age: ''
}

function StudentList({ students, loading, error, message, onRefresh, onAdd, onEdit, onDelete }) {
  return (
    <section className="rounded-3xl border border-white/60 bg-white/85 p-6 shadow-glow backdrop-blur lg:p-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Students List</h2>
          <p className="text-sm text-slate-500">All students fetched from the backend API.</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onRefresh}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={onAdd}
            className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Add new student
          </button>
        </div>
      </div>

      {error ? (
        <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">
          {message}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center text-slate-500">
          Loading students...
        </div>
      ) : students.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center text-slate-500">
          No students added yet. Click Add new student to create the first record.
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200">
          <div className="hidden grid-cols-[1fr_1fr_0.5fr_0.8fr] bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-600 md:grid">
            <div>Name</div>
            <div>Email</div>
            <div>Age</div>
            <div className="text-right">Actions</div>
          </div>
          <div className="divide-y divide-slate-200 bg-white">
            {students.map((student) => (
              <div
                key={student.id}
                className="grid gap-4 px-5 py-4 md:grid-cols-[1fr_1fr_0.5fr_0.8fr] md:items-center"
              >
                <div>
                  <div className="text-sm font-semibold uppercase tracking-wide text-slate-400 md:hidden">
                    Name
                  </div>
                  <div className="font-semibold text-slate-900">{student.name}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold uppercase tracking-wide text-slate-400 md:hidden">
                    Email
                  </div>
                  <div className="text-slate-600">{student.email}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold uppercase tracking-wide text-slate-400 md:hidden">
                    Age
                  </div>
                  <div className="text-slate-600">{student.age === '' ? '-' : student.age}</div>
                </div>
                <div className="flex flex-wrap gap-2 md:justify-end">
                  <button
                    type="button"
                    onClick={() => onEdit(student.id)}
                    className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(student)}
                    className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

function StudentForm({
  editingId,
  form,
  formLoading,
  submitting,
  error,
  message,
  onChange,
  onSubmit,
  onBack,
  onReset
}) {
  return (
    <section className="rounded-3xl border border-white/60 bg-white/85 p-6 shadow-glow backdrop-blur lg:p-8">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">
            {editingId !== null ? 'Update Student' : 'Add Student'}
          </h2>
          <p className="text-sm text-slate-500">
            {editingId !== null ? 'Edit the selected student record.' : 'Create a new student record.'}
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
        >
          Back to list
        </button>
      </div>

      {error ? (
        <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">
          {message}
        </div>
      ) : null}

      {formLoading ? (
        <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center text-slate-500">
          Loading student details...
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          className="max-w-2xl rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm"
        >
          <div className="grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Name</span>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Enter student name"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-0 transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Email</span>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                placeholder="Enter email address"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-0 transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Age</span>
              <input
                name="age"
                type="number"
                min="1"
                value={form.age}
                onChange={onChange}
                placeholder="Enter age"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-0 transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              />
            </label>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? 'Saving...' : editingId !== null ? 'Update Student' : 'Add Student'}
            </button>
            <button
              type="button"
              onClick={onReset}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:border-slate-300"
            >
              Reset
            </button>
          </div>
        </form>
      )}
    </section>
  )
}

function App() {
  const [students, setStudents] = useState([])
  const [view, setView] = useState('list')
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formLoading, setFormLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const loadStudents = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await fetchStudents()
      const rows = Array.isArray(data.students) ? data.students : []
      setStudents(rows.map(normalizeStudent))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStudents()
  }, [])

  const openCreateForm = () => {
    setEditingId(null)
    setForm(emptyForm)
    setMessage('')
    setError('')
    setView('form')
  }

  const openEditForm = async (studentId) => {
    try {
      setFormLoading(true)
      setError('')
      setMessage('')
      setView('form')
      setEditingId(studentId)

      const data = await fetchStudentById(studentId)
      const student = normalizeStudent(data.student || {})
      setForm({
        name: student.name,
        email: student.email,
        age: student.age === '' ? '' : String(student.age)
      })
    } catch (err) {
      setError(err.message)
      setEditingId(null)
      setForm(emptyForm)
      setView('list')
    } finally {
      setFormLoading(false)
    }
  }

  const backToList = () => {
    setView('list')
    setEditingId(null)
    setForm(emptyForm)
    setError('')
    setMessage('')
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: value
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      setSubmitting(true)
      setError('')
      setMessage('')

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        age: Number(form.age)
      }

      if (!payload.name || !payload.email || Number.isNaN(payload.age)) {
        throw new Error('Please fill all fields correctly')
      }

      if (editingId !== null) {
        await updateStudent(editingId, payload)
        setMessage('Student updated successfully')
      } else {
        await createStudent(payload)
        setMessage('Student added successfully')
      }

      setForm(emptyForm)
      setEditingId(null)
      setView('list')
      await loadStudents()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (student) => {
    const confirmed = window.confirm(`Delete ${student.name}?`)
    if (!confirmed) return

    try {
      setError('')
      setMessage('')
      await deleteStudent(student.id)
      setMessage('Student deleted successfully')
      await loadStudents()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#e0f2fe_0,_#f8fafc_35%,_#f1f5f9_100%)] text-slate-900">
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-10 lg:px-8">
        <section className="overflow-hidden rounded-3xl border border-white/60 bg-white/85 shadow-glow backdrop-blur">
          <div className="grid gap-8 p-6 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
            <div className="space-y-5">
              <span className="inline-flex rounded-full bg-sky-100 px-4 py-1 text-sm font-semibold text-sky-700">
                Student CRUD Dashboard
              </span>
              <div className="space-y-3">
                <h1 className="max-w-2xl text-4xl font-black tracking-tight sm:text-5xl">
                  Manage students from one clean screen.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-600">
                  View every student, add new records, update existing details, and remove entries
                  with a simple flow powered by your Go API.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-sm">
                <div className="rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white">
                  {students.length} total students
                </div>
                <button
                  type="button"
                  onClick={view === 'list' ? openCreateForm : backToList}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
                >
                  {view === 'list' ? 'Add new student' : 'Back to list'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {view === 'list' ? (
          <StudentList
            students={students}
            loading={loading}
            error={error}
            message={message}
            onRefresh={loadStudents}
            onAdd={openCreateForm}
            onEdit={openEditForm}
            onDelete={handleDelete}
          />
        ) : (
          <StudentForm
            editingId={editingId}
            form={form}
            formLoading={formLoading}
            submitting={submitting}
            error={error}
            message={message}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onBack={backToList}
            onReset={() => setForm(emptyForm)}
          />
        )}
      </main>
    </div>
  )
}

export default App
