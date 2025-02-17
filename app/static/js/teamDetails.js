// JS for team details
// Burger menu
document.addEventListener("DOMContentLoaded", () => {
    const burgerIcon = document.querySelector(".burgerIcon");
    const navBar = document.querySelector(".navBar");

    burgerIcon.addEventListener("click", () => {
        navBar.classList.toggle("active");
    });
    async function initialize() {
        await fetch_teamDetails();
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const teamId = urlParams.get("teamId"); // Get teamId from URL

    if (teamId) {
        await fetch_teamDetails(teamId); // Pass teamId to the function
    }
});

// Fetch Team Details
async function fetch_teamDetails() {
    try{
        const response = await fetch(`/team-details?teamId=${teamId}`) // Fetch from flask API
        const data = await response.json();
        filteredData = [...data]; // Copy data for filtering

        if (data.error){
            console.error("Error:", data.error);
            return;
        }
        renderTable(data.students);
    }
    catch(error){
        console.error("Error fetching team details", error);
    }

}



// Table rendering function
function renderTable() {
    const tableBody = document.getElementById("tableBody");

    if (!teamData) return;

    if (!tableBody) return;

    tableBody.innerHTML = studentData
        .map(
            (item) =>
                `<tr><td>${item.studentName}</td><td>${item.rollNum}</td><td>${item.timeSpent}</td><td>${item.totalTime}</td><td>${item.status}</td></tr>`
        )
        .join("");
}

// Call renderTable when the page loads
document.addEventListener("DOMContentLoaded", renderTable);
