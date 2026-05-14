function renderDoctors(data) {

    const head = document.getElementById('table-head');
    const body = document.getElementById('table-body');

    head.innerHTML = `
    <tr>
        <th class="py-4 px-8">ID</th>
        <th class="py-4 px-8">Doctor Name</th>
        <th class="py-4 px-8">Specialty</th>
        <th class="py-4 px-8">Contact</th>
    </tr>`;

    body.innerHTML = data.map(d => `
        <tr class="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">

            <td class="py-5 px-8 font-bold text-slate-400">
                #${d.doctor_id}
            </td>

            <td class="py-5 px-8 font-bold text-slate-800 text-lg">
                ${formatDocName(d.name)}
            </td>

            <td class="py-5 px-8">
                <span class="px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold shadow-sm border border-indigo-200/50">
                    ${d.specialization || 'General'}
                </span>
            </td>

            <td class="py-5 px-8 text-slate-600 font-medium">
                ${d.phone}
            </td>

        </tr>
    `).join('');
}