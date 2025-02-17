document.addEventListener('DOMContentLoaded', function () {
    const venueList = document.getElementById('venueList');
    const studentList = document.getElementById('studentList');
    const teamList = document.getElementById('teamList');

    let venues = [
        { name: "Main Hall", capacity: 100, current: 50 },
        { name: "Conference Room", capacity: 50, current: 30 },
        { name: "Workshop Area", capacity: 80, current: 20 }
    ];

    let students = [
        { name: "Alice", team: "A", venue: "Main Hall" },
        { name: "Bob", team: "B", venue: "Conference Room" },
        { name: "Charlie", team: "A", venue: "Workshop Area" },
        { name: "David", team: "C", venue: "Main Hall" }
    ];

    let teams = {};

    function updateVenueTable() {
        venueList.innerHTML = "";
        venues.forEach(venue => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${venue.name}</td>
                <td>${venue.current} / ${venue.capacity}</td>
                <td>${venue.capacity}</td>
            `;
            venueList.appendChild(row);
        });
    }

    function updateStudentTable() {
        studentList.innerHTML = "";
        students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.team}</td>
                <td>${student.venue}</td>
            `;
            studentList.appendChild(row);
        });
    }

    function updateTeamTable() {
        teamList.innerHTML = "";
        teams = {};
        students.forEach(student => {
            if (!teams[student.team]) {
                teams[student.team] = [];
            }
            teams[student.team].push(student);
        });

        for (let team in teams) {
            let studentNames = teams[team].map(s => `${s.name} (${s.venue})`).join(", ");
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${team}</td>
                <td>${studentNames}</td>
                <td>${teams[team][0].venue}</td>
            `;
            teamList.appendChild(row);
        }
    }

    function updateVenueOccupancy() {
        venues.forEach(venue => {
            venue.current = students.filter(student => student.venue === venue.name).length;
        });
        updateVenueTable();
    }

    updateVenueOccupancy();
    updateStudentTable();
    updateTeamTable();
});
