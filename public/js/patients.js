function renderPatients(data) {

    const head = document.getElementById('table-head');
    const body = document.getElementById('table-body');

    head.innerHTML = `
    <tr>
        <th class="py-4 px-8">ID</th>
        <th class="py-4 px-8">Patient Name</th>
        <th class="py-4 px-8">Blood</th>
        <th class="py-4 px-8">Phone</th>
        <th class="py-4 px-8">Profile</th>
    </tr>`;

    body.innerHTML = data.map(p => `
        <tr class="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">

            <td class="py-5 px-8 font-bold text-slate-400">
                #${p.patient_id}
            </td>

            <td class="py-5 px-8 font-bold text-slate-800 text-lg">
                ${p.name}
                <span class="text-sm font-medium text-slate-400 ml-2">
                    ${p.gender || ''}
                </span>
            </td>

            <td class="py-5 px-8">
                <span class="px-3 py-1.5 rounded-lg bg-rose-100 text-rose-700 text-sm font-bold shadow-sm border border-rose-200/50">
                    ${p.blood_group || '-'}
                </span>
            </td>

            <td class="py-5 px-8 text-slate-600 font-medium">
                ${p.phone}
            </td>

            <td class="py-5 px-8">

    <div class="flex gap-2">

        <button
            onclick="openHealthProfile(${p.patient_id})"
            class="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-semibold hover:bg-indigo-200 transition"
        >
            View Profile
        </button>

        <button
            onclick="openAppointmentBooking(${p.patient_id})"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
            Book Appointment
        </button>

    </div>

</td>

        </tr>
    `).join('');
}