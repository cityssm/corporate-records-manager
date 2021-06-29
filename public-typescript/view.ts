(() => {
  const showAllFunction = (clickEvent: MouseEvent) => {

    clickEvent.preventDefault();

    const buttonPanelBlockEle = (clickEvent.currentTarget as HTMLElement).closest(".panel-block");

    const hiddenPanelBlockEles = buttonPanelBlockEle.closest(".panel").querySelectorAll(".panel-block.is-hidden");

    for (const panelBlockEle of hiddenPanelBlockEles) {
      panelBlockEle.classList.remove("is-hidden");
    }

    buttonPanelBlockEle.remove();
  };

  const showAllButtonEles = document.querySelectorAll(".is-show-all-button");

  for (const showAllButtonEle of showAllButtonEles) {
    showAllButtonEle.addEventListener("click", showAllFunction);
  }
})();
