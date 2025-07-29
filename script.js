
async function login() {
  const empId = document.getElementById("empId").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("errorMsg");
  errorMsg.textContent = "";

  if (!empId || !password) {
    errorMsg.textContent = "Please enter both Employee ID and Password.";
    return;
  }

  const url = "https://script.google.com/macros/s/AKfycbwGn3vhTAKP1_CWn4eIAOCj_VW-Ip9vW5js0zX04V88Fn56m7AeowSR3CXt9Buoy6A/exec";

  const formData = new FormData();
  formData.append("empId", empId);
  formData.append("password", password);

  try {
    const res = await fetch(url, {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (data.success) {
      document.getElementById("login").style.display = "none";
      document.getElementById("profile").style.display = "block";

      // Helper function to format date
      const formatDate = (isoDateStr) => {
        if (!isoDateStr) return "";
        const d = new Date(isoDateStr);
        return d.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: '2-digit'
        });
      };

      // Fill profile fields
      document.getElementById("name").textContent = data.name || "";
      document.getElementById("empIdProfile").textContent = data.empId || "";
      document.getElementById("empCode").textContent = data.empCode || "";
      document.getElementById("designation").textContent = data.designation || "";
      document.getElementById("fatherName").textContent = data.fatherName || "";
      document.getElementById("gender").textContent = data.gender || "";
      document.getElementById("esicNumber").textContent = data.esicNumber || "";
      document.getElementById("pfNumber").textContent = data.pfNumber || "";
      document.getElementById("dob").textContent = formatDate(data.dob);
      document.getElementById("mobile").textContent = data.mobile || "";
      document.getElementById("aadhar").textContent = data.aadhar || "";
      document.getElementById("idProof").textContent = data.idProof || "";
      document.getElementById("permanentAddress").textContent = data.permanentAddress || "";
      document.getElementById("localAddress").textContent = data.localAddress || "";
      document.getElementById("joiningDate").textContent = formatDate(data.joiningDate);
      document.getElementById("emergencyContact").textContent = data.emergencyContact || "";
      document.getElementById("status").textContent = data.status || "";
    } else {
      errorMsg.textContent = data.message || "Invalid credentials.";
    }
  } catch (error) {
    errorMsg.textContent = "Login failed. Please try again.";
  }
}
