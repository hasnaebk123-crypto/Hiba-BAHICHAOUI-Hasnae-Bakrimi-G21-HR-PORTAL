
let employees = JSON.parse(localStorage.getItem("employees")) || [];
let departments = JSON.parse(localStorage.getItem("departments")) || ["RH", "Marketing", "Design"];

function showSection(id) {
    document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
    document.getElementById("page-title").innerText = id.charAt(0).toUpperCase() + id.slice(1);
}

function displayDepartments() {
    const list = document.getElementById("departmentList");
    const select = document.getElementById("empDept");
    list.innerHTML = "";
    select.innerHTML = '<option value="">Choisir un département</option>';

    departments.forEach((dept, index) => {
        list.innerHTML += `<li>${dept} <button onclick="deleteDept(${index})" style="background:#e74c3c; padding:5px 10px;">Supprimer</button></li>`;
        select.innerHTML += `<option value="${dept}">${dept}</option>`;
    });
    localStorage.setItem("departments", JSON.stringify(departments));
}

function addDepartment() {
    const name = document.getElementById("deptName").value;
    if (name) {
        departments.push(name);
        document.getElementById("deptName").value = "";
        displayDepartments();
    }
}

function deleteDept(index) {
    if(confirm("Supprimer ce pôle ?")) {
        departments.splice(index, 1);
        displayDepartments();
    }
}

document.getElementById("employeeForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const index = document.getElementById("editIndex").value;
    
    const emp = {
        nom: document.getElementById("nom").value,
        prenom: document.getElementById("prenom").value,
        salaire: document.getElementById("salaire").value,
        dept: document.getElementById("empDept").value
    };

    if (index === "-1") {
        employees.push(emp);
    } else {
        employees[index] = emp;
        document.getElementById("editIndex").value = "-1";
        document.getElementById("submitBtn").innerText = "Ajouter au registre";
    }

    localStorage.setItem("employees", JSON.stringify(employees));
    this.reset();
    displayEmployees();
    updateDashboard();
});

function displayEmployees() {
    const list = document.getElementById("employeeList");
    list.innerHTML = "";

    employees.forEach((emp, i) => {
        list.innerHTML += `
            <tr>
                <td><b>${emp.nom.toUpperCase()}</b></td>
                <td>${emp.prenom}</td>
                <td><span style="color:#d4a5a5">#${emp.dept}</span></td>
                <td>${emp.salaire} €</td>
                <td>
                    <button onclick="editEmployee(${i})" style="background:#3498db">Editer</button>
                    <button onclick="deleteEmployee(${i})" style="background:#e74c3c">X</button>
                </td>
            </tr>`;
    });
}

function editEmployee(index) {
    const emp = employees[index];
    document.getElementById("nom").value = emp.nom;
    document.getElementById("prenom").value = emp.prenom;
    document.getElementById("salaire").value = emp.salaire;
    document.getElementById("empDept").value = emp.dept;
    document.getElementById("editIndex").value = index;
    document.getElementById("submitBtn").innerText = "Enregistrer les modifications";
}

function deleteEmployee(index) {
    if (confirm("Supprimer cette fiche collaborateur ?")) {
        employees.splice(index, 1);
        localStorage.setItem("employees", JSON.stringify(employees));
        displayEmployees();
        updateDashboard();
    }
}

function sortEmployees(criteria) {
    if (criteria === 'nom') {
        employees.sort((a, b) => a.nom.localeCompare(b.nom));
    } else {
        employees.sort((a, b) => b.salaire - a.salaire);
    }
    displayEmployees();
}

function searchEmployee() {
    let filter = document.getElementById("search").value.toLowerCase();
    let rows = document.querySelectorAll("#employeeList tr");
    rows.forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(filter) ? "" : "none";
    });
}
let chart;
function updateDashboard() {
    document.getElementById("kpiEmployees").innerText = employees.length;
    let total = employees.reduce((sum, emp) => sum + Number(emp.salaire), 0);
    let avg = employees.length > 0 ? (total / employees.length).toFixed(0) : 0;
    document.getElementById("kpiSalary").innerText = avg + " €";
    createChart(avg);
}

function createChart(avg) {
    if (chart) chart.destroy();
    chart = new Chart(document.getElementById("chartEmployees"), {
        type: "bar",
        data: {
            labels: ["Effectif", "Salaire Moyen"],
            datasets: [{
                label: 'Statistiques RH',
                data: [employees.length, avg],
                backgroundColor: ["#f5d5d5", "#d4e1f5"]
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}
function importFromAPI() {
    fetch("https://randomuser.me/api/?results=3")
        .then(res => res.json())
        .then(data => {
            data.results.forEach(user => {
                employees.push({
                    nom: user.name.last,
                    prenom: user.name.first,
                    salaire: 2500,
                    dept: "RH"
                });
            });
            localStorage.setItem("employees", JSON.stringify(employees));
            displayEmployees();
            updateDashboard();
        }).catch(err => console.error("Erreur API:", err));
}
displayDepartments();
displayEmployees();
updateDashboard();
