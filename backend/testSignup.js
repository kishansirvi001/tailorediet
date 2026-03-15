const testSignup = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@test.com", password: "123456" }),
    });
    const data = await response.json();
    console.log("Response:", data);
  } catch (err) {
    console.error("Error:", err);
  }
};

testSignup();