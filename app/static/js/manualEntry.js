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
  
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("input[type=button]").addEventListener("click", function () {
        const rollNum = document.querySelectorAll(".inputbox input")[0].value;
        const deviceKey = document.querySelectorAll(".inputbox input")[1].value;
        
        if (!rollNum || !deviceKey) {
            alert("Please fill in both fields.");
            return;
        }

        const url = `/manual?roll_num=${encodeURIComponent(rollNum)}&device_key=${encodeURIComponent(deviceKey)}`;
        
        fetch(url, {
            method: "GET",
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.text();
        })
        .then(data => {
            alert("Response: " + data);
        })
        .catch(error => {
            alert("Error: " + error.message);
        });
    });
});