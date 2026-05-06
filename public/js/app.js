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
function renderTable(data) {
    const head = document.getElementById('table-head');
    const body = document.getElementById('table-body');

    if (data.length === 0) {
        body.innerHTML = `<tr><td colspan="5" class="py-20 text-center text-slate-400 text-lg">No matching records found.</td></tr>`;
        return;
    }

    if (currentTab === 'patients') {
        head.innerHTML = `<tr><th class="py-4 px-8">ID</th><th class="py-4 px-8">Patient Name</th><th class="py-4 px-8">Blood</th><th class="py-4 px-8">Phone</th></tr>`;
        body.innerHTML = data.map(p => `
            <tr class="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                <td class="py-5 px-8 font-bold text-slate-400">#${p.patient_id}</td>
                <td class="py-5 px-8 font-bold text-slate-800 text-lg">${p.name} <span class="text-sm font-medium text-slate-400 ml-2">${p.gender || ''}</span></td>
                <td class="py-5 px-8"><span class="px-3 py-1.5 rounded-lg bg-rose-100 text-rose-700 text-sm font-bold shadow-sm border border-rose-200/50">${p.blood_group || '-'}</span></td>
                <td class="py-5 px-8 text-slate-600 font-medium">${p.phone}</td>
            </tr>
        `).join('');
    } 
    else if (currentTab === 'doctors') {
        head.innerHTML = `<tr><th class="py-4 px-8">ID</th><th class="py-4 px-8">Doctor Name</th><th class="py-4 px-8">Specialty</th><th class="py-4 px-8">Contact</th></tr>`;
        body.innerHTML = data.map(d => `
            <tr class="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                <td class="py-5 px-8 font-bold text-slate-400">#${d.doctor_id}</td>
                <td class="py-5 px-8 font-bold text-slate-800 text-lg">${formatDocName(d.name)}</td>
                <td class="py-5 px-8"><span class="px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold shadow-sm border border-indigo-200/50">${d.specialization || 'General'}</span></td>
                <td class="py-5 px-8 text-slate-600 font-medium">${d.phone}</td>
            </tr>
        `).join('');
    }
    else if (currentTab === 'appointments') {
        head.innerHTML = `<tr><th class="py-4 px-8">Date & Time</th><th class="py-4 px-8">Patient</th><th class="py-4 px-8">Doctor</th><th class="py-4 px-8">Status</th></tr>`;
        body.innerHTML = data.map(a => {
            const date = new Date(a.appointment_date);
            const statusColor = a.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-amber-100 text-amber-800 border-amber-300';
            return `
            <tr class="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                <td class="py-5 px-8 font-semibold text-slate-800 text-lg">${date.toLocaleDateString()} <span class="text-base text-blue-600 ml-2 font-bold">${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></td>
                <td class="py-5 px-8 font-bold text-slate-600">${a.patient_name}</td>
                <td class="py-5 px-8 font-bold text-slate-600">${formatDocName(a.doctor_name)}</td>
                <td class="py-5 px-8"><span class="px-4 py-1.5 rounded-lg border shadow-sm ${statusColor} text-sm font-bold">${a.status}</span></td>
            </tr>
        `}).join('');
    }
    else if (currentTab === 'medicines') {
        head.innerHTML = `<tr><th class="py-4 px-8">ID</th><th class="py-4 px-8">Drug Name</th><th class="py-4 px-8">Price</th><th class="py-4 px-8">Stock Level</th></tr>`;
        body.innerHTML = data.map(m => `
            <tr class="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                <td class="py-5 px-8 font-bold text-slate-400">#${m.medicine_id}</td>
                <td class="py-5 px-8 font-bold text-slate-800 text-lg">${m.name} <span class="text-sm font-medium text-slate-400 ml-2">${m.category || ''}</span></td>
                <td class="py-5 px-8 text-emerald-600 font-extrabold text-lg">$${m.price}</td>
                <td class="py-5 px-8 font-bold text-lg ${m.stock < 20 ? 'text-rose-600 bg-rose-50 px-4 py-1 rounded-lg inline-block mt-3 border border-rose-200' : 'text-slate-700'}">${m.stock}</td>
            </tr>
        `).join('');
    }
}