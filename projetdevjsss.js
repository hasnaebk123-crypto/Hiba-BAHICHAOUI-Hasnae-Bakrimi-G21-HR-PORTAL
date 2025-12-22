class HRManager {
    constructor() {
        this.employees = JSON.parse(localStorage.getItem('talents')) || [];
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        console.log("L'Atelier RH : Initialisation...");
        this.setupNavigation();
        this.setupEventListeners();
        this.render();
        
        const dateEl = document.getElementById('date-display');
        if(dateEl) {
            dateEl.innerText = new Date().toLocaleDateString('fr-FR', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            });
        }
    }

    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        const sections = document.querySelectorAll('.page-section');

        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.target;
                sections.forEach(s => s.classList.add('hidden'));
                const targetSection = document.getElementById(target);
                if(targetSection) targetSection.classList.remove('hidden');

                navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const titleEl = document.getElementById('page-title');
                if(titleEl) titleEl.textContent = btn.innerText.trim();
            });
        });
    }

    setupEventListeners() {
        const modal = document.getElementById('modal-overlay');
        const btnAdd = document.getElementById('btn-add');
        const btnClose = document.getElementById('btn-close');
        const form = document.getElementById('hr-form');

        
        if (btnAdd && modal) {
            btnAdd.addEventListener('click', () => modal.classList.remove('hidden'));
        }
        if (btnClose && modal) {
            btnClose.addEventListener('click', () => modal.classList.add('hidden'));
        }
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addEmployee();
                if(modal) modal.classList.add('hidden');
                form.reset();
            });
        }
    }

    addEmployee() {
        const nameVal = document.getElementById('emp-name').value;
        const roleVal = document.getElementById('emp-role').value;
        const depVal = document.getElementById('emp-dep').value;
        const salaryVal = document.getElementById('emp-salary').value;

        const newEmployee = {
            id: Date.now().toString(),
            name: nameVal,
            role: roleVal,
            dep: depVal,
            salary: salaryVal
        };

        this.employees.push(newEmployee);
        this.save();
        this.render();
    }

    delete(id) {
        if(confirm("Retirer ce talent de l'Atelier ?")) {
            this.employees = this.employees.filter(emp => emp.id !== id);
            this.save();
            this.render();
        }
    }

    save() {
        localStorage.setItem('talents', JSON.stringify(this.employees));
    }

    render() {
        const tbody = document.getElementById('emp-body');
        if (!tbody) return;

        tbody.innerHTML = this.employees.map(emp => `
            <tr>
                <td><strong>${emp.name}</strong></td>
                <td>${emp.role}</td>
                <td><span class="badge-dep">${emp.dep}</span></td>
                <td>${Number(emp.salary).toLocaleString()} €</td>
                <td>
                    <button class="btn-table delete" onclick="hr.delete('${emp.id}')">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        this.updateKPIs();
    }

    updateKPIs() {
        const totalEmp = document.getElementById('total-emp');
        const totalBudget = document.getElementById('total-budget');

        if (totalEmp) totalEmp.innerText = this.employees.length;
        if (totalBudget) {
            const sum = this.employees.reduce((acc, emp) => acc + Number(emp.salary), 0);
            totalBudget.innerText = sum.toLocaleString() + ' €';
        }
    }
}


const hr = new HRManager();