const detailsApiUrl = "https://script.google.com/macros/s/AKfycbwGn3vhTAKP1_CWn4eIAOCj_VW-Ip9vW5js0zX04V88Fn56m7AeowSR3CXt9Buoy6A/exec";
const leaveStatusApiUrl = "https://script.google.com/macros/s/AKfycbzgIQeO71mZpmmXifTWkaZoCjd0gKtw_QrX3RWsvimvFkxdbAchPamTOdLxOSwfOpsG/exec";
const attendanceApiUrl = "https://script.google.com/macros/s/AKfycbxxIX6YIb7Q5t0VGKXOGXQ_7rG0Td-5q6iai0brnQpcmqfQ8Rfu7DHBkiKL7SsdUZM/exec";
const salaryslipApiUrl = "https://script.google.com/macros/s/AKfycbwkqDU3D3tYmIEA1Pe5kbmmkSlMvX1nsDBGR0taJ1a3hohqRB6pFge1CJMfx-3n_I5r/exec";
let empIdGlobal = "";
let leaveStatusURL = "";

// Hide all sections on initial page load
window.onload = function () {
  document.getElementById("employeeDetails").classList.add("hidden");
  document.getElementById("loadingSpinner").classList.add("hidden");
  document.getElementById("loginSection").classList.remove("hidden");
  document.getElementById("leaveStatusSection").classList.add("hidden");
};

function login() {
  const empId = document.getElementById("empId").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!empId || !password) {
    alert("Please enter Employee ID and Password");
    return;
  }

  document.getElementById("loginSection").classList.add("hidden");
  document.getElementById("loadingSpinner").classList.remove("hidden");

  const formData = new FormData();
  formData.append("empId", empId);
  formData.append("password", password);

  fetch(detailsApiUrl, {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      if (!data || !data.success) {
        alert("Invalid Employee ID or Password");
        document.getElementById("loadingSpinner").classList.add("hidden");
        document.getElementById("loginSection").classList.remove("hidden");
        return;
      }

      empIdGlobal = data.empId;
      document.getElementById("empName").textContent = data.name;

      const employeeImage = document.getElementById("employeeImage");
      employeeImage.src = `image/${data.empId}.jpg`;
      employeeImage.onerror = function () {
        this.src = "image/default.jpg";
      };

      const fields = {
        "Employee ID": data.empId,
        "Emp Code": data.empCode,
        "Designation": data.designation,
        "Father's Name": data.fatherName,
        "Gender": data.gender,
        "ESIC Number": data.esicNumber,
        "PF Number": data.pfNumber,
        "Date of Birth": data.dob,
        "Mobile": data.mobile,
        "Aadhar": data.aadhar,
        "ID Proof": data.idProof,
        "Permanent Address": data.permanentAddress,
        "Local Address": data.localAddress,
        "Joining Date": data.joiningDate,
        "Emergency Contact": data.emergencyContact,
        "Status": data.status
      };

      const detailsList = document.getElementById("detailsList");
      detailsList.innerHTML = "";

      for (let key in fields) {
        const li = document.createElement("li");
        li.textContent = `${key}: ${fields[key] || "N/A"}`;
        detailsList.appendChild(li);
      }

      document.getElementById("loadingSpinner").classList.add("hidden");
      document.getElementById("employeeDetails").classList.remove("hidden");
    })
    .catch(err => {
      console.error("Error:", err);
      alert("Something went wrong!");
      document.getElementById("loadingSpinner").classList.add("hidden");
      document.getElementById("loginSection").classList.remove("hidden");
    });
}

function openLeaveStatus() {
  if (!empIdGlobal) {
    alert("Employee ID not found. Please login again.");
    return;
  }

  document.getElementById("leaveStatusSection").innerHTML = `<div id="leaveStatusLoading">......LOADING......</div>`;
  document.getElementById("leaveStatusSection").classList.remove("hidden");
  document.getElementById("employeeDetails").classList.add("hidden");

  fetch(`${leaveStatusApiUrl}?empid=${empIdGlobal}`)
    .then(res => res.json())
    .then(data => {
      if (!data || data.length === 0) {
        document.getElementById("leaveStatusSection").innerHTML = "<p>No leave records found.</p>";
        return;
      }
      renderLeaveStatusTable(data);
    })
    .catch(err => {
      console.error("Error:", err);
      document.getElementById("leaveStatusSection").innerHTML = "<p>Something went wrong while fetching leave status.</p>";
    });
}
function openAttendance() {
  if (!empIdGlobal) {
    alert("Employee ID not found. Please login again.");
    return;
  }

  document.getElementById("attendanceSection").innerHTML = `<div id="attendanceLoading">......LOADING......</div>`;
  document.getElementById("attendanceSection").classList.remove("hidden");
  document.getElementById("employeeDetails").classList.add("hidden");

  fetch(`${attendanceApiUrl}?empid=${empIdGlobal}`)
    .then(res => res.json())
    .then(data => {
      if (!data || data.length === 0) {
        document.getElementById("attendanceSection").innerHTML = "<p>No attendance records found.</p>";
        return;
      }
      renderAttendanceTable(data);
    })
    .catch(err => {
      console.error("Error:", err);
      document.getElementById("attendanceSection").innerHTML = "<p>Something went wrong while fetching attendance data.</p>";
    });
}



function formatDate(dateStr) {
  if (!dateStr) return "";
  let d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d.getDate().toString().padStart(2, '0')}-${months[d.getMonth()]}-${d.getFullYear().toString().slice(-2)}`;
}

function renderLeaveStatusTable(data) {
  const headers = Object.keys(data[0]);
  const startDateCol = headers.find(h => h.toLowerCase().includes("starting date"));
  const finishDateCol = headers.find(h => h.toLowerCase().includes("last date"));

  let html = `<div class="leave-table-container">
    <button id="closeLeaveStatus" onclick="closeLeaveStatus()">Close</button>
    <div class="leave-table-caption">Leave Status : ${data[0][headers[0]] || ""}</div>
    <input type="text" id="leaveTableFilter" placeholder="Search/filter... (e.g. Jan, Approved, Full Day)">
    <table class="leave-table" id="leaveStatusTable">
      <thead>
        <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
      </thead>
      <tbody>
        ${data.map(row => `<tr>
          ${headers.map(h => {
            if (h === startDateCol || h === finishDateCol) {
              return `<td>${formatDate(row[h])}</td>`;
            }
            return `<td>${row[h] || ""}</td>`;
          }).join('')}
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`;

  document.getElementById("leaveStatusSection").innerHTML = html;

  document.getElementById("leaveTableFilter").addEventListener("input", function() {
    const filter = this.value.toLowerCase();
    const table = document.getElementById("leaveStatusTable");
    const trs = table.getElementsByTagName("tr");
    for (let i = 1; i < trs.length; i++) {
      const rowText = trs[i].innerText.toLowerCase();
      trs[i].style.display = rowText.includes(filter) ? "" : "none";
    }
  });
}

function closeLeaveStatus() {
  document.getElementById("leaveStatusSection").classList.add("hidden");
  document.getElementById("leaveStatusSection").innerHTML = "";
  document.getElementById("employeeDetails").classList.remove("hidden");
}
function renderAttendanceTable(data) {
  const headers = Object.keys(data[0]);
  const dateCol = headers.find(h => h.toLowerCase().includes("date")); // for main "Date"
  const inTimeCol = headers.find(h => h.toLowerCase().includes("in time"));
  const outTimeCol = headers.find(h => h.toLowerCase().includes("out time"));

  function formatTimeOnly(raw) {
    if (!raw) return "";
    try {
      const d = new Date(raw);
      if (isNaN(d.getTime())) return raw;
      const hh = d.getHours().toString().padStart(2, "0");
      const mm = d.getMinutes().toString().padStart(2, "0");
      return `${hh}:${mm}`;
    } catch {
      return raw;
    }
  }

  let html = `<div class="leave-table-container">
    <button id="closeAttendance" onclick="closeAttendance()">Close</button>
    <div class="leave-table-caption">Attendance : ${data[0][headers[0]] || ""}</div>
    <input type="text" id="attendanceTableFilter" placeholder="Search/filter... (e.g. Present, Absent)">
    <table class="leave-table" id="attendanceTable">
      <thead>
        <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
      </thead>
      <tbody>
        ${data.map(row => `<tr>
          ${headers.map(h => {
            if (h === inTimeCol || h === outTimeCol) {
              return `<td>${formatTimeOnly(row[h])}</td>`;
            }
            return `<td>${row[h] || ""}</td>`;
          }).join('')}
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`;

  document.getElementById("attendanceSection").innerHTML = html;

  document.getElementById("attendanceTableFilter").addEventListener("input", function() {
    const filter = this.value.toLowerCase();
    const table = document.getElementById("attendanceTable");
    const trs = table.getElementsByTagName("tr");
    for (let i = 1; i < trs.length; i++) {
      const rowText = trs[i].innerText.toLowerCase();
      trs[i].style.display = rowText.includes(filter) ? "" : "none";
    }
  });
}

function closeAttendance() {
  document.getElementById("attendanceSection").classList.add("hidden");
  document.getElementById("attendanceSection").innerHTML = "";
  document.getElementById("employeeDetails").classList.remove("hidden");
}

// === SALARY SLIP FUNCTIONS ===

function opensalaryslip() {
  if (!empIdGlobal) {
    alert("Employee ID not found. Please login again.");
    return;
  }

  document.getElementById("salarySection").innerHTML = `<div id="salaryLoading">......LOADING......</div>`;
  document.getElementById("salarySection").classList.remove("hidden");
  document.getElementById("employeeDetails").classList.add("hidden");

  fetch(`${salaryslipApiUrl}?empid=${empIdGlobal}`)
    .then(res => res.json())
    .then(data => {
      if (!data || data.length === 0) {
        document.getElementById("salarySection").innerHTML = "<p>No salary records found.</p>";
        return;
      }
      rendersalaryslipTable(data);
    })
    .catch(err => {
      console.error("Error:", err);
      document.getElementById("salarySection").innerHTML = "<p>Something went wrong while fetching salary slip data.</p>";
    });
}

function rendersalaryslipTable(data) {
  const headers = Object.keys(data[0]);

  let html = `<div class="leave-table-container">
    <button id="closeSalarySlip" onclick="closeSalarySlip()">Close</button>
    <div class="leave-table-caption">Salary Slips : ${data[0][headers[0]] || ""}</div>
    <input type="text" id="salaryTableFilter" placeholder="Search/filter... (e.g. Jan, 2024)">
    <table class="leave-table" id="salaryTable">
      <thead>
        <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
      </thead>
      <tbody>
        ${data.map(row => `<tr>
          ${headers.map(h => {
            if (String(row[h]).includes("https://")) {
              return `<td><a href="${row[h]}" target="_blank">View</a></td>`;
            }
            return `<td>${row[h] || ""}</td>`;
          }).join('')}
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`;

  document.getElementById("salarySection").innerHTML = html;

  // Filter functionality
  document.getElementById("salaryTableFilter").addEventListener("input", function() {
    const filter = this.value.toLowerCase();
    const table = document.getElementById("salaryTable");
    const trs = table.getElementsByTagName("tr");
    for (let i = 1; i < trs.length; i++) {
      const rowText = trs[i].innerText.toLowerCase();
      trs[i].style.display = rowText.includes(filter) ? "" : "none";
    }
  });
}

function closeSalarySlip() {
  document.getElementById("salarySection").classList.add("hidden");
  document.getElementById("salarySection").innerHTML = "";
  document.getElementById("employeeDetails").classList.remove("hidden");
}

function logout() {
  document.getElementById("employeeDetails").classList.add("hidden");
  document.getElementById("loginSection").classList.remove("hidden");
  document.getElementById("empId").value = "";
  document.getElementById("password").value = "";
  document.getElementById("detailsList").innerHTML = "";
  document.getElementById("empName").textContent = "";
  document.getElementById("employeeImage").src = "image/default.jpg";
  leaveStatusURL = "";
  empIdGlobal = "";
  document.getElementById("leaveStatusSection").classList.add("hidden");
  document.getElementById("leaveStatusSection").innerHTML = "";
}
