document.querySelector("#is-restore-hidden-sections-button").addEventListener("click", (clickEvent) => {
    clickEvent.preventDefault();
    const sectionElements = document.querySelectorAll("section");
    for (const sectionElement of sectionElements) {
        sectionElement.classList.remove("is-hidden");
    }
});
(() => {
    const hideSectionFunction = (clickEvent) => {
        clickEvent.preventDefault();
        clickEvent.currentTarget.closest("section").classList.add("is-hidden");
    };
    const hideButtonElements = document.querySelectorAll(".is-hide-section-button");
    for (const hideButtonElement of hideButtonElements) {
        hideButtonElement.addEventListener("click", hideSectionFunction);
    }
})();
