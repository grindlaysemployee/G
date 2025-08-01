// Replace this with your actual backend URLs
const detailsApiUrl = "https://script.google.com/macros/s/AKfycbxNPaekEzY-BMy1RtD0DQTR3N73xZzKfJ7oK5FwytpJk99fZwJ_1mHvKOpYROoQkt7X2A/exec";
const leaveStatusApiUrl = "https://script.google.com/macros/s/AKfycbwNAv7BUBhIqqrMKPSaDuOmzSH2w9XcPT5xRj8WnZPRwUBFetMc5e4KsdJxvKQnktUE_w/exec";
const attendanceApiUrl = "https://script.google.com/macros/s/AKfycbz8efBJeB2JvGVfu7kSBP9q7JtRHtEYOWSldvyrdD3FYX-XENz3bK_VXzH5oBELE1Xw/exec";

function login() {
  const empId = document.getElementById("empId").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!empId || !password) {
    alert("Please enter both Employee ID and Password.");
    return;
  }

  document.getElementById("spinner").style.display = "block";

  fetch(`${detailsApiUrl}?empid=${empId}`)
    .then(response => response.json())
    .then(data => {
      document.getElementById("spinner").style.display = "none";
      const user = data.find(item => item.Emp_Code === empId && item.Password === password);
      if (user) {
        displayDashboard(user);
      } else {
        alert("Invalid ID or password");
      }
    })
    .catch(error => {
      document.getElementById("spinner").style.display = "none";
      alert("Something went wrong while logging in.");
      console.error(error);
    });
}

function displayDashboard(user) {
  document.getElementById("loginSection").style.display = "none";
  document.getElementById("dashboardSection").style.display = "block";

  document.getElementById("employeeName").textContent = user.Name || "";
  document.getElementById("employeeId").textContent = user.Emp_Code || "";
  document.getElementById("employeeDept").textContent = user.Department || "";

  const imagePath = `image/${user.Emp_Code}.png`;
  document.getElementById("employeeImage").src = imagePath;
  document.getElementById("employeeImage").alt = user.Name || "Employee Photo";
}

function logout() {
  document.getElementById("dashboardSection").style.display = "none";
  document.getElementById("loginSection").style.display = "block";
  document.getElementById("empId").value = "";
  document.getElementById("password").value = "";
  document.getElementById("leaveStatusSection").innerHTML = "";
  document.getElementById("attendanceSection").innerHTML = "";
}

function closeLeaveStatus() {
  document.getElementById("leaveStatusSection").innerHTML = "";
}

function closeAttendance() {
  document.getElementById("attendanceSection").innerHTML = "";
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr;
  return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${date.getFullYear()}`;
}

function formatTime(timeStr) {
  if (!timeStr) return "";
  const d = new Date(`1970-01-01T${timeStr}`);
  if (isNaN(d)) return timeStr;
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

function showLeaveStatus() {
  const empId = document.getElementById("employeeId").textContent;
  fetch(`${leaveStatusApiUrl}?empid=${empId}`)
    .then(response => response.json())
    .then(data => renderLeaveStatusTable(data))
    .catch(error => {
      alert("Something went wrong while fetching leave status.");
      console.error(error);
    });
}

function showAttendance() {
  const empId = document.getElementById("employeeId").textContent;
  fetch(`${attendanceApiUrl}?empid=${empId}`)
    .then(response => response.json())
    .then(data => renderAttendanceTable(data))
    .catch(error => {
      alert("Something went wrong while fetching attendance data.");
      console.error(error);
    });
}

function renderLeaveStatusTable(data) {
  const headers = Object.keys(data[0]);
  const startDateCol = headers.find(h => h.toLowerCase().includes("starting date"));
  const finishDateCol = headers.find(h => h.toLowerCase().includes("last date"));
  const timeKeywords = ["time", "punch"];

  let html = `<div class="leave-table-container">
    <button id="closeLeaveStatus" onclick="closeLeaveStatus()">Close</button>
    <div class="leave-table-caption">Leave Status : ${data[0][headers[0]] || ""}</div>
    <input type="text" id="leaveTableFilter" placeholder="Search/filter... (e.g. Jan, Approved, Full Day)">
    <table class="leave-table" id="leaveStatusTable">
      <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
      <tbody>
        ${data.map(row => `<tr>${headers.map(h => {
          const lowerHeader = h.toLowerCase();
          if (h === startDateCol || h === finishDateCol) return `<td>${formatDate(row[h])}</td>`;
          if (timeKeywords.some(k => lowerHeader.includes(k))) return `<td>${formatTime(row[h])}</td>`;
          return `<td>${row[h] || ""}</td>`;
        }).join('')}</tr>`).join('')}
      </tbody>
    </table>
  </div>`;

  document.getElementById("leaveStatusSection").innerHTML = html;

  document.getElementById("leaveTableFilter").addEventListener("input", function () {
    const filter = this.value.toLowerCase();
    const trs = document.getElementById("leaveStatusTable").getElementsByTagName("tr");
    for (let i = 1; i < trs.length; i++) {
      const rowText = trs[i].innerText.toLowerCase();
      trs[i].style.display = rowText.includes(filter) ? "" : "none";
    }
  });
}

function renderAttendanceTable(data) {
  const headers = Object.keys(data[0]);
  const dateCol = headers.find(h => h.toLowerCase().includes("date"));
  const timeKeywords = ["time", "punch"];

  let html = `<div class="leave-table-container">
    <button id="closeAttendance" onclick="closeAttendance()">Close</button>
    <div class="leave-table-caption">Attendance : ${data[0][headers[0]] || ""}</div>
    <input type="text" id="attendanceTableFilter" placeholder="Search/filter... (e.g. Present, Absent)">
    <table class="leave-table" id="attendanceTable">
      <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
      <tbody>
        ${data.map(row => `<tr>${headers.map(h => {
          const lowerHeader = h.toLowerCase();
          if (h === dateCol) return `<td>${formatDate(row[h])}</td>`;
          if (timeKeywords.some(k => lowerHeader.includes(k))) return `<td>${formatTime(row[h])}</td>`;
          return `<td>${row[h] || ""}</td>`;
        }).join('')}</tr>`).join('')}
      </tbody>
    </table>
  </div>`;

  document.getElementById("attendanceSection").innerHTML = html;

  document.getElementById("attendanceTableFilter").addEventListener("input", function () {
    const filter = this.value.toLowerCase();
    const trs = document.getElementById("attendanceTable").getElementsByTagName("tr");
    for (let i = 1; i < trs.length; i++) {
      const rowText = trs[i].innerText.toLowerCase();
      trs[i].style.display = rowText.includes(filter) ? "" : "none";
    }
  });
}
