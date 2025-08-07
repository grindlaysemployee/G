let empIdGlobal = "";

const detailsApiUrl = "https://script.google.com/macros/s/AKfycbykq-pK1vSEb4L_7AZciR5rj_KK8yN2XUJPIz_mxOHk3GGxOv2p3ZjwPVE7qGfElTqH/exec";
const leaveStatusApiUrl = "https://script.google.com/macros/s/AKfycbyv3uwuEZqZqHgx3AucL-Y3vQmQMrNgYcMKYMX1ptlqkHuKM3FoW19eVj_V3m9_cbeE/exec";
const attendanceApiUrl = "https://script.google.com/macros/s/AKfycbzEbsFBklBCxO9lSB9OmHGAmAs5RRSU6LNeFX2j36pUvZ3o4CD0EEIqk0V8GoaD1FHp/exec";
const salarySlipApiUrl = "https://script.google.com/macros/s/AKfycbyZHP7qZH3hR70DkC9PQY9svO_l9XcrcbTNs6cvZ-BN4NSmsQXL61J8A1qGqtG2O03c/exec";

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
        throw new Error(data.message || "Login failed.");
      }
    })
    .catch(err => {
      console.error(err);
      document.getElementById("loadingSpinner").classList.add("hidden");
      document.getElementById("loginSection").classList.remove("hidden");
      alert("Something went wrong during login.");
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
    });
}

function openSalarySlip() {
  document.getElementById("salarySection").innerHTML = "";
  fetch(`${salarySlipApiUrl}?empid=${empIdGlobal}`)
    .then(res => res.json())
    .then(data => {
      const section = document.getElementById("salarySection");
      section.classList.remove("hidden");

      if (data.length === 0) {
        section.innerHTML = `<h3>Salary Slip <button onclick="closeSection('salarySection')">X</button></h3><p>No salary slip found.</p>`;
        return;
      }

      let html = `<h3>Salary Slip <button onclick="closeSection('salarySection')">X</button></h3>`;
      html += `<table><tr><th>Month</th><th>File</th></tr>`;
      data.forEach(row => {
        html += `<tr><td>${row["Month Slip"]}</td><td><a href="${row["File URL"]}" target="_blank">View PDF</a></td></tr>`;
      });
      html += `</table>`;
      section.innerHTML = html;
    });
}

function closeSection(sectionId) {
  document.getElementById(sectionId).classList.add("hidden");
}
