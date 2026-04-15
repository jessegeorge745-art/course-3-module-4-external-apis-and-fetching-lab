// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!


// Grab the elements from the HTML that we need to interact with
const fetchButton = document.getElementById("fetch-alerts");
const stateInput  = document.getElementById("state-input");
const alertsDisplay = document.getElementById("alerts-display");
const errorMessage  = document.getElementById("error-message");


// ── Helper: show an error message to the user ──────────────────────
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden"); // make it visible
}

// ── Helper: clear any previous error message ───────────────────────
function clearError() {
  errorMessage.textContent = "";
  errorMessage.classList.add("hidden"); // hide it again
}

// ── Helper: clear previous alert results ──────────────────────────
function clearAlerts() {
  alertsDisplay.innerHTML = "";
}


// ── Main function: runs when the button is clicked ─────────────────
async function getWeatherAlerts() {

  // 1. Read what the user typed and remove extra spaces
  const stateCode = stateInput.value.trim().toUpperCase();

  // 2. Clear old results and errors before showing new ones
  clearAlerts();
  clearError();

  // 3. Check the input is not empty
  if (!stateCode) {
    showError(" Please enter a state abbreviation (e.g. CA, TX).");
    return; // stop here — don't call the API
  }

  // 4. Check it's exactly 2 letters (basic validation)
  if (stateCode.length !== 2 || !/^[A-Z]+$/.test(stateCode)) {
    showError(" Please enter a valid 2-letter state code (e.g. FL, NY).");
    return;
  }

  // 5. Show a loading message while we wait for the API
  alertsDisplay.innerHTML = "<p>⏳ Loading alerts...</p>";

  try {
    // 6. Call the NWS API with the state code appended to the URL
    const response = await fetch(weatherApi + stateCode, {
      headers: {
        // NWS requires this header — use your own app name/email
        "User-Agent": "WeatherAlertsApp (contact@example.com)"
      }
    });

    // 7. If the server returned an error (e.g. 404, 500), throw an error
    if (!response.ok) {
      throw new Error(Server error: ${response.status});
    }

    // 8. Convert the response to a JavaScript object (parse the JSON)
    const data = await response.json();

    // 9. The alerts are inside the "features" array
    const alerts = data.features;

    // 10. Clear the "loading" message now that data has arrived
    alertsDisplay.innerHTML = "";

    // 11. Edge case: API worked but no alerts exist for this state
    if (alerts.length === 0) {
      alertsDisplay.innerHTML = "<p> No active weather alerts for this state.</p>";
      return;
    }

    // 12. Loop through each alert and display it on the page
    alerts.forEach(function(alert) {
      // NWS puts all the useful info inside "properties"
      const props = alert.properties;

      const headline  = props.headline  || props.event || "Weather Alert";
      const severity  = props.severity  || "Unknown";
      const area      = props.areaDesc  || "N/A";

      // Create a <div> card for each alert
      const card = document.createElement("div");
      card.classList.add("alert-card");

      // Fill the card with alert info
      card.innerHTML = `
        <h3>${headline}</h3>
        <p><strong>Severity:</strong> ${severity}</p>
        <p><strong>Area:</strong> ${area}</p>
      `;

      // Add the card to the alerts display section
      alertsDisplay.appendChild(card);
    });

  } catch (error) {
    // 13. If anything went wrong (network down, bad response, etc.)
    clearAlerts();
    showError(" Could not fetch alerts. Check your connection and try again.");
    console.error("Fetch error:", error); // log details for debugging
  }
}


// ── Attach the click event to the button ──────────────────────────
fetchButton.addEventListener("click", getWeatherAlerts);

// ── Also allow pressing Enter in the input field ──────────────────
stateInput.addEventListener("keydown",)


