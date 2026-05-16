async function openHealthProfile(patientId) {

    document.getElementById('modal-overlay').classList.remove('hidden');

    document.querySelectorAll('.form-modal').forEach(m => {
        m.classList.add('hidden');
    });

    document.getElementById('modal-health').classList.remove('hidden');

    document.getElementById('health-patient-id').value = patientId;

    try {

        const response = await fetch(`/api/patient-health/${patientId}`);

        if (!response.ok) {
            clearHealthForm();
            return;
        }

        const data = await response.json();

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

    }
}
async function openAppointmentBooking(patientId) {

    document.getElementById('modal-overlay').classList.remove('hidden');

    document.querySelectorAll('.form-modal').forEach(m => {
        m.classList.add('hidden');
    });

    document.getElementById('modal-appointments').classList.remove('hidden');

    document.querySelector('#form-appointments input[name="patient_id"]').value = patientId;
}