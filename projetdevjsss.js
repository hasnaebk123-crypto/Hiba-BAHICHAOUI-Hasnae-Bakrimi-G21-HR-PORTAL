/*************** DONNÉES ***************/
var employees = JSON.parse(localStorage.getItem("employees")) || [];
var departments = JSON.parse(localStorage.getItem("departments")) || ["RH", "Marketing", "Design"];

/*************** NAVIGATION ***************/
function showSection(id) {
    document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
    document.getElementById("page-title").innerText = id.charAt(0).toUpperCase() + id.slice(1);
}

/*************** DEPARTEMENTS ***************/
function displayDepartments() {
    var list = document.getElementById("departmentList");
    var select = document.getElementById("empDept");

    list.innerHTML = "";
    select.innerHTML = "<option value=''>Choisir département</option>";

    departments.forEach((d, i) => {
        list.innerHTML += `<li>${d} <button onclick="deleteDept(${i})">X</button></li>`;
        select.innerHTML += `<option>${d}</option>`;
    });

    localStorage.setItem("departments", JSON.stringify(departments));
}

function addDepartment() {
    var name = document.getElementById("deptName").value;
    if (name) {
        departments.push(name);
        document.getElementById("deptName").value = "";
        displayDepartments();
    }
}

function deleteDept(i) {
    departments.splice(i, 1);
    displayDepartments();
}

/*************** FORM EMPLOYE ***************/
document.getElementById("employeeForm").addEventListener("submit", function (e) {
    e.preventDefault();

    var index = document.getElementById("editIndex").value;
    var emp = {
        nom: nom.value,
        prenom: prenom.value,
        salaire: salaire.value,
        dept: empDept.value
    };

    if (index == -1) employees.push(emp);
    else employees[index] = emp;

    this.reset();
    editIndex.value = -1;
    submitBtn.innerText = "Ajouter";

    localStorage.setItem("employees", JSON.stringify(employees));
    displayEmployees();
    updateDashboard();
});

/*************** AFFICHAGE ***************/
function displayEmployees(list = employees) {
    var tbody = document.getElementById("employeeList");
    tbody.innerHTML = "";

    list.forEach((e, i) => {
        tbody.innerHTML += `
        <tr>
            <td><b>${e.nom.toUpperCase()}</b></td>
            <td>${e.prenom}</td>
            <td>${e.dept}</td>
            <td>${e.salaire} MAD</td>
            <td>
                <button onclick="editEmployee(${i})">Editer</button>
                <button onclick="deleteEmployee(${i})">X</button>
            </td>
        </tr>`;
    });
}

function editEmployee(i) {
    var e = employees[i];
    nom.value = e.nom;
    prenom.value = e.prenom;
    salaire.value = e.salaire;
    empDept.value = e.dept;
    editIndex.value = i;
    submitBtn.innerText = "Enregistrer";
}

function deleteEmployee(i) {
    employees.splice(i, 1);
    localStorage.setItem("employees", JSON.stringify(employees));
    displayEmployees();
    updateDashboard();
}

/*************** RECHERCHE ***************/
function searchEmployee() {
    var val = document.getElementById("searchInput").value.toLowerCase();
    var filtered = employees.filter(e => e.nom.toLowerCase().includes(val));
    displayEmployees(filtered);
}

/*************** TRI (TOUJOURS DECROISSANT) ***************/
function sortByName() {
    employees.sort(function (a, b) {
        return a.nom.localeCompare(b.nom); // A → Z
    });
    displayEmployees();
}


function sortBySalary() {
    employees.sort((a, b) => b.salaire - a.salaire);
    displayEmployees();
}

/*************** DASHBOARD ***************/
function updateDashboard() {
    kpiEmployees.innerText = employees.length;
    var avg = employees.length
        ? Math.round(employees.reduce((s, e) => s + Number(e.salaire), 0) / employees.length)
        : 0;
    kpiSalary.innerText = avg + " MAD";
    createChart(avg);
}

/*************** CHART ***************/
var chart;
function createChart(avg) {
    if (chart) chart.destroy();
    chart = new Chart(chartEmployees, {
        type: "bar",
        data: {
            labels: ["Employés", "Salaire moyen"],
            datasets: [{
                data: [employees.length, avg / 50],
                backgroundColor: ["#c98f8f", "#7a9cc6"]
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

/*************** API ***************/
function importFromAPI() {
    fetch("https://randomuser.me/api/?results=3")
        .then(r => r.json())
        .then(d => {
            d.results.forEach(u => {
                employees.push({
                    nom: u.name.last,
                    prenom: u.name.first,
                    salaire: 2500,
                    dept: "RH"
                });
            });
            localStorage.setItem("employees", JSON.stringify(employees));
            displayEmployees();
            updateDashboard();
        });
}

/*************** INIT ***************/
displayDepartments();
displayEmployees();
updateDashboard();
