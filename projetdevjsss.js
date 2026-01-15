/*************** DONNÉES ***************/
var employees = JSON.parse(localStorage.getItem("employees"));
if (employees === null) {
    employees = [];
}

var departments = JSON.parse(localStorage.getItem("departments"));
if (departments === null) {
    departments = ["RH", "Marketing", "Design"];
}

/*************** NAVIGATION ***************/
function showSection(id) {
    var sections = document.querySelectorAll(".section");
    for (var i = 0; i < sections.length; i++) {
        sections[i].classList.remove("active");
    }
    document.getElementById(id).classList.add("active");
    document.getElementById("page-title").innerText = id;
}

/*************** DÉPARTEMENTS ***************/
function displayDepartments() {
    var list = document.getElementById("departmentList");
    var select = document.getElementById("empDept");

    list.innerHTML = "";
    select.innerHTML = "<option value=''>Choisir un département</option>";

    for (var i = 0; i < departments.length; i++) {
        list.innerHTML += "<li>" + departments[i] +
            " <button onclick='deleteDept(" + i + ")'>Supprimer</button></li>";
        select.innerHTML += "<option>" + departments[i] + "</option>";
    }

    localStorage.setItem("departments", JSON.stringify(departments));
}

function addDepartment() {
    var name = document.getElementById("deptName").value;
    if (name !== "") {
        departments.push(name);
        document.getElementById("deptName").value = "";
        displayDepartments();
    }
}

function deleteDept(index) {
    if (confirm("Supprimer ce pôle ?")) {
        departments.splice(index, 1);
        displayDepartments();
    }
}

/*************** FORMULAIRE EMPLOYÉ ***************/
document.getElementById("employeeForm").addEventListener("submit", function (e) {
    e.preventDefault();

    var index = document.getElementById("editIndex").value;

    var emp = {
        nom: document.getElementById("nom").value,
        prenom: document.getElementById("prenom").value,
        salaire: document.getElementById("salaire").value,
        dept: document.getElementById("empDept").value
    };

    if (index == "-1") {
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

/*************** AFFICHAGE EMPLOYÉS ***************/
function displayEmployees() {
    var list = document.getElementById("employeeList");
    list.innerHTML = "";

    for (var i = 0; i < employees.length; i++) {
        list.innerHTML +=
            "<tr>" +
            "<td><b>" + employees[i].nom.toUpperCase() + "</b></td>" +
            "<td>" + employees[i].prenom + "</td>" +
            "<td>" + employees[i].dept + "</td>" +
            "<td>" + employees[i].salaire + " €</td>" +
            "<td>" +
            "<button onclick='editEmployee(" + i + ")'>Editer</button> " +
            "<button onclick='deleteEmployee(" + i + ")'>X</button>" +
            "</td></tr>";
    }
}

/*************** MODIFIER / SUPPRIMER ***************/
function editEmployee(i) {
    document.getElementById("nom").value = employees[i].nom;
    document.getElementById("prenom").value = employees[i].prenom;
    document.getElementById("salaire").value = employees[i].salaire;
    document.getElementById("empDept").value = employees[i].dept;
    document.getElementById("editIndex").value = i;
    document.getElementById("submitBtn").innerText = "Enregistrer";
}

function deleteEmployee(i) {
    if (confirm("Supprimer cette fiche ?")) {
        employees.splice(i, 1);
        localStorage.setItem("employees", JSON.stringify(employees));
        displayEmployees();
        updateDashboard();
    }
}

/*************** RECHERCHE ***************/
function searchEmployee() {
    var filter = document.getElementById("search").value.toLowerCase();
    var rows = document.querySelectorAll("#employeeList tr");

    for (var i = 0; i < rows.length; i++) {
        if (rows[i].innerText.toLowerCase().indexOf(filter) > -1) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }
    }
}

/*************** DASHBOARD ***************/
function updateDashboard() {
    document.getElementById("kpiEmployees").innerText = employees.length;

    var total = 0;
    for (var i = 0; i < employees.length; i++) {
        total += Number(employees[i].salaire);
    }

    var avg = 0;
    if (employees.length > 0) {
        avg = Math.round(total / employees.length);
    }

    document.getElementById("kpiSalary").innerText = avg + " €";
    createChart(avg);
}

/*************** GRAPHIQUE ***************/
var chart = null;

var chart = null;

function createChart(avg) {
    if (chart) chart.destroy();

    chart = new Chart(document.getElementById("chartEmployees"), {
        type: "bar",
        data: {
            labels: ["Effectif", "Salaire Moyen"],
            datasets: [{
                label: 'Statistiques RH',
                data: [employees.length, avg / 50], // diviser salaire pour rendre visible
                backgroundColor: ["#f5d5d5", "#d4e1f5"]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}


/*************** IMPORT API ***************/
function importFromAPI() {
    fetch("https://randomuser.me/api/?results=3")
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            for (var i = 0; i < data.results.length; i++) {
                employees.push({
                    nom: data.results[i].name.last,
                    prenom: data.results[i].name.first,
                    salaire: 2500,
                    dept: "RH"
                });
            }
            localStorage.setItem("employees", JSON.stringify(employees));
            displayEmployees();
            updateDashboard();
        });
}

/*************** INITIALISATION ***************/
displayDepartments();
displayEmployees();
updateDashboard();
