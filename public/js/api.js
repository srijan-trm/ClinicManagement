// A central object to handle all communication with your Express API
const api = {
    // Check if the server is alive
    async checkHealth() {
        try {
            const res = await fetch('/api/patients');
            return res.ok;
        } catch {
            return false;
        }
    },

    // Fetch data from the database (GET)
    async get(endpoint) {
        try {
            const response = await fetch(`/api/${endpoint}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            return [];
        }
    },

    // Send data to the database (POST)
    async post(endpoint, data) {
        try {
            const response = await fetch(`/api/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            
            if (!response.ok) {
                alert(`Error: ${result.error || 'Failed to save record'}`);
                return false;
            }
            return true;
        } catch (error) {
            alert('Database connection error. Ensure the backend is running.');
            return false;
        }
    },
   async put(endpoint, data) {

    try {

        const response = await fetch(`/api/${endpoint}`, {

            method: 'PUT',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(data)

        });

        const result = await response.json();

        if (!response.ok) {

            alert(result.error || 'Failed to update');

            return false;
        }

        return true;

    } catch (error) {

        console.error(error);

        return false;
    }
},
async patch(endpoint, data) {

    try {

        const response = await fetch(`/api/${endpoint}`, {

            method: 'PATCH',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(data)

        });

        const result = await response.json();

        if (!response.ok) {

            alert(result.error || 'Failed to update');

            return false;
        }

        return true;

    } catch (error) {

        console.error(error);

        return false;
    }
}
}

;