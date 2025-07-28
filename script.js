async function login() {
  const empid = document.getElementById("empid").value;
  const password = document.getElementById("password").value;

  const apiUrl = `https://script.google.com/macros/s/AKfycbwYourScriptIDHere/exec?empid=${empid}&password=${password}`;


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
    document.getElementById("error").innerText = "API error.";
  }
}
