const apiUrl = "https://script.google.com/macros/s/AKfycbwGn3vhTAKP1_CWn4eIAOCj_VW-Ip9vW5js0zX04V88Fn56m7AeowSR3CXt9Buoy6A/exec";

let leaveStatusURL = "";

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

  fetch(apiUrl, {
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

      document.getElementById("empName").textContent = `Welcome, ${data.name}`;

      document.getElementById("employeeImage").src = `image/${data.empId}.jpg`;
      document.getElementById("employeeImage").onerror = function () {
        this.src = "image/default.jpg";
      };

      leaveStatusURL = data.leaveStatusURL || "";

      document.getElementById("empIdField").textContent = `Employee ID: ${data.empId}`;
      document.getElementById("empCodeField").textContent = `Emp Code: ${data.empCode}`;
      document.getElementById("designationField").textContent = `Designation: ${data.designation}`;
      document.getElementById("statusField").textContent = `Status: ${data.status}`;

      const otherDetails = {
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
      };

      const detailsList = document.getElementById("detailsList");
      detailsList.innerHTML = "";

      for (let key in otherDetails) {
        const li = document.createElement("li");
        li.textContent = `${key}: ${otherDetails[key] || "N/A"}`;
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
  if (leaveStatusURL) {
    window.open(leaveStatusURL, "_blank");
  } else {
    alert("Leave status link not available.");
  }
}

function logout() {
  location.reload();
}
