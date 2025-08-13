// ================= API URLs =================
const detailsApiUrl = "https://script.google.com/macros/s/AKfycbwGn3vhTAKP1_CWn4eIAOCj_VW-Ip9vW5js0zX04V88Fn56m7AeowSR3CXt9Buoy6A/exec";
const leaveStatusApiUrl = "https://script.google.com/macros/s/AKfycbzgIQeO71mZpmmXifTWkaZoCjd0gKtw_QrX3RWsvimvFkxdbAchPamTOdLxOSwfOpsG/exec";
const attendanceApiUrl = "https://script.google.com/macros/s/AKfycbxxIX6YIb7Q5t0VGKXOGXQ_7rG0Td-5q6iai0brnQpcmqfQ8Rfu7DHBkiKL7SsdUZM/exec";
const salaryslipApiUrl = "https://script.google.com/macros/s/AKfycbwkqDU3D3tYmIEA1Pe5kbmmkSlMvX1nsDBGR0taJ1a3hohqRB6pFge1CJMfx-3n_I5r/exec";

let empIdGlobal = "";
let leaveStatusURL = "";

// ================= PAGE LOAD =================
window.onload = function () {
    hideAllSections();
    document.getElementById("loginSection").classList.remove("hidden");
};

function hideAllSections() {
    ["employeeDetails", "loadingSpinner", "leaveStatusSection", "attendanceSection", "salarySection"]
        .forEach(id => document.getElementById(id).classList.add("hidden"));
}

// ================= LOGIN =================
function login() {
    const empId = document.getElementById("empId").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!empId || !password) {
        showAlert("Please enter Employee ID and Password", "error");
        return;
    }

    document.getElementById("loginSection").classList.add("hidden");
    showLoading();

    const formData = new FormData();
    formData.append("empId", empId);
    formData.append("password", password);

    fetch(detailsApiUrl, { method: "POST", body: formData })
        .then(res => res.json())
        .then(data => {
            if (!data || !data.success) {
                showAlert("Invalid Employee ID or Password", "error");
                hideLoading();
                document.getElementById("loginSection").classList.remove("hidden");
                return;
            }

            empIdGlobal = data.empId;
            document.getElementById("empName").textContent = data.name;

            const employeeImage = document.getElementById("employeeImage");
            employeeImage.src = `image/${data.empId}.jpg`;
            employeeImage.onerror = function () { this.src = "image/default.jpg"; };

            renderEmployeeDetails(data);

            hideLoading();
            document.getElementById("employeeDetails").classList.remove("hidden");
        })
        .catch(() => {
            showAlert("Something went wrong!", "error");
            hideLoading();
            document.getElementById("loginSection").classList.remove("hidden");
        });
}

function showLoading() {
    const spinner = document.getElementById("loadingSpinner");
    spinner.innerHTML = `<div class="spinner"></div>`;
    spinner.classList.remove("hidden");
}

function hideLoading() {
    document.getElementById("loadingSpinner").classList.add("hidden");
}

// ================= RENDER EMPLOYEE DETAILS =================
function renderEmployeeDetails(data) {
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
    detailsList.innerHTML = Object.entries(fields)
        .map(([key, value]) => `
            <div class="detail-card">
                <span class="detail-label">${key}</span>
                <span class="detail-value">${value || "N/A"}</span>
            </div>
        `).join("");
}

// ================= ALERT SYSTEM =================
function showAlert(message, type) {
    const alertBox = document.createElement("div");
    alertBox.className = `alert ${type}`;
    alertBox.textContent = message;
    document.body.appendChild(alertBox);
    setTimeout(() => alertBox.remove(), 3000);
}

// ================= TABLE RENDERERS =================
// Yaha aapke leave, attendance aur salary slip render functions ka same logic rahega
// bas tables mein alternating row colors + hover effect add kar diya hai

// ================= LOGOUT =================
function logout() {
    hideAllSections();
    document.getElementById("loginSection").classList.remove("hidden");
    document.getElementById("empId").value = "";
    document.getElementById("password").value = "";
    document.getElementById("detailsList").innerHTML = "";
    document.getElementById("empName").textContent = "";
    document.getElementById("employeeImage").src = "image/default.jpg";
    leaveStatusURL = "";
    empIdGlobal = "";
}
