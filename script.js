const detailsApiUrl = "https://script.google.com/macros/s/AKfycbwGn3vhTAKP1_CWn4eIAOCj_VW-Ip9vW5js0zX04V88Fn56m7AeowSR3CXt9Buoy6A/exec";
const leaveStatusApiUrl = "https://script.google.com/macros/s/AKfycbzgIQeO71mZpmmXifTWkaZoCjd0gKtw_QrX3RWsvimvFkxdbAchPamTOdLxOSwfOpsG/exec";
const attendanceApiUrl = "https://script.google.com/macros/s/AKfycbxxIX6YIb7Q5t0VGKXOGXQ_7rG0Td-5q6iai0brnQpcmqfQ8Rfu7DHBkiKL7SsdUZM/exec";

let empIdGlobal = "";

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
      console.error("Login Error:", err);
      alert("Something went wrong!");
      document.getElementById("loadingSpinner").classList.add("hidden");
      document.getElementById("loginSection").classList.remove("hidden");
    });
}

// Main handler for all buttons
function fetchAndDisplayData(type, titleText) {
  if (!empIdGlobal) {
    alert("Please login first.");
    return;
  }

  let apiUrl = "";
  if (type === "LeaveStatusURL") apiUrl = leaveStatusApiUrl;
  else if (type === "AttendanceURL") apiUrl = attendanceApiUrl;
  else if (type === "LeaveBalanceURL") apiUrl = leaveStatusApiUrl; // adjust if separate
  else if (type === "SalarySlipURL") apiUrl = leaveStatusApiUrl;   // adjust if separate
  else return;

  const section = document.getElementById("leaveStatusSection");
  const content = document.getElementById("leaveStatusContent");
  const caption = document.getElementById("dataCaption");
  const loader = document.getElementById("leaveStatusLoading");

  hideAllSections();
  section.classList.remove("hidden");
  loader.style.display = "block";
  content.innerHTML = "";
  caption.textContent = titleText;

  fetch(`${apiUrl}?empid=${empIdGlobal}`)
    .then(res => res.json())
    .then(data => {
      loader.style.display = "none";
      if (!data || data.length === 0) {
        content.innerHTML = "<p style='text-align:center;'>No records found.</p>";
        return;
      }
      renderDataTable(data, content);
    })
    .catch(err => {
      loader.style.display = "none";
      content.innerHTML = "<p style='text-align:center;'>Error loading data. Try again later.</p>";
      console.error("Fetch Error:", err);
    });
}

function renderDataTable(data, containerElement) {
  const headers = Object.keys(data[0]);
  let html = `
    <div class="table-tools">
      <input type="text" id="leaveTableFilter" placeholder="Search/filter...">
    </div>
    <table class="leave-table" id="leaveStatusTable">
      <thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead>
      <tbody>
        ${data.map(row => `<tr>${headers.map(h => `<td>${row[h] || ""}</td>`).join("")}</tr>`).join("")}
      </tbody>
    </table>
  `;
  containerElement.innerHTML = html;

  document.getElementById("leaveTableFilter").addEventListener("input", function () {
    const filter = this.value.toLowerCase();
    const rows = document.querySelectorAll("#leaveStatusTable tbody tr");
    rows.forEach(row => {
      const rowText = row.innerText.toLowerCase();
      row.style.display = rowText.includes(filter) ? "" : "none";
    });
  });
}

function closeLeaveStatus() {
  document.getElementById("leaveStatusSection").classList.add("hidden");
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
  document.getElementById("leaveStatusContent").innerHTML = "";
}
