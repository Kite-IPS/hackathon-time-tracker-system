// JS for the app

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

let data = []
let currentPage = 1;
const rowsPerPage = 5;
let filteredData = [];

function renderTable() {
  const TeamDashboard = document.getElementById("TeamDashboard");
  TeamDashboard.innerHTML = teamData
  .map(
    (item) => 
      `<tr><td>${item.total_students}</td>${item.total_teams}<td></td><td>${item.totalTime}</td></tr>`
  )


  const tableBody = document.getElementById("tableBody");
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedItems = filteredData.slice(start, end);

  tableBody.innerHTML = paginatedItems
    .map(
      (item) =>
        `<tr>
          <td>${item.teamid}</td>
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

document.getElementById("searchButton").addEventListener("click", searchTable);
document.getElementById("clearButton").addEventListener("click", clearSearch);

// Allow pressing Enter to search
document
  .getElementById("searchInput")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      searchTable();
    }
  });
