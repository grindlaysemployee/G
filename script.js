const detailsApiUrl = "https://script.google.com/macros/s/AKfycbwGn3vhTAKP1_CWn4eIAOCj_VW-Ip9vW5js0zX04V88Fn56m7AeowSR3CXt9Buoy6A/exec";
const leaveStatusApiUrl = "https://script.google.com/macros/s/AKfycbzgIQeO71mZpmmXifTWkaZoCjd0gKtw_QrX3RWsvimvFkxdbAchPamTOdLxOSwfOpsG/exec";

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

  // POST request to Employee Details API
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

      empIdGlobal = data.empId; // Store for leave status API

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

  fetch(`${leaveStatusApiUrl}?empid=${empIdGlobal}`)
    .then(res => res.json())
    .then(data => {
      console.log("Leave Status Data:", data); // Debug
      if (!data || data.length === 0) {
        alert("Leave status not available.");
        return;
      }
      document.getElementById("employeeDetails").classList.add("hidden");
      renderLeaveStatusTable(data);
      document.getElementById("leaveStatusSection").classList.remove("hidden");
    })
    .catch(err => {
      console.error("Error:", err);
      alert("Something went wrong while fetching leave status.");
    });
}

// Helper function to render professional table
function renderLeaveStatusTable(data) {
  if (!data || data.length === 0) {
    document.getElementById("leaveStatusSection").innerHTML = "<p>No leave records found.</p>";
    return;
  }

  // Dynamically get headers from data
  const headers = Object.keys(data[0]);

  let html = `<div class="leave-table-container">
    <button id="closeLeaveStatus" onclick="closeLeaveStatus()">Close</button>
    <div class="leave-table-caption">Leave Status : ${data[0][headers[0]] || ""}</div>
    <table class="leave-table">
      <thead>
        <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
      </thead>
      <tbody>`;

  data.forEach(row => {
    html += `<tr>
      ${headers.map(h => `<td>${row[h] || ""}</td>`).join('')}
    </tr>`;
  });

  html += `</tbody></table></div>`;

  document.getElementById("leaveStatusSection").innerHTML = html;
}

function closeLeaveStatus() {
  document.getElementById("leaveStatusSection").classList.add("hidden");
  document.getElementById("leaveStatusSection").innerHTML = "";
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
