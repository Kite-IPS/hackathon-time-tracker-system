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
  

const venues = [
    { name: 'Venue 1', currentOccupancy: 50, capacity: 100 },
    { name: 'Venue 2', currentOccupancy: 30, capacity: 60 },
    { name: 'Venue 3', currentOccupancy: 40, capacity: 80 },
    { name: 'Venue 4', currentOccupancy: 20, capacity: 50 },
    { name: 'Venue 5', currentOccupancy: 10, capacity: 30 },
    { name: 'Venue 6', currentOccupancy: 60, capacity: 100 },
    { name: 'Venue 7', currentOccupancy: 25, capacity: 75 },
    { name: 'Venue 8', currentOccupancy: 70, capacity: 120 },
    { name: 'Venue 9', currentOccupancy: 90, capacity: 100 },
    { name: 'Venue 10', currentOccupancy: 45, capacity: 80 },
  ];

  const students = [
    { name: 'John Doe', team: 'Team A', currentVenue: 'Venue 1' },
    { name: 'Jane Smith', team: 'Team B', currentVenue: 'Venue 2' },
    { name: 'Alex Brown', team: 'Team A', currentVenue: 'Venue 3' },
    { name: 'Emily Davis', team: 'Team C', currentVenue: 'Venue 4' },
    { name: 'Michael Clark', team: 'Team B', currentVenue: 'Venue 5' },
    { name: 'Sarah Lee', team: 'Team C', currentVenue: 'Venue 6' },
    { name: 'David Wilson', team: 'Team A', currentVenue: 'Venue 7' },
    { name: 'Olivia Moore', team: 'Team B', currentVenue: 'Venue 8' },
    { name: 'William Johnson', team: 'Team C', currentVenue: 'Venue 9' },
    { name: 'Sophia Martinez', team: 'Team A', currentVenue: 'Venue 10' },
  ];

  const teams = [
    { team: 'Team A', students: ['John Doe', 'Alex Brown', 'David Wilson', 'Sophia Martinez'], venue: 'Venue 1' },
    { team: 'Team B', students: ['Jane Smith', 'Michael Clark', 'Olivia Moore'], venue: 'Venue 2' },
    { team: 'Team C', students: ['Emily Davis', 'Sarah Lee', 'William Johnson'], venue: 'Venue 3' },
  ];

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