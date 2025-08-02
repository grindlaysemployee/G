const detailsApiUrl = "https://script.google.com/macros/s/AKfycbwGn3vhTAKP1_CWn4eIAOCj_VW-Ip9vW5js0zX04V88Fn56m7AeowSR3CXt9Buoy6A/exec";
const leaveStatusApiUrl = "https://script.google.com/macros/s/AKfycbyz7o1gD3Ddp5sjUYiYIpjSAYNcEO0e6xZgq0eRD-6EWTtZFrAVi6oS8BdCn3Y1XJ2W/exec";
const attendanceApiUrl = "https://script.google.com/macros/s/AKfycby-cVvSEUgI8JYlFZP58fvxI-NzM8Ku-xosWjoJCRvY2fAtV_GIElxAZ1GnvGz7d0eU/exec";
const totalAttendanceApiUrl = "https://script.google.com/macros/s/AKfycbzs2Z8Pdt34Hbh1-mdBMYdT41PtH9UeI4MGNcmo67nPPUOkMRFGLOCi1J-F_2k3dzbh/exec";

let empIdGlobal = "";

function login() {
  const empId = document.getElementById("empId").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!empId || !password) {
    alert("Please enter both Employee ID and Password.");
    return;
  }

  document.getElementById("spinner").classList.remove("hidden");

  fetch(detailsApiUrl, {
    method: "POST",
    body: JSON.stringify({ empId, password }),
    headers: { "Content-Type": "application/json" }
  })
    .then(response => response.json())
    .then(data => {
      document.getElementById("spinner").classList.add("hidden");

      if (!data.success) {
        alert("Invalid Employee ID or Password.");
        return;
      }

      empIdGlobal = empId;

      document.getElementById("loginSection").classList.add("hidden");
      document.getElementById("dashboard").classList.remove("hidden");

      const detailsList = document.getElementById("detailsList");
      detailsList.innerHTML = "";
      data.details.forEach(detail => {
        const li = document.createElement("li");
        li.textContent = detail;
        detailsList.appendChild(li);
      });

      const employeeImg = document.getElementById("employeeImg");
      employeeImg.src = `image/${empId}.png`;

      const welcomeText = document.getElementById("welcomeText");
      welcomeText.textContent = `Welcome, ${empId}`;
    })
    .catch(error => {
      document.getElementById("spinner").classList.add("hidden");
      console.error("Error during login:", error);
      alert("Something went wrong. Please try again.");
    });
}

function logout() {
  empIdGlobal = "";
  document.getElementById("loginSection").classList.remove("hidden");
  document.getElementById("dashboard").classList.add("hidden");
  document.getElementById("attendanceSection").classList.add("hidden");
}

function openLeaveStatus() {
  if (!empIdGlobal) return alert("Please login again.");

  document.getElementById("leaveStatusSection").innerHTML = `<div id="leaveStatusLoading">......LOADING......</div>`;
  document.getElementById("leaveStatusSection").classList.remove("hidden");
  document.getElementById("employeeDetails").classList.add("hidden");

  fetch(`${leaveStatusApiUrl}?empid=${empIdGlobal}`)
    .then(res => res.json())
    .then(data => renderLeaveStatusTable(data))
    .catch(err => {
      console.error("Leave Status Error:", err);
      document.getElementById("leaveStatusSection").innerHTML = "<p>Error loading leave status.</p>";
    });
}

function renderLeaveStatusTable(data) {
  let html = `<div class="leave-table-container">
    <button id="closeLeaveStatus" onclick="closeLeaveStatus()">Close</button>
    <div class="leave-table-caption">Leave Status</div>
    <input type="text" id="leaveTableFilter" placeholder="Search/filter leave...">
    <table class="leave-table" id="leaveTable">
      <thead>
        <tr>
          <th>Date</th>
          <th>Leave Type</th>
          <th>Status</th>
          <th>Reason</th>
        </tr>
      </thead>
      <tbody>
        ${data.map(row => `
          <tr>
            <td>${row.date}</td>
            <td>${row.type}</td>
            <td>${row.status}</td>
            <td>${row.reason}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  </div>`;

  document.getElementById("leaveStatusSection").innerHTML = html;

  document.getElementById("leaveTableFilter").addEventListener("input", function () {
    const filter = this.value.toLowerCase();
    document.querySelectorAll("#leaveTable tbody tr").forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(filter) ? "" : "none";
    });
  });
}

function closeLeaveStatus() {
  document.getElementById("leaveStatusSection").classList.add("hidden");
  document.getElementById("employeeDetails").classList.remove("hidden");
}

function openAttendance() {
  if (!empIdGlobal) return alert("Please login again.");

  document.getElementById("attendanceSection").innerHTML = `<div id="attendanceLoading">......LOADING......</div>`;
  document.getElementById("attendanceSection").classList.remove("hidden");
  document.getElementById("employeeDetails").classList.add("hidden");

  fetch(`${attendanceApiUrl}?empid=${empIdGlobal}`)
    .then(res => res.json())
    .then(data => renderAttendanceTable(data))
    .catch(err => {
      console.error("Attendance Error:", err);
      document.getElementById("attendanceSection").innerHTML = "<p>Error loading attendance.</p>";
    });
}

function renderAttendanceTable(data) {
  let html = `<div class="leave-table-container">
    <button id="closeAttendance" onclick="closeAttendance()">Close</button>
    <div class="leave-table-caption">Current Month Attendance</div>
    <input type="text" id="attendanceTableFilter" placeholder="Search date/time...">
    <table class="leave-table" id="attendanceTable">
      <thead>
        <tr>
          <th>Date</th>
          <th>In Time</th>
          <th>Out Time</th>
        </tr>
      </thead>
      <tbody>
        ${data.map(row => `
          <tr>
            <td>${row.date}</td>
            <td>${formatTime(row.inTime)}</td>
            <td>${formatTime(row.outTime)}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  </div>`;

  document.getElementById("attendanceSection").innerHTML = html;

  document.getElementById("attendanceTableFilter").addEventListener("input", function () {
    const filter = this.value.toLowerCase();
    document.querySelectorAll("#attendanceTable tbody tr").forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(filter) ? "" : "none";
    });
  });
}

function openTotalAttendance() {
  if (!empIdGlobal) return alert("Please login again.");

  document.getElementById("attendanceSection").innerHTML = `<div id="attendanceLoading">......LOADING......</div>`;
  document.getElementById("attendanceSection").classList.remove("hidden");
  document.getElementById("employeeDetails").classList.add("hidden");

  fetch(`${totalAttendanceApiUrl}?empid=${empIdGlobal}`)
    .then(res => res.json())
    .then(data => renderTotalAttendanceTable(data))
    .catch(err => {
      console.error("Total Attendance Error:", err);
      document.getElementById("attendanceSection").innerHTML = "<p>Error loading total attendance.</p>";
    });
}

function renderTotalAttendanceTable(data) {
  let html = `<div class="leave-table-container">
    <button id="closeAttendance" onclick="closeAttendance()">Close</button>
    <div class="leave-table-caption">Total Attendance Summary</div>
    <input type="text" id="attendanceTableFilter" placeholder="Search month...">
    <table class="leave-table" id="attendanceTable">
      <thead>
        <tr>
          <th>Month</th>
          <th>Total Days</th>
          <th>Present</th>
          <th>Absent</th>
          <th>Leaves</th>
        </tr>
      </thead>
      <tbody>
        ${data.map(row => `
          <tr>
            <td>${row.month}</td>
            <td>${row.totalDays}</td>
            <td>${row.present}</td>
            <td>${row.absent}</td>
            <td>${row.leaves}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  </div>`;

  document.getElementById("attendanceSection").innerHTML = html;

  document.getElementById("attendanceTableFilter").addEventListener("input", function () {
    const filter = this.value.toLowerCase();
    document.querySelectorAll("#attendanceTable tbody tr").forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(filter) ? "" : "none";
    });
  });
}

function closeAttendance() {
  document.getElementById("attendanceSection").classList.add("hidden");
  document.getElementById("employeeDetails").classList.remove("hidden");
}

function formatTime(datetimeStr) {
  const date = new Date(datetimeStr);
  if (isNaN(date)) return datetimeStr;
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}
