const detailsApiUrl = "https://script.google.com/macros/s/AKfycbwGn3vhTAKP1_CWn4eIAOCj_VW-Ip9vW5js0zX04V88Fn56m7AeowSR3CXt9Buoy6A/exec";
const leaveStatusApiUrl = "https://script.google.com/macros/s/AKfycbzgIQeO71mZpmmXifTWkaZoCjd0gKtw_QrX3RWsvimvFkxdbAchPamTOdLxOSwfOpsG/exec";
const attendanceApiUrl = "https://script.google.com/macros/s/AKfycbxxIX6YIb7Q5t0VGKXOGXQ_7rG0Td-5q6iai0brnQpcmqfQ8Rfu7DHBkiKL7SsdUZM/exec";

let empIdGlobal = "";

// Hide all sections on page load
window.onload = function () {
  hideAllSections();
  document.getElementById("loginSection").classList.remove("hidden");
};

function hideAllSections() {
  document.getElementById("employeeDetails").classList.add("hidden");
  document.getElementById("loadingSpinner").classList.add("hidden");
  document.getElementById("loginSection").classList.add("hidden");
  document.getElementById("leaveStatusSection").classList.add("hidden");
}

function login() {
  const empId = document.getElementById("empId").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!empId || !password) {
    alert("Please enter Employee ID and Password");
    return;
  }

  hideAllSections();
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
        "Name": data.name,
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
        li.innerHTML = `<span class="detail-label">${key}:</span> <span class="detail-value">${fields[key] || "N/A"}</span>`;
        li.classList.add("detail-item");
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

function fetchAndRenderSection(apiUrl, sectionId, titleText) {
  if (!empIdGlobal) {
    alert("Please login first.");
    return;
  }

  hideAllSections();
  const section = document.getElementById("leaveStatusSection");
  section.classList.remove("hidden");
  section.innerHTML = `<div style="text-align:center; padding:1em; font-weight:bold">......Please Wait......</div>`;

  fetch(`${apiUrl}?empid=${empIdGlobal}`)
    .then(res => res.json())
    .then(data => {
      if (!data || data.length === 0) {
        section.innerHTML = "<p style='text-align:center;'>No records found.</p>";
        return;
      }
      renderDataTable(data, titleText);
    })
    .catch(err => {
      console.error("Error:", err);
      section.innerHTML = "<p style='text-align:center;'>Error loading data. Try again later.</p>";
    });
}

function renderDataTable(data, title) {
  const headers = Object.keys(data[0]);

  let html = `<div class="leave-table-container">
    <button onclick="closeLeaveStatus()">Close</button>
    <div class="leave-table-caption">${title}</div>
    <input type="text" id="leaveTableFilter" placeholder="Search/filter...">
    <table class="leave-table" id="leaveStatusTable">
      <thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead>
      <tbody>
        ${data.map(row => `<tr>${headers.map(h => `<td>${row[h] || ""}</td>`).join("")}</tr>`).join("")}
      </tbody>
    </table>
  </div>`;

  const section = document.getElementById("leaveStatusSection");
  section.innerHTML = html;

  document.getElementById("leaveTableFilter").addEventListener("input", function () {
    const filter = this.value.toLowerCase();
    const rows = document.querySelectorAll("#leaveStatusTable tbody tr");
    rows.forEach(row => {
      const rowText = row.innerText.toLowerCase();
      row.style.display = rowText.includes(filter) ? "" : "none";
    });
  });
}

function openLeaveStatus() {
  fetchAndRenderSection(leaveStatusApiUrl, "leaveStatusSection", "Leave Status");
}

function openAttendanceStatus() {
  fetchAndRenderSection(attendanceApiUrl, "leaveStatusSection", "Current Month Attendance");
}

function closeLeaveStatus() {
  document.getElementById("leaveStatusSection").classList.add("hidden");
  document.getElementById("leaveStatusSection").innerHTML = "";
  document.getElementById("employeeDetails").classList.remove("hidden");
}

function logout() {
  empIdGlobal = "";
  document.getElementById("employeeDetails").classList.add("hidden");
  document.getElementById("loginSection").classList.remove("hidden");
  document.getElementById("empId").value = "";
  document.getElementById("password").value = "";
  document.getElementById("detailsList").innerHTML = "";
  document.getElementById("empName").textContent = "";
  document.getElementById("employeeImage").src = "image/default.jpg";
  document.getElementById("leaveStatusSection").classList.add("hidden");
  document.getElementById("leaveStatusSection").innerHTML = "";
}
