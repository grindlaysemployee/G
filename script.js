let empIdGlobal = "";
const detailsApiUrl = "https://script.google.com/macros/s/AKfycbwGn3vhTAKP1_CWn4eIAOCj_VW-Ip9vW5js0zX04V88Fn56m7AeowSR3CXt9Buoy6A/exec";
const leaveStatusApiUrl = "https://script.google.com/macros/s/AKfycbwGn3vhTAKP1_CWn4eIAOCj_VW-Ip9vW5js0zX04V88Fn56m7AeowSR3CXt9Buoy6A/exec";
const attendanceApiUrl = "https://script.google.com/macros/s/AKfycbwGn3vhTAKP1_CWn4eIAOCj_VW-Ip9vW5js0zX04V88Fn56m7AeowSR3CXt9Buoy6A/exec";
const totalAttendanceApiUrl = "https://script.google.com/macros/s/AKfycbzs2Z8Pdt34Hbh1-mdBMYdT41PtH9UeI4MGNcmo67nPPUOkMRFGLOCi1J-F_2k3dzbh/exec";

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
    body: JSON.stringify({ empId, password }),
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("loadingSpinner").classList.add("hidden");
      if (data && data.success) {
        empIdGlobal = empId;
        document.getElementById("employeeDetails").classList.remove("hidden");
        document.getElementById("empName").textContent = data.name || empId;

        const detailsList = document.getElementById("detailsList");
        detailsList.innerHTML = "";
        for (const key in data) {
          if (key !== "success" && key !== "image") {
            const li = document.createElement("li");
            li.textContent = `${key}: ${data[key]}`;
            detailsList.appendChild(li);
          }
        }

        const imgPath = `image/${empId}.jpg`;
        document.getElementById("employeeImage").src = imgPath;
      } else {
        alert("Invalid credentials. Please try again.");
        document.getElementById("loginSection").classList.remove("hidden");
      }
    })
    .catch(err => {
      console.error("Login Error:", err);
      alert("Something went wrong.");
      document.getElementById("loginSection").classList.remove("hidden");
      document.getElementById("loadingSpinner").classList.add("hidden");
    });
}

function openLeaveStatus() {
  const section = document.getElementById("leaveStatusSection");
  section.innerHTML = `
    <button id="closeLeaveStatus" onclick="section.classList.add('hidden')">Close</button>
    <div id="leaveStatusLoading">Loading Leave Status...</div>
  `;
  section.classList.remove("hidden");

  fetch(`${leaveStatusApiUrl}?empId=${empIdGlobal}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById("leaveStatusLoading").remove();
      const table = createTable(data, "Leave Status", "leave-table");
      section.appendChild(table);
    });
}

function openAttendance() {
  const section = document.getElementById("attendanceSection");
  section.innerHTML = `
    <button id="closeLeaveStatus" onclick="section.classList.add('hidden')">Close</button>
    <div id="leaveStatusLoading">Loading Attendance...</div>
  `;
  section.classList.remove("hidden");

  fetch(`${attendanceApiUrl}?empId=${empIdGlobal}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById("leaveStatusLoading").remove();
      const table = createTable(data, "Attendance", "leave-table");
      section.appendChild(table);
    });
}

function openTotalAttendance() {
  const section = document.getElementById("totalAttendanceSection");
  section.innerHTML = `
    <button id="closeTotalAttendance" onclick="section.classList.add('hidden')">Close</button>
    <div id="totalAttendanceLoading">Loading Total Attendance...</div>
  `;
  section.classList.remove("hidden");

  fetch(`${totalAttendanceApiUrl}?empId=${empIdGlobal}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById("totalAttendanceLoading").remove();
      const table = createTable(data, "Total Attendance", "total-attendance-table");
      section.appendChild(table);
    });
}

function createTable(data, title, className) {
  const container = document.createElement("div");
  const caption = document.createElement("div");
  caption.className = "leave-table-caption";
  caption.textContent = title;
  container.appendChild(caption);

  const table = document.createElement("table");
  table.className = className;

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  if (data.length > 0) {
    Object.keys(data[0]).forEach(key => {
      const th = document.createElement("th");
      th.textContent = key;
      headerRow.appendChild(th);
    });
  }
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  data.forEach(row => {
    const tr = document.createElement("tr");
    Object.values(row).forEach(value => {
      const td = document.createElement("td");
      td.textContent = value;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  container.appendChild(table);
  return container;
}

function logout() {
  window.location.reload();
}
