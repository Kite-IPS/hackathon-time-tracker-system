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
  initialize();
});

async function fetchTeam() {
  console.log("Fetching");
  try{
    const response = await fetch("/"); // Fetch from Flask API
    console.log("Response recieved");
    const fetchedData = await response.json();
    
    console.log("Fetched Data:", fetchedData)

    data = [...fetchedData];
    filteredData = [...fetchedData];
    renderTable();
    console.error("Data is not an array!");

  }
  catch (error){
    return;
  }
} 

let data = []
let currentPage = 1;
const rowsPerPage = 5;
filteredData = [];

function renderTable() {
  const tableBody = document.getElementById("tableBody");
  if (!tableBody) return;
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
  const input = document.getElementById("searchInput").value.trim().toLowerCase();
  if (!input) return;
  filteredData = data.filter(
    (item) =>
      item.teamid.trim().toLowerCase().includes(input) ||
      item.team.trim().toLowerCase().includes(input)
  );
  console.log(filteredData)
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


