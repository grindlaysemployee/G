let empIdGlobal = "";
const detailsApiUrl = "https://script.google.com/macros/s/AKfycbzOjXNlZT_Mzv6jQ2jUJJvFcLtLwN7gMu3AnT1EMRArd41M0DleGdMvaXpyv1LuNFeR/exec";
const leaveStatusApiUrl = "https://script.google.com/macros/s/AKfycbyi9kASaDhNNCXnAMvcsmEnLhDA3diXBQdlPV08hOPSToTMrxA7xkjG5s5IjRx61VIl/exec";
const attendanceApiUrl = "https://script.google.com/macros/s/AKfycby-1_Pc37QvqTn9kxnhqlAfjKhD3LwGh7fR7K6sG-SUoOV14grYN6ZEkqOPq60R0KXo/exec";
const salaryslipApiUrl = "https://script.google.com/macros/s/AKfycbx-LOi04cNE21-V7TDbHJwvJsdr9xvjAJKKdRfhFAdGTI8hDAKbeVFcIoDY3HYw4hwg/exec";

function login() {
  const empId = document.getElementById("empId").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!empId || !password) {
    alert("Please enter Employee ID and Password.");
    return;
  }

  empIdGlobal = empId;

  document.getElementById("loginSection").classList.add("hidden");
  document.getElementById("loadingSpinner").classList.remove("hidden");

  fetch(detailsApiUrl, {
    method: "POST",
    body: JSON.stringify({ empid: empId, password }),
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.json())
    .then(data => {
      if (!data || !data.name) {
        alert("Invalid credentials. Please try again.");
        document.getElementById("loginSection").classList.remove("hidden");
        document.getElementById("loadingSpinner").classList.add("hidden");
        return;
      }

      document.getElementById("empName").innerText = data.name;

      const detailsList = document.getElementById("detailsList");
      detailsList.innerHTML = "";

      for (let key in data) {
        if (key !== "name" && key !== "image") {
          const li = document.createElement("li");
          li.textContent = `${key}: ${data[key]}`;
          detailsList.appendChild(li);
        }
      }

      const employeeImage = document.getElementById("employeeImage");
      employeeImage.src = `image/${empId}.jpg`;
      employeeImage.onerror = () => {
        employeeImage.src = "image/default.jpg";
      };

      document.getElementById("loadingSpinner").classList.add("hidden");
      document.getElementById("employeeDetails").classList.remove("hidden");
    })
    .catch(err => {
      console.error("Login error:", err);
      alert("Something went wrong during login.");
      document.getElementById("loginSection").classList.remove("hidden");
      document.getElementById("loadingSpinner").classList.add("hidden");
    });
}

function logout() {
  location.reload();
}

function openLeaveStatus() {
  if (!empIdGlobal) {
    alert("Employee ID not found. Please login again.");
    return;
  }

  document.getElementById("leaveStatusSection").innerHTML = `<div id="leaveLoading">......LOADING......</div>`;
  document.getElementById("leaveStatusSection").classList.remove("hidden");
  document.getElementById("employeeDetails").classList.add("hidden");

  fetch(`${leaveStatusApiUrl}?empid=${empIdGlobal}`)
    .then(res => res.json())
    .then(data => {
      if (!data || !data.length) {
        document.getElementById("leaveStatusSection").innerHTML = "<p>No Leave Status found.</p>";
        return;
      }
      renderLeaveTable(data);
    })
    .catch(err => {
      console.error("Error fetching leave status:", err);
      document.getElementById("leaveStatusSection").innerHTML = "<p>Error fetching leave data.</p>";
    });
}

function renderLeaveTable(data) {
  const headers = Object.keys(data[0]);

  let html = `<div class="leave-table-container">
    <button id="closeleave" onclick="closeLeave()">Close</button>
    <div class="leave-table-caption">Leave Status</div>
    <input type="text" id="leaveTableFilter" placeholder="Search/filter...">
    <table class="leave-table" id="leaveTable">
      <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
      <tbody>
        ${data.map(row => `<tr>
          ${headers.map(h => `<td>${row[h] || ""}</td>`).join('')}
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`;

  document.getElementById("leaveStatusSection").innerHTML = html;

  document.getElementById("leaveTableFilter").addEventListener("input", function () {
    const filter = this.value.toLowerCase();
    const trs = document.querySelectorAll("#leaveTable tbody tr");
    trs.forEach(tr => {
      tr.style.display = tr.innerText.toLowerCase().includes(filter) ? "" : "none";
    });
  });
}

function closeLeave() {
  document.getElementById("leaveStatusSection").classList.add("hidden");
  document.getElementById("employeeDetails").classList.remove("hidden");
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
      if (!data || !data.length) {
        document.getElementById("attendanceSection").innerHTML = "<p>No attendance records found.</p>";
        return;
      }
      renderAttendanceTable(data);
    })
    .catch(err => {
      console.error("Error fetching attendance:", err);
      document.getElementById("attendanceSection").innerHTML = "<p>Error fetching attendance data.</p>";
    });
}

function renderAttendanceTable(data) {
  const headers = Object.keys(data[0]);

  let html = `<div class="leave-table-container">
    <button id="closeattendance" onclick="closeAttendance()">Close</button>
    <div class="leave-table-caption">Attendance</div>
    <input type="text" id="attendanceTableFilter" placeholder="Search/filter...">
    <table class="leave-table" id="attendanceTable">
      <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
      <tbody>
        ${data.map(row => `<tr>
          ${headers.map(h => `<td>${row[h] || ""}</td>`).join('')}
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`;

  document.getElementById("attendanceSection").innerHTML = html;

  document.getElementById("attendanceTableFilter").addEventListener("input", function () {
    const filter = this.value.toLowerCase();
    const trs = document.querySelectorAll("#attendanceTable tbody tr");
    trs.forEach(tr => {
      tr.style.display = tr.innerText.toLowerCase().includes(filter) ? "" : "none";
    });
  });
}

function closeAttendance() {
  document.getElementById("attendanceSection").classList.add("hidden");
  document.getElementById("employeeDetails").classList.remove("hidden");
}

function opensalaryslip() {
  if (!empIdGlobal) {
    alert("Employee ID not found. Please login again.");
    return;
  }

  document.getElementById("salarySection").innerHTML = `<div id="salaryslipLoading">......LOADING......</div>`;
  document.getElementById("salarySection").classList.remove("hidden");
  document.getElementById("employeeDetails").classList.add("hidden");

  fetch(`${salaryslipApiUrl}?empid=${empIdGlobal}`)
    .then(res => res.json())
    .then(data => {
      if (!data || !data.length || !data[0]["Month Slip"]) {
        document.getElementById("salarySection").innerHTML = "<p>No Salary Slip records found.</p>";
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
    <button id="closesalaryslip" onclick="closesalaryslip()">Close</button>
    <div class="leave-table-caption">Salary Slip Details</div>
    <input type="text" id="salaryslipTableFilter" placeholder="Search/filter...">
    <table class="leave-table" id="salaryslipTable">
      <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
      <tbody>
        ${data.map(row => `<tr>
          ${headers.map(h => `<td>${row[h] || ""}</td>`).join('')}
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`;

  document.getElementById("salarySection").innerHTML = html;

  document.getElementById("salaryslipTableFilter").addEventListener("input", function () {
    const filter = this.value.toLowerCase();
    const trs = document.querySelectorAll("#salaryslipTable tbody tr");
    trs.forEach(tr => {
      tr.style.display = tr.innerText.toLowerCase().includes(filter) ? "" : "none";
    });
  });
}

function closesalaryslip() {
  document.getElementById("salarySection").classList.add("hidden");
  document.getElementById("employeeDetails").classList.remove("hidden");
}
