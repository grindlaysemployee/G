const apiUrl = "https://script.google.com/macros/s/AKfycbzwxQPojqkdeSHmIXyO4dCABlREXYkL2B51ZKP1K5MNNpTDvanNCPHAT2OluD35lbqS/exec";

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

  fetch(`${apiUrl}?empid=${empId}&password=${password}`)
    .then(res => res.json())
    .then(data => {
      if (!data || !data.Name) {
        alert("Invalid credentials");
        return;
      }

      document.getElementById("empName").textContent = data.Name;
      const detailsList = document.getElementById("detailsList");
      detailsList.innerHTML = "";

      const fields = {
        "Emp ID": data.empid,
        "Emp Code": data["Emp Code"],
        "Designation": data.Designation,
        "Father's Name": data["FATHER'S NAME"],
        "Gender": data.SEX,
        "ESIC Number": data["ESIC NUMBER"],
        "PF Number": data["PF NUMBER"],
        "Date of Birth": formatDate(data.DOB),
        "Mobile Number": data["MOBILE NUMBER"],
        "Aadhar Number": data["ADHAR NUMBER"],
        "ID Proof": data["PAN CARD / VOTER ID / RATION CARD"],
        "Permanent Address": data["PERMANENT HOME ADDRESS"],
        "Local Address": data["LOCAL ADDRESS"],
        "Date of Joining": formatDate(data["DATE OF JOINING"]),
        "Emergency Contact": data["EMERGENCY CONTACT NO"],
        "Status": data["EMPLOYEE STATUS"]
      };

      for (let key in fields) {
        const li = document.createElement("li");
        li.textContent = `${key}: ${fields[key] || ''}`;
        detailsList.appendChild(li);
      }

      document.getElementById("employeeDetails").classList.remove("hidden");
    })
    .catch(err => {
      console.error("Error:", err);
      alert("Something went wrong!");
    });
}
