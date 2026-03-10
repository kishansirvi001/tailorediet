import { useState, useEffect } from 'react';

export default function App() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    goal: '',
    preferences: ''
  });
  const [submissions, setSubmissions] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchSubmissions = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/user-input');
      const data = await res.json();
      setSubmissions(data);
    } catch (err) {
      console.error('Error fetching submissions:', err);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.goal) {
      alert('Please fill in all required fields!');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/user-input', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      alert(data.message || 'Submitted!');
      setForm({ name: '', email: '', goal: '', preferences: '' });
      fetchSubmissions();
    } catch (err) {
      console.error(err);
      alert('Error submitting data!');
    }
  };

  return (
    <div>
      <h1>TailorDiet</h1>

      <h2>User Input</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          type="email"
          required
        />
        <input
          name="goal"
          placeholder="Goal (weight loss, muscle gain)"
          value={form.goal}
          onChange={handleChange}
          required
        />
        <input
          name="preferences"
          placeholder="Diet Preferences"
          value={form.preferences}
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
      </form>

      <h2>Admin View</h2>
      <ul>
        {submissions.map(u => (
          <li key={u.id}>
            {u.name} | {u.email} | {u.goal} | {u.preferences}
          </li>
        ))}
      </ul>
    </div>
  );
}