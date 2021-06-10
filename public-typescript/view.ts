(() => {

  const showAllFn = (clickEvent: MouseEvent) => {

    clickEvent.preventDefault();

    const buttonPanelBlockEle = (clickEvent.currentTarget as HTMLElement).closest(".panel-block");

    const hiddenPanelBlockEles = buttonPanelBlockEle.closest(".panel").querySelectorAll(".panel-block.is-hidden");

    hiddenPanelBlockEles.forEach((panelBlockEle) => {
      panelBlockEle.classList.remove("is-hidden");
    });

    buttonPanelBlockEle.remove();
  };

  const showAllButtonEles = document.getElementsByClassName("is-show-all-button");

  for (let index = 0; index < showAllButtonEles.length; index += 1) {
    showAllButtonEles[index].addEventListener("click", showAllFn);
  }

})();
