(() => {
    document.getElementById("navbar-burger").addEventListener("click", (clickEvent) => {
        clickEvent.preventDefault();
        const toggleButtonEle = clickEvent.currentTarget;
        const menuEle = document.getElementById("navbar-menu");
        menuEle.classList.toggle("is-active");
        if (menuEle.classList.contains("is-active")) {
            toggleButtonEle.setAttribute("aria-expanded", "true");
            toggleButtonEle.classList.add("is-active");
        }
        else {
            toggleButtonEle.setAttribute("aria-expanded", "false");
            toggleButtonEle.classList.remove("is-active");
        }
    });
})();
