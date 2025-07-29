const apiUrl = "https://script.google.com/macros/s/AKfycbwGn3vhTAKP1_CWn4eIAOCj_VW-Ip9vW5js0zX04V88Fn56m7AeowSR3CXt9Buoy6A/exec";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const options = { day: '2-digit', month: 'short', year: '2-digit' };
  return d.toLocaleDateString('en-GB', options).replace(/ /g, '-');
}

function login() {
  const empId = document.getElementById("empId").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!empId || !password) {
    alert("Please enter Employee ID and Password");
    return;
  }

  fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `empId=${encodeURIComponent(empId)}&password=${encodeURIComponent(password)}`
  })
    .then(res => res.json())
    .then(data => {
      if (!data || !data.success) {
        alert(data.message || "Invalid Employee ID or Password");
        return;
      }

      document.getElementById("empName").textContent = data.name;

      const fields = {
        "Employee ID": data.empId,
        "Emp Code": data.empCode,
        "Designation": data.designation,
        "Father's Name": data.fatherName,
        "Gender": data.gender,
        "ESIC Number": data.esicNumber,
        "PF Number": data.pfNumber,
        "Date of Birth": data.dob,
        "Mobile Number": data.mobile,
        "Aadhar Number": data.aadhar,
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
        li.textContent = `${key}: ${fields[key]}`;
        detailsList.appendChild(li);
      }

      document.getElementById("employeeDetails").classList.remove("hidden");
      document.getElementById("loginSection").classList.add("hidden");
    })
    .catch(err => {
      console.error("Error:", err);
      alert("Something went wrong!");
    });
}
