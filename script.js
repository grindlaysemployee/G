const apiUrl = "https://script.google.com/macros/s/AKfycbwGn3vhTAKP1_CWn4eIAOCj_VW-Ip9vW5js0zX04V88Fn56m7AeowSR3CXt9Buoy6A/exec";

function login() {
  const empId = document.getElementById("empId").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!empId || !password) {
    alert("Please enter Employee ID and Password");
    return;
  }

  // Show loading spinner
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

      document.getElementById("empName").textContent = data.name;

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
        "Joining Date": data.joiningDate,
        "Mobile": data.mobile,
        "Aadhar": data.aadhar,
        "ID Proof": data.idProof,
        "Permanent Address": data.permanentAddress,
        "Local Address": data.localAddress,
        "Emergency Contact": data.emergencyContact,
        "Status": data.status
      };

      const detailsList = document.getElementById("detailsList");
      detailsList.innerHTML = "";

      const table = document.createElement("table");
      table.style.width = "100%";
      table.style.borderCollapse = "collapse";
      table.style.marginTop = "10px";

      for (let key in fields) {
        const tr = document.createElement("tr");

        const tdKey = document.createElement("td");
        tdKey.textContent = key;
        tdKey.style.fontWeight = "bold";
        tdKey.style.padding = "8px";
        tdKey.style.borderBottom = "1px solid #ccc";
        tdKey.style.width = "40%";

        const tdValue = document.createElement("td");
        tdValue.textContent = fields[key] || "-";
        tdValue.style.padding = "8px";
        tdValue.style.borderBottom = "1px solid #ccc";

        tr.appendChild(tdKey);
        tr.appendChild(tdValue);
        table.appendChild(tr);
      }

      detailsList.appendChild(table);

      // Load image using Employee ID
      const img = document.createElement("img");
      img.src = `image/${data.empId}.jpg`;
      img.alt = "Employee Image";
      img.className = "lens-image";
      img.style.display = "block";
      img.style.margin = "15px auto";

      const employeeDetailsDiv = document.getElementById("employeeDetails");
      employeeDetailsDiv.insertBefore(img, detailsList);

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
