let currentTab = 'patients';
let currentData = [];

document.addEventListener('DOMContentLoaded', async () => {
    const isAlive = await api.checkHealth();
    const statusEl = document.getElementById('server-status');

    if (isAlive) {
        statusEl.className = "text-sm px-4 py-2 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 font-bold flex items-center gap-2 shadow-sm";
        statusEl.innerHTML = `<div class="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-300"></div> System Online`;
        switchTab('patients'); 
    } else {
        statusEl.className = "text-sm px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 font-bold flex items-center gap-2 shadow-sm";
        statusEl.innerHTML = `<div class="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-300"></div> System Offline`;
    }
});

function switchTab(tab) {
    currentTab = tab;
    
    // 1. Update Page Title
    const titles = { 'patients': 'Patients', 'doctors': 'Doctors', 'appointments': 'Appointments' };
    document.getElementById('page-title').textContent = titles[tab] + ' Directory';

    // 2. Update the Add Button Text
    const addBtnText = document.getElementById('add-btn-text');
    if (addBtnText) {
        if (tab === 'patients') addBtnText.textContent = 'Add New Patient';
        if (tab === 'doctors') addBtnText.textContent = 'Add New Doctor';
        if (tab === 'appointments') addBtnText.textContent = 'Add New Appointment';
    }

    // 3. Clear Search & Reset Tabs
    document.getElementById('search-bar').value = '';
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.className = "tab-btn group w-full flex items-center gap-3 py-3 px-4 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-semibold transition-all duration-200";
    });
    
    const activeTab = document.getElementById(`tab-${tab}`);
    if (activeTab) {
        activeTab.className = "tab-btn group w-full flex items-center gap-3 py-3 px-4 rounded-xl bg-blue-100 text-blue-800 font-bold shadow-sm border border-blue-200/50 transition-all duration-200";
    }

    loadData();
}

function openModal() {
    document.getElementById('modal-overlay').classList.remove('hidden');
    document.querySelectorAll('.form-modal').forEach(m => m.classList.add('hidden'));
    document.getElementById(`modal-${currentTab}`).classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
    document.querySelectorAll('.form-modal form').forEach(form => form.reset());
}

async function handleFormSubmit(event, endpoint) {
    event.preventDefault(); 
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    if(data.patient_id) data.patient_id = parseInt(data.patient_id);
    if(data.doctor_id) data.doctor_id = parseInt(data.doctor_id);

    const success = await api.post(endpoint, data);
    if (success) {
        closeModal();
        loadData(); 
    }
}

async function loadData() {
    const body = document.getElementById('table-body');
    body.innerHTML = `<tr><td colspan="5" class="py-20 text-center text-slate-400 font-semibold text-lg">Loading data...</td></tr>`;
    currentData = await api.get(currentTab);
    renderTable(currentData);
}

function handleSearch() {
    const query = document.getElementById('search-bar').value.toLowerCase();
    const filteredData = currentData.filter(row => {
        return Object.values(row).some(val => String(val).toLowerCase().includes(query));
    });
    renderTable(filteredData);
}

function formatDocName(name) {
    if (!name) return '';
    return name.toLowerCase().startsWith('dr') ? name : 'Dr. ' + name;
}

function renderTable(data) {
    const body = document.getElementById('table-body');
    if (data.length === 0) {
        body.innerHTML = `<tr><td colspan="5" class="py-20 text-center text-slate-400 text-lg">No matching records found.</td></tr>`;
        return;
    }

    if (currentTab === 'patients') renderPatients(data);
    else if (currentTab === 'doctors') renderDoctors(data);
    else if (currentTab === 'appointments') renderAppointments(data);
}

async function deleteRecord(endpoint, id) {
    // 1. Double check with a confirmation box before dropping table records
    const confirmation = confirm(`Are you sure you want to permanently delete this record from ${endpoint}?`);
    if (!confirmation) return;

    try {
        // 2. Fire an HTTP DELETE request to your backend API route layout
        const response = await fetch(`/api/${endpoint}/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message || 'Record successfully removed from the database!');
            loadData(); // Re-fetch data instantly to update the view grid matrix smoothly
        } else {
            // 3. This catches the 23503 foreign-key constraint alerts we configured!
            alert(`Database Protection Error: ${result.error}`);
        }
    } catch (error) {
        console.error("Deletion Failed:", error);
        alert("Server error occurred while executing deletion query.");
    }
}