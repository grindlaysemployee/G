
const apiUrl = "https://script.google.com/macros/s/AKfycbwGn3vhTAKP1_CWn4eIAOCj_VW-Ip9vW5js0zX04V88Fn56m7AeowSR3CXt9Buoy6A/exec"; // 🔁 Replace with your deployed Apps Script URL
let currentEmployeeData = {};

function login() {
  const empId = document.getElementById("empId").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMessage = document.getElementById("error-message");

  if (!empId || !password) {
    errorMessage.textContent = "Please enter both Employee ID and Password.";
    return;
  }

  errorMessage.textContent = "Logging in...";

  fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `empId=${empId}&password=${password}`,
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        currentEmployeeData = data;
        showDashboard(data);
      } else {
        errorMessage.textContent = "Invalid login. Please try again.";
      }
    })
    .catch(err => {
      console.error(err);
      errorMessage.textContent = "Something went wrong!";
    });
}

function showDashboard(data) {
  document.getElementById("login-box").style.display = "none";
  document.getElementById("dashboard").style.display = "flex";

  document.getElementById("welcome-text").textContent = `Welcome, ${data.Name || ""}`;
  document.getElementById("employee-img").src = `image/${data['Emp Code']}.png`;

  const basicFields = ["Employee ID", "Emp Code", "Designation", "Status"];
  const basicList = document.getElementById("basic-details");
  basicList.innerHTML = "";
  basicFields.forEach(field => {
    const key = field.replace(" ", "");
    const li = document.createElement("li");
    li.textContent = `${field}: ${data[field] || ""}`;
    basicList.appendChild(li);
  });

  const exclude = ["Name", "Emp Code", "Employee ID", "Designation", "Status", "LeaveApplyURL", "LeaveStatusURL"];
  const otherList = document.getElementById("other-details");
  otherList.innerHTML = "";
  for (let key in data) {
    if (!exclude.includes(key)) {
      const li = document.createElement("li");
      li.textContent = `${key}: ${data[key]}`;
      otherList.appendChild(li);
    }
  }
}

function logout() {
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("login-box").style.display = "block";
  document.getElementById("empId").value = "";
  document.getElementById("password").value = "";
  document.getElementById("error-message").textContent = "";
}
