function renderAppointments(data) {

    const head = document.getElementById('table-head');
    const body = document.getElementById('table-body');

    head.innerHTML = `
    <tr>
        <th class="py-4 px-8">Date & Time</th>
        <th class="py-4 px-8">Patient</th>
        <th class="py-4 px-8">Doctor</th>
        <th class="py-4 px-8">Status</th>
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

        </tr>
        `;

    }).join('');
}