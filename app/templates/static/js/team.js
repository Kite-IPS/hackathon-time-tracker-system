// Js for the app

// Burger menu

document.addEventListener("DOMContentLoaded", () => {
    const burgerIcon = document.querySelector(".burgerIcon");
    const navBar = document.querySelector(".navBar");
  
    burgerIcon.addEventListener("click", () => {
      navBar.classList.toggle("active");
    });
  });
  
  // Table pagination
  
  const data = [
    { team: "Team 1", timeSpent: "15 hrs", totalTime: "130 hrs" },
    { team: "Team 2", timeSpent: "12 hrs", totalTime: "130 hrs" },
    { team: "Team 3", timeSpent: "20 hrs", totalTime: "130 hrs" },
    { team: "Team 4", timeSpent: "10 hrs", totalTime: "130 hrs" },
    { team: "Team 5", timeSpent: "8 hrs", totalTime: "130 hrs" },
    { team: "Team 6", timeSpent: "18 hrs", totalTime: "130 hrs" },
    { team: "Team 7", timeSpent: "14 hrs", totalTime: "130 hrs" },
    { team: "Team 8", timeSpent: "11 hrs", totalTime: "130 hrs" },
    { team: "Team 9", timeSpent: "16 hrs", totalTime: "130 hrs" },
    { team: "Team 10", timeSpent: "9 hrs", totalTime: "130 hrs" },
  ];
  
  let currentPage = 1;
  const rowsPerPage = 10;
  let filteredData = [...data];
  
  function renderTable() {
    const tableBody = document.getElementById("tableBody");
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedItems = filteredData.slice(start, end);
  
    tableBody.innerHTML = paginatedItems
      .map(
        (item) =>
          `<tr><td>${item.team}</td><td>${item.timeSpent}</td><td>${item.totalTime}</td></tr>`
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
    filteredData = data.filter((item) => item.team.toLowerCase().includes(input));
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
  
  document.addEventListener("DOMContentLoaded", renderTable);
  