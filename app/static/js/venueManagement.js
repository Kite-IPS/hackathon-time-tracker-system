// Burger menu
document.addEventListener("DOMContentLoaded", () => {
  const burgerIcon = document.querySelector(".burgerIcon");
  const navBar = document.querySelector(".navBar");

  burgerIcon.addEventListener("click", () => {
    navBar.classList.toggle("active");
  });

  async function initialize() {
    await fetchVenues();
  }
  initialize();
});

async function fetchVenues() {
  try{
    const response = await fetch("/venue-management?format=json");

    if (!response.ok){
      throw new Error(`ERROR: $response.status`);
    }

    const venues = await response.json();
    console.log("Venues fetched:", venues);

    const venueList = document.getElementById("venueList");
    const slarVenueSelect = document.getElementById("slarVenueSelect");

    venueList.innerHTML = " " // Clear Table
    slarVenueSelect.innerHTML = `<option value = "" disabled selected>Select Venue</option>`; //Reset Dropdown 

    venues.forEach(venue => {
      // Add venue to table
      const row = document.createElement("tr");
      row.innerHTML = `<td>${venue.name}</td><td>${venue.total_capacity}</td>`;
      venueList.appendChild(row);

      //Add venue to SLAR dropdown
      const venueOption = document.createElement("option");
      venueOption.value = venue.name;
      venueOption.textContent = venue.name;
      slarVenueSelect.appendChild(venueOption);      
    });
  }
  catch (error){
      console.error("Error fetching venues:", error);
  }
}

document.addEventListener('DOMContentLoaded', async function () {
    const venueForm = document.querySelector('venueForm');
    const venueNameInput = document.getElementById('venueName');
    const venueCapacityInput = document.getElementById('venueCapacity');
    const venueList = document.getElementById('venueList');
  
    const slarForm = document.getElementById('slarForm');
    const slarNameInput = document.getElementById('slarName');
    const slarVenueSelect = document.getElementById('slarVenue');
    const expectedKeyInput = document.getElementById('expectedKey');
    const slarList = document.getElementById('slarList');
  
    // Save Venue
    venueForm.addEventListener('submit', async (event) => {
      e.preventDefault();
  
      const venueName = venueNameInput.value.trim();
      const venueCapacity = venueCapacityInput.value.trim();

      if (!venueName || !venueCapacity) {
        alert("Please fill in all fields.");
        return;
      } 
      
      try {
          const response = await fetch("/venue-management", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: venueName, total_capacity: venueCapacity })
          });
    
          if (response.ok) {
              venueNameInput.value = "";
              venueCapacityInput.value = "";
              fetchVenues(); // Refresh venue list
              console.log(venueNameInput,venueCapacityInput)
          } else {
              alert("Error saving venue.");
          }
      } catch (error) {
          console.error("Error:", error);
      }
    });
  

    // Save SLAR Unit
    slarForm.addEventListener('submit', function (e) {
      e.preventDefault();
  
      const slarName = slarNameInput.value;
      const selectedVenue = slarVenueSelect.value;
      const expectedKey = expectedKeyInput.value;
  
      // Create new row for SLAR unit
      const row = document.createElement('tr');
      row.innerHTML = `<td>${slarName}</td><td>${selectedVenue}</td><td>${expectedKey}</td>`;
  
      // Add row to table
      slarList.appendChild(row);
  
      // Clear the form fields
      slarNameInput.value = '';
      slarVenueSelect.value = '';
      expectedKeyInput.value = '';
    });
  });
  