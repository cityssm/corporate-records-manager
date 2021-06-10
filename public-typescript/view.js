(function () {
    var showAllFn = function (clickEvent) {
        clickEvent.preventDefault();
        var buttonPanelBlockEle = clickEvent.currentTarget.closest(".panel-block");
        var hiddenPanelBlockEles = buttonPanelBlockEle.closest(".panel").querySelectorAll(".panel-block.is-hidden");
        hiddenPanelBlockEles.forEach(function (panelBlockEle) {
            panelBlockEle.classList.remove("is-hidden");
        });
        buttonPanelBlockEle.remove();
    };
    var showAllButtonEles = document.getElementsByClassName("is-show-all-button");
    for (var index = 0; index < showAllButtonEles.length; index += 1) {
        showAllButtonEles[index].addEventListener("click", showAllFn);
    }
})();
