async function openHealthProfile(patientId) {
    document.getElementById('modal-overlay').classList.remove('hidden');
    document.querySelectorAll('.form-modal').forEach(m => m.classList.add('hidden'));
    document.getElementById('modal-health').classList.remove('hidden');
    document.getElementById('health-patient-id').value = patientId;

    try {
        const response = await fetch(`/api/patient-health/${patientId}`);
        if (!response.ok) {
            clearHealthForm();
            return;
        }
        const data = await response.json();

        // Include blood_group if your API returns it here
        document.getElementById('health-blood-group').value = data.blood_group || ''; 
        document.getElementById('health-height').value = data.height_cm || '';
        document.getElementById('health-weight').value = data.weight_kg || '';
        document.getElementById('health-bp').value = data.blood_pressure || '';
        document.getElementById('health-bmi').value = data.bmi || '';
        document.getElementById('health-allergies').value = data.allergies || '';
        document.getElementById('health-conditions').value = data.chronic_conditions || '';
    } catch (error) {
        clearHealthForm();
    }
}

function clearHealthForm() {
    if(document.getElementById('health-blood-group')) document.getElementById('health-blood-group').value = '';
    document.getElementById('health-height').value = '';
    document.getElementById('health-weight').value = '';
    document.getElementById('health-bp').value = '';
    document.getElementById('health-bmi').value = '';
    document.getElementById('health-allergies').value = '';
    document.getElementById('health-conditions').value = '';
}

async function saveHealthProfile() {
    const patientId = document.getElementById('health-patient-id').value;
    const data = {
        patient_id: patientId,
        blood_group: document.getElementById('health-blood-group')?.value, // Send back blood group
        height_cm: document.getElementById('health-height').value,
        weight_kg: document.getElementById('health-weight').value,
        blood_pressure: document.getElementById('health-bp').value,
        bmi: document.getElementById('health-bmi').value,
        allergies: document.getElementById('health-allergies').value,
        chronic_conditions: document.getElementById('health-conditions').value
    };

    const success = await api.put(`patient-health/${patientId}`, data);
    if (success) {
        alert('Health profile saved successfully.');
        closeModal();
        loadData(); // Refresh table in case blood group was updated!
    }
}