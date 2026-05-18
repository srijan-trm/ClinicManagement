function renderAppointments(data) {
    const head = document.getElementById('table-head');
    const body = document.getElementById('table-body');

    head.innerHTML = `
    <tr>
        <th class="py-4 px-8">Date & Time</th>
        <th class="py-4 px-8">Patient</th>
        <th class="py-4 px-8">Doctor</th>
       <th class="py-4 px-8">Status</th>
       <th class="py-4 px-8">Actions</th>
    </tr>`;

    body.innerHTML = data.map(a => {
        const date = new Date(a.appointment_date);

        const statusColor =
            a.status === 'Completed'
            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
            : 'bg-amber-100 text-amber-800 border-amber-300';

        return `
        <tr class="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
            <td class="py-5 px-8 font-semibold text-slate-800 text-lg">
                ${date.toLocaleDateString()}
            </td>
            <td class="py-5 px-8 font-bold text-slate-600">
                ${a.patient_name}
            </td>
            <td class="py-5 px-8 font-bold text-slate-600">
                ${formatDocName(a.doctor_name)}
            </td>
            <td class="py-5 px-8">
                <span class="px-4 py-1.5 rounded-lg border shadow-sm ${statusColor} text-sm font-bold">
                    ${a.status}
                </span>
            </td>
            <td class="py-5 px-8">
                <div class="flex gap-2">
                    <button
                        onclick="openHealthProfile(${a.patient_id})"
                        class="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg font-semibold hover:bg-emerald-200 transition"
                    >
                        Patient Info
                    </button>
                    <button
                        onclick="markAppointmentCompleted(${a.appointment_id})"
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        Complete
                    </button>
                    <button onclick="deleteRecord('appointments', ${a.appointment_id})" class="px-4 py-2 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 transition">
                    Delete
                    </button>
                </div>
            </td>
        </tr>
        `;
    }).join('');
}

async function markAppointmentCompleted(appointmentId) {
    const success = await api.patch(
        `appointments/${appointmentId}/status`,
        {
            status: 'Completed'
        }
    );

    if (success) {
        loadData();
    }
}