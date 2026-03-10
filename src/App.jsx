import './App.css';

export default function App() {
  return (
    <div className="container">
      <header>
        <h1>TailorDiet</h1>
        <p>Your personalized diet plan, tailored for you.</p>
        <a href="#get-started" className="btn">Get Started</a>
      </header>

      <section id="get-started">
        <h2>Why TailorDiet?</h2>
        <ul>
          <li>Custom diet plans for your goals</li>
          <li>Track your calories and meals</li>
          <li>Easy to use and free to start</li>
        </ul>
      </section>

      <footer>
        <p>&copy; 2026 TailorDiet. All rights reserved.</p>
      </footer>
    </div>
  );
}