// Js for the app




// Burger menu

document.addEventListener("DOMContentLoaded", () => {
    const burgerIcon = document.querySelector(".burgerIcon");
    const navBar = document.querySelector(".navBar");

    burgerIcon.addEventListener("click", () => {
        navBar.classList.toggle("active");
    });
});
