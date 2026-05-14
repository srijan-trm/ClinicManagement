let currentTab = 'patients';
let currentData = []; // Stores the active tab's data for instant searching

// --- Initialization ---
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

// --- Tab & UI Logic ---
function switchTab(tab) {
    currentTab = tab;
    
    const titles = { 'patients': 'Patients', 'doctors': 'Doctors', 'appointments': 'Appointments', 'medicines': 'Pharmacy' };
    document.getElementById('page-title').textContent = titles[tab] + ' Directory';

    // Clear the search bar when switching tabs
    document.getElementById('search-bar').value = '';

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.className = "tab-btn group w-full flex items-center gap-3 py-3 px-4 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-semibold transition-all duration-200";
    });
    
    document.getElementById(`tab-${tab}`).className = "tab-btn group w-full flex items-center gap-3 py-3 px-4 rounded-xl bg-blue-100 text-blue-800 font-bold shadow-sm border border-blue-200/50 transition-all duration-200";

    loadData();
}

// --- Modal Logic ---
function openModal() {
    document.getElementById('modal-overlay').classList.remove('hidden');
    document.querySelectorAll('.form-modal').forEach(m => m.classList.add('hidden'));
    document.getElementById(`modal-${currentTab}`).classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
    document.querySelectorAll('.form-modal form').forEach(form => form.reset());
}

// --- Form Submission Logic ---
async function handleFormSubmit(event, endpoint) {
    event.preventDefault(); 
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    if(data.price) data.price = parseFloat(data.price);
    if(data.stock) data.stock = parseInt(data.stock);
    if(data.patient_id) data.patient_id = parseInt(data.patient_id);
    if(data.doctor_id) data.doctor_id = parseInt(data.doctor_id);

    const success = await api.post(endpoint, data);
    
    if (success) {
        closeModal();
        loadData(); 
    }
}

// --- Data Fetching & Live Search ---
async function loadData() {
    const body = document.getElementById('table-body');
    body.innerHTML = `<tr><td colspan="5" class="py-20 text-center text-slate-400 font-semibold text-lg">Loading data...</td></tr>`;

    // Fetch fresh data from the database and save it to our global array
    currentData = await api.get(currentTab);
    renderTable(currentData);
}

function handleSearch() {
    const query = document.getElementById('search-bar').value.toLowerCase();
    
    // Filter the currentData array. It checks every column (name, phone, status, etc.)
    const filteredData = currentData.filter(row => {
        return Object.values(row).some(val => 
            String(val).toLowerCase().includes(query)
        );
    });
    
    renderTable(filteredData);
}

// Helper to prevent the "Dr. Dr." bug
function formatDocName(name) {
    if (!name) return '';
    return name.toLowerCase().startsWith('dr') ? name : 'Dr. ' + name;
}

// --- Table Rendering Logic ---
// --- Table Rendering Logic ---
function renderTable(data) {

    const head = document.getElementById('table-head');
    const body = document.getElementById('table-body');

    if (data.length === 0) {

        body.innerHTML = `
            <tr>
                <td colspan="5" class="py-20 text-center text-slate-400 text-lg">
                    No matching records found.
                </td>
            </tr>
        `;

        return;
    }

    if (currentTab === 'patients') {

        renderPatients(data);

    }

    else if (currentTab === 'doctors') {

        renderDoctors(data);

    }

    else if (currentTab === 'appointments') {

        renderAppointments(data);

    }

    else if (currentTab === 'medicines') {

        renderMedicines(data);

    }
}
