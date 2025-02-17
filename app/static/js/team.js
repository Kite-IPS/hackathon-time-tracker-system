// JS for the team

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
});

//Fetch Team 
async function fetchTeam() {
  try{
    const response = await fetch("/teams"); // Fetch from Flask API
    data = await response.json();
    filteredData = [...data]; // Copy data for filtering
    renderTable();
  }
  catch (error) {
    console.error("Error fetching team data:", error);
  }
}
  

// Handle table row click navigation
document.getElementById("tableBody").addEventListener("click", function (event) {
  let targetRow = event.target.closest("tr");
  if (!targetRow) return;

  let teamId = targetRow.cells[0].innerText.trim(); // Get the team ID
  let formattedTeamId = encodeURIComponent(teamId); // Encode for URL safety

  window.location.href = `team-details?teamid=${formattedTeamId}`;
});

// Table pagination and rendering

let data=[];
let currentPage = 1;
const rowsPerPage = 10;
let filteredData = [];

function renderTable() {
  const tableBody = document.getElementById("tableBody");
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedItems = filteredData.slice(start, end);

  tableBody.innerHTML = paginatedItems
    .map(
      (item) =>
        `<tr class="clickable-row">
          <td>${item.team_id}</td>
          <td>${item.team}</td>
          <td>${item.timeSpent}</td>
          <td>${item.totalTime}</td>
        </tr>`
    )
    .join("");

  document.getElementById("pageNumber").innerText = currentPage;
  document.getElementById("prevButton").disabled = currentPage === 1;
  document.getElementById("nextButton").disabled =
    currentPage * rowsPerPage >= filteredData.length;
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderTable();
  }
}

function nextPage() {
  if (currentPage * rowsPerPage < filteredData.length) {
    currentPage++;
    renderTable();
  }
}

function searchTable() {
  let input = document.getElementById("searchInput").value.toLowerCase();
  filteredData = data.filter(
    (item) =>
      item.team.toLowerCase().includes(input) ||
      item.teamid.toLowerCase().includes(input)
  );
  currentPage = 1;
  renderTable();
}

function clearSearch() {
  document.getElementById("searchInput").value = "";
  filteredData = [...data];
  currentPage = 1;
  renderTable();
}

document.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.getElementById("searchButton");
  const clearButton = document.getElementById("clearButton");
  const searchInput = document.getElementById("searchInput");

  if (searchButton) searchButton.addEventListener("click", searchTable);
  if (clearButton) clearButton.addEventListener("click", clearSearch);

  if (searchInput) {
    searchInput.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        searchTable();
      }
    });
  }
});
