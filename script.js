let empIdGlobal = "";

const detailsApiUrl = "https://script.google.com/macros/s/AKfycbwGn3vhTAKP1_CWn4eIAOCj_VW-Ip9vW5js0zX04V88Fn56m7AeowSR3CXt9Buoy6A/exec";
const leaveStatusApiUrl = "https://script.google.com/macros/s/AKfycbzgIQeO71mZpmmXifTWkaZoCjd0gKtw_QrX3RWsvimvFkxdbAchPamTOdLxOSwfOpsG/exec";
const attendanceApiUrl = "https://script.google.com/macros/s/AKfycbxxIX6YIb7Q5t0VGKXOGXQ_7rG0Td-5q6iai0brnQpcmqfQ8Rfu7DHBkiKL7SsdUZM/exec";
const salarySlipApiUrl = "https://script.google.com/macros/s/AKfycbwkqDU3D3tYmIEA1Pe5kbmmkSlMvX1nsDBGR0taJ1a3hohqRB6pFge1CJMfx-3n_I5r/exec";

function login() {
  const empId = document.getElementById("empId").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!empId || !password) {
    alert("Please enter both Employee ID and Password.");
    return;
  }

  document.getElementById("loginSection").classList.add("hidden");
  document.getElementById("loadingSpinner").classList.remove("hidden");

  fetch(detailsApiUrl, {
    method: "POST",
    body: JSON.stringify({ empid: empId, password: password }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        empIdGlobal = empId;
        document.getElementById("loadingSpinner").classList.add("hidden");
        document.getElementById("employeeDetails").classList.remove("hidden");

        document.getElementById("empName").textContent = data.name;
        const detailsList = document.getElementById("detailsList");
        detailsList.innerHTML = "";

        const imagePath = `image/${empId}.jpg`;
        document.getElementById("employeeImage").src = imagePath;

        for (let key in data) {
          if (key !== "name") {
            const li = document.createElement("li");
            li.innerHTML = `<strong>${key}:</strong> ${data[key]}`;
            detailsList.appendChild(li);
          }
        }
      } else {
        throw new Error(data.message || "Login failed");
      }
    })
    .catch(err => {
      console.error("Login Error:", err);
      document.getElementById("loadingSpinner").classList.add("hidden");
      document.getElementById("loginSection").classList.remove("hidden");
      alert("Something went wrong during login. Please check your credentials or try again later.");
    });
}

function logout() {
  location.reload();
}

function openLeaveStatus() {
  document.getElementById("leaveStatusSection").innerHTML = "";
  fetch(`${leaveStatusApiUrl}?empid=${empIdGlobal}`)
    .then(res => res.json())
    .then(data => {
      const section = document.getElementById("leaveStatusSection");
      section.classList.remove("hidden");

      let html = `<h3>Leave Status <button onclick="closeSection('leaveStatusSection')">X</button></h3>`;
      html += `<table><tr>${Object.keys(data[0]).map(key => `<th>${key}</th>`).join("")}</tr>`;
      data.forEach(row => {
        html += `<tr>${Object.values(row).map(val => `<td>${val}</td>`).join("")}</tr>`;
      });
      html += `</table>`;
      section.innerHTML = html;
    })
    .catch(err => {
      console.error("Leave Status Error:", err);
      alert("Failed to fetch leave status.");
    });
}

function openAttendance() {
  document.getElementById("attendanceSection").innerHTML = "";
  fetch(`${attendanceApiUrl}?empid=${empIdGlobal}`)
    .then(res => res.json())
    .then(data => {
      const section = document.getElementById("attendanceSection");
      section.classList.remove("hidden");

      let html = `<h3>Attendance <button onclick="closeSection('attendanceSection')">X</button></h3>`;
      html += `<table><tr>${Object.keys(data[0]).map(key => `<th>${key}</th>`).join("")}</tr>`;
      data.forEach(row => {
        html += `<tr>${Object.values(row).map(val => `<td>${val}</td>`).join("")}</tr>`;
      });
      html += `</table>`;
      section.innerHTML = html;
    })
    .catch(err => {
      console.error("Attendance Error:", err);
      alert("Failed to fetch attendance.");
    });
}

function openSalarySlip() {
  document.getElementById("salarySection").innerHTML = "";
  fetch(`${salarySlipApiUrl}?empid=${empIdGlobal}`)
    .then(res => res.json())
    .then(data => {
      const section = document.getElementById("salarySection");
      section.classList.remove("hidden");

      if (!data || data.length === 0) {
        section.innerHTML = `<h3>Salary Slip <button onclick="closeSection('salarySection')">X</button></h3><p>No salary slip found.</p>`;
        return;
      }

      let html = `<h3>Salary Slip <button onclick="closeSection('salarySection')">X</button></h3>`;
      html += `<table><tr><th>Month</th><th>File</th></tr>`;
      data.forEach(row => {
        const month = row["Month Slip"] || row["Month"] || "Unknown";
        const fileUrl = row["File URL"] || row["URL"] || "#";
        html += `<tr><td>${month}</td><td><a href="${fileUrl}" target="_blank">View PDF</a></td></tr>`;
      });
      html += `</table>`;
      section.innerHTML = html;
    })
    .catch(err => {
      console.error("Salary Slip Error:", err);
      alert("Failed to fetch salary slip.");
    });
}

function closeSection(sectionId) {
  document.getElementById(sectionId).classList.add("hidden");
}
