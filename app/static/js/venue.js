// Burger menu
document.addEventListener("DOMContentLoaded", () => {
    const burgerIcon = document.querySelector(".burgerIcon");
    const navBar = document.querySelector(".navBar");
  
    burgerIcon.addEventListener("click", () => {
      navBar.classList.toggle("active");
    });
  
    async function initialize() {
      await fetchVenueData();
    }
    initialize();
  });
  
  async function fetchVenueData() {
    try{
      const response = await fetch("/venue");
      const data = await response.json();

      updateTableData(data.venues, "venueList", venuePage)
      updateTableData(data.students, "studentList", studentPage);
      updateTableData(data.teams, "teamList", teamPage);
    } catch (error) {
      console.error("Error fetching venue data:", error);
    }
  }

  // Pagination Logic
  const itemsPerPage = 5;
  let venuePage = 1;
  let studentPage = 1;
  let teamPage = 1;

  function paginateData(data, page) {
    return data.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  }

  function renderTable(data, tableId) {
    const tableBody = document.getElementById(tableId);
    tableBody.innerHTML = '';
    data.forEach(item => {
      const row = document.createElement('tr');
      Object.values(item).forEach(value => {
        const td = document.createElement('td');
        td.textContent = value;
        row.appendChild(td);
      });
      tableBody.appendChild(row);
    });
  }

  function renderPagination(data, tableId, page) {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const paginationContainer = document.getElementById(`${tableId}-pagination`);
    paginationContainer.innerHTML = '';

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.disabled = page === 1;
    prevButton.onclick = () => updateTableData(data, tableId, page - 1);
    paginationContainer.appendChild(prevButton);

    // Page indicator (showing only current page number)
    const pageIndicator = document.createElement('input');
    pageIndicator.type = 'text';
    pageIndicator.value = `${page} / ${totalPages}`;
    pageIndicator.readOnly = true;
    pageIndicator.classList.add('page-indicator');
    paginationContainer.appendChild(pageIndicator);

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.disabled = page === totalPages;
    nextButton.onclick = () => updateTableData(data, tableId, page + 1);
    paginationContainer.appendChild(nextButton);
  }

  function updateTableData(data, tableId, page) {
    if (tableId === 'venueList') venuePage = page;
    if (tableId === 'studentList') studentPage = page;
    if (tableId === 'teamList') teamPage = page;

    const paginatedData = paginateData(data, page);
    renderTable(paginatedData, tableId);
    renderPagination(data, tableId, page);
  }

  // Initial rendering for each table
  window.onload = () => {
    updateTableData(venues, 'venueList', venuePage);
    updateTableData(students, 'studentList', studentPage);
    updateTableData(teams, 'teamList', teamPage);
  };