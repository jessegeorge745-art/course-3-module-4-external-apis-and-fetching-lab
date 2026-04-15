const button = document.getElementById('fetch-alerts');
const input = document.getElementById('state-input');
const display = document.getElementById('alerts-display');
const errorMessage = document.getElementById('error-message');

button.addEventListener('click', async () => {
    const state = input.value.trim().toUpperCase();

    // Clear previous results
    display.innerHTML = '';
    errorMessage.textContent = '';
    errorMessage.classList.add('hidden');

    if (!state) {
        showError('Please enter a state abbreviation.');
        return;
    }

    try {
        const response = await fetch(`https://api.weather.gov/alerts/active?area=${state}`);

        if (!response.ok) {
            throw new Error('Failed to fetch alerts.');
        }

        const data = await response.json();

        if (data.features.length === 0) {
            display.innerHTML = `<p>No active alerts for ${state}</p>`;
            return;
        }

        // Display alerts
        data.features.forEach(alert => {
            const alertDiv = document.createElement('div');
            alertDiv.classList.add('alert');

            alertDiv.innerHTML = `
                <h3>${alert.properties.headline}</h3>
                <p>${alert.properties.description}</p>
            `;

            display.appendChild(alertDiv);
        });

    } catch (error) {
        showError(error.message);
    }
});

// Helper function
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}