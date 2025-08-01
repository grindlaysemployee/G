const detailsApiUrl = 'https://script.google.com/macros/s/AKfycbxvfLk2oYUz-SbiNO6yRcUQ5ldYqFRz8C6nOD6El5A/dev'; // Replace with your actual
const leaveStatusApiUrl = 'https://script.google.com/macros/s/AKfycbz4D0c1dL0syj_pTI_vWYmLaKnzDwfgE4MfaPv5bVkf9FGN4oA/exec';
const attendanceApiUrl = 'https://script.google.com/macros/s/AKfycbxxIX6YIb7Q5t0VGKXOGXQ_7rG0Td-5q6iai0brnQpcmqfQ8Rfu7DHBkiKL7SsdUZM/exec';

let currentEmpId = '';
let employeeData = {};

function login() {
  const empId = document.getElementById("empId").value.trim();
  const password = document.getElementById("password").value.trim();
  if (!empId || !password) return alert("Please enter both Employee ID and Password.");

  document.getElementById("loginSection").classList.add("hidden");
  document.getElementById("loadingSpinner").classList.remove("hidden");

  fetch(`${detailsApiUrl}?empid=${empId}`)
    .then(res => res.json())
    .then(data => {
      const employee = data.find(emp => emp["Emp Code"] === empId && emp["Password"] === password);
      if (!employee) throw new Error("Invalid login");

      currentEmpId = empId;
      employeeData = employee;

      document.getElementById("empName").textContent = employee["Name"] || "";
      const ul = document.getElementById("detailsList");
      ul.innerHTML = "";

      Object.entries(employee).forEach(([key, value]) => {
        if (!["Password", "Image"].includes(key)) {
          const li = document.createElement("li");
          li.innerHTML = `<strong>${key}:</strong> ${value}`;
          ul.appendChild(li);
        }
      });

      const imagePath = `image/${empId}.jpg`;
      document.getElementById("employeeImage").src = imagePath;

      document.getElementById("loadingSpinner").classList.add("hidden");
      document.getElementById("employeeDetails").classList.remove("hidden");
    })
    .catch(err => {
      console.error(err);
      alert("Invalid Employee ID or Password.");
      document.getElementById("loadingSpinner").classList.add("hidden");
      document.getElementById("loginSection").classList.remove("hidden");
    });
}

function logout() {
  location.reload();
}

function openLeaveStatus() {
  if (!currentEmpId) return;

  document.getElementById("leaveStatusSection").innerHTML = "<p>Loading...</p>";
  document.getElementById("leaveStatusSection").classList.remove("hidden");

  fetch(`${leaveStatusApiUrl}?empid=${currentEmpId}`)
    .then(res => res.json())
    .then(data => {
      renderLeaveStatusTable(data);
    })
    .catch(error => {
      console.error(error);
      document.getElementById("leaveStatusSection").innerHTML = "<p>Something went wrong while fetching leave status.</p>";
    });
}

function renderLeaveStatusTable(data) {
  if (!Array.isArray(data) || data.length === 0) {
    document.getElementById("leaveStatusSection").innerHTML = "<p>No leave data available.</p>";
    return;
  }

  const headers = Object.keys(data[0]);
  let html = "<table><thead><tr>" + headers.map(h => `<th>${h}</th>`).join("") + "</tr></thead><tbody>";
  data.forEach(row => {
    html += "<tr>" + headers.map(h => `<td>${formatDate(row[h])}</td>`).join("") + "</tr>";
  });
  html += "</tbody></table>";
  document.getElementById("leaveStatusSection").innerHTML = html;
}

function openAttendance() {
  if (!currentEmpId) return;

  document.getElementById("attendanceSection").innerHTML = "<p>Loading attendance...</p>";
  document.getElementById("attendanceSection").classList.remove("hidden");

  fetch(`${attendanceApiUrl}?empid=${currentEmpId}`)
    .then(res => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    })
    .then(data => {
      renderAttendanceTable(data);
    })
    .catch(error => {
      console.error("Error fetching attendance:", error);
      document.getElementById("attendanceSection").innerHTML = "<p>Something went wrong while fetching attendance data.</p>";
    });
}

function renderAttendanceTable(data) {
  if (!Array.isArray(data) || data.length === 0) {
    document.getElementById("attendanceSection").innerHTML = "<p>No attendance data available.</p>";
    return;
  }

  const headers = Object.keys(data[0]);
  let html = "<table><thead><tr>" + headers.map(h => `<th>${h}</th>`).join("") + "</tr></thead><tbody>";
  data.forEach(row => {
    html += "<tr>" + headers.map(h => {
      if (h.toLowerCase().includes("in time") || h.toLowerCase().includes("out time")) {
        return `<td>${formatTime(row[h])}</td>`;
      }
      return `<td>${row[h] || ""}</td>`;
    }).join("") + "</tr>";
  });
  html += "</tbody></table>";
  document.getElementById("attendanceSection").innerHTML = html;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr;
  return date.toLocaleDateString("en-GB"); // DD/MM/YYYY
}

function formatTime(timeStr) {
  if (!timeStr) return "";
  const date = new Date(timeStr);
  if (isNaN(date)) return timeStr;
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}
