// Burger menu
document.addEventListener("DOMContentLoaded", () => {
  const burgerIcon = document.querySelector(".burgerIcon");
  const navBar = document.querySelector(".navBar");

  burgerIcon.addEventListener("click", () => {
    navBar.classList.toggle("active");
  });

  async function initialize() {
    await fetchTeam();
  }
  initialize();
});


document.addEventListener('DOMContentLoaded', function () {
    const venueForm = document.getElementById('venueForm');
    const venueNameInput = document.getElementById('venueName');
    const venueCapacityInput = document.getElementById('venueCapacity');
    const venueList = document.getElementById('venueList');
  
    const slarForm = document.getElementById('slarForm');
    const slarNameInput = document.getElementById('slarName');
    const slarVenueSelect = document.getElementById('slarVenue');
    const expectedKeyInput = document.getElementById('expectedKey');
    const slarList = document.getElementById('slarList');
  
    // Save Venue
    venueForm.addEventListener('submit', function (e) {
      e.preventDefault();
  
      const venueName = venueNameInput.value;
      const venueCapacity = venueCapacityInput.value;
  
      // Create new row for venue
      const row = document.createElement('tr');
      row.innerHTML = `<td>${venueName}</td><td>${venueCapacity}</td>`;
  
      // Add row to table
      venueList.appendChild(row);
  
      // Add the new venue option to the SLAR form dropdown
      const venueOption = document.createElement('option');
      venueOption.value = venueName;
      venueOption.textContent = venueName;
      slarVenueSelect.appendChild(venueOption);
  
      // Clear the form fields
      venueNameInput.value = '';
      venueCapacityInput.value = '';
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
  