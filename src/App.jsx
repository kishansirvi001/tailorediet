import { useState, useEffect } from 'react';
import axios from 'axios';

export default function UserForm() {
  const [form, setForm] = useState({ name: '', email: '', goal: '', preferences: '' });
  const [submissions, setSubmissions] = useState([]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/user-input', form);
    alert('Submitted!');
    setForm({ name: '', email: '', goal: '', preferences: '' });
    fetchSubmissions();
  };

  const fetchSubmissions = async () => {
    const res = await axios.get('http://localhost:5000/api/user-input');
    setSubmissions(res.data);
  };

  useEffect(() => { fetchSubmissions(); }, []);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="goal" placeholder="Goal" value={form.goal} onChange={handleChange} required />
        <input name="preferences" placeholder="Diet Preferences" value={form.preferences} onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>

      <h2>Admin View</h2>
      <ul>
        {submissions.map(u => (
          <li key={u.id}>{u.name} | {u.email} | {u.goal} | {u.preferences}</li>
        ))}
      </ul>
    </div>
  );
}