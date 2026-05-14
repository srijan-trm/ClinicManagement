function renderMedicines(data) {

    const head = document.getElementById('table-head');
    const body = document.getElementById('table-body');

    head.innerHTML = `
    <tr>
        <th class="py-4 px-8">ID</th>
        <th class="py-4 px-8">Drug Name</th>
        <th class="py-4 px-8">Price</th>
        <th class="py-4 px-8">Stock Level</th>
    </tr>`;

    body.innerHTML = data.map(m => `
        <tr class="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">

            <td class="py-5 px-8 font-bold text-slate-400">
                #${m.medicine_id}
            </td>

            <td class="py-5 px-8 font-bold text-slate-800 text-lg">
                ${m.name}
            </td>

            <td class="py-5 px-8 text-emerald-600 font-extrabold text-lg">
                $${m.price}
            </td>

            <td class="py-5 px-8 font-bold text-lg">
                ${m.stock}
            </td>

        </tr>
    `).join('');
}