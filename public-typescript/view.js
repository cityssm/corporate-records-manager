(() => {
    const showAllFunction = (clickEvent) => {
        clickEvent.preventDefault();
        const buttonPanelBlockElement = clickEvent.currentTarget.closest(".panel-block");
        const hiddenPanelBlockElements = buttonPanelBlockElement.closest(".panel").querySelectorAll(".panel-block.is-hidden");
        for (const panelBlockElement of hiddenPanelBlockElements) {
            panelBlockElement.classList.remove("is-hidden");
        }
        buttonPanelBlockElement.remove();
    };
    const showAllButtonElements = document.querySelectorAll(".is-show-all-button");
    for (const showAllButtonElement of showAllButtonElements) {
        showAllButtonElement.addEventListener("click", showAllFunction);
    }
})();
