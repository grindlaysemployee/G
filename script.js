async function login() {
  const empid = document.getElementById("empid").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!empid || !password) {
    document.getElementById("error").innerText = "Please enter both ID and password.";
    return;
  }

  const apiUrl = `https://script.google.com/macros/s/AKfycbwHqEiiudOUcLFIw_IBizrfhacpWoqhNTqjBikac5YaTjhotypHY53Vb3J9-hYXSPaT/exec?empid=${encodeURIComponent(empid)}&password=${encodeURIComponent(password)}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.success) {
      localStorage.setItem("employee", JSON.stringify(data));
      window.location.href = "dashboard.html";
    } else {
      document.getElementById("error").innerText = data.message;
    }
  } catch (err) {
    console.error(err);  // Helpful for debugging
    document.getElementById("error").innerText = "API error. Please try again.";
  }
}
