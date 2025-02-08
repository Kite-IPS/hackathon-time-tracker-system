// Burger menu
document.addEventListener("DOMContentLoaded", () => {
    const burgerIcon = document.querySelector(".burgerIcon");
    const navBar = document.querySelector(".navBar");

    burgerIcon.addEventListener("click", () => {
        navBar.classList.toggle("active");
    });

    renderTable(); // Ensure the table renders on page load
});

// Mock data for team details table
const studentData = [
    { studentName: "John Doe", timeSpent: "15 hrs", totalTime: "130 hrs" },
    { studentName: "Jane Smith", timeSpent: "12 hrs", totalTime: "130 hrs" },
    { studentName: "Alice Johnson", timeSpent: "20 hrs", totalTime: "130 hrs" },
    { studentName: "Bob Brown", timeSpent: "10 hrs", totalTime: "130 hrs" },
    { studentName: "Charlie White", timeSpent: "8 hrs", totalTime: "130 hrs" },
    { studentName: "David Black", timeSpent: "18 hrs", totalTime: "130 hrs" },
];


// Table rendering function
function renderTable() {
    const tableBody = document.getElementById("tableBody");

    if (!tableBody) return;

    tableBody.innerHTML = studentData
        .map(
            (item) =>
                `<tr><td>${item.studentName}</td><td>${item.timeSpent}</td><td>${item.totalTime}</td></tr>`
        )
        .join("");
}

// Call renderTable when the page loads
document.addEventListener("DOMContentLoaded", renderTable);
