(function () {
    document.getElementById("navbar-burger").addEventListener("click", function (clickEvent) {
        clickEvent.preventDefault();
        var toggleButtonEle = clickEvent.currentTarget;
        var menuEle = document.getElementById("navbar-menu");
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
