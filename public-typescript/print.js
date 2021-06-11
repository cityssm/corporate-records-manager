document.getElementById("is-restore-hidden-sections-button").addEventListener("click", function (clickEvent) {
    clickEvent.preventDefault();
    var sectionEles = document.getElementsByTagName("section");
    for (var index = 0; index < sectionEles.length; index += 1) {
        sectionEles[index].classList.remove("is-hidden");
    }
});
(function () {
    var hideSectionFn = function (clickEvent) {
        clickEvent.preventDefault();
        clickEvent.currentTarget.closest("section").classList.add("is-hidden");
    };
    var hideButtonEles = document.getElementsByClassName("is-hide-section-button");
    for (var index = 0; index < hideButtonEles.length; index += 1) {
        hideButtonEles[index].addEventListener("click", hideSectionFn);
    }
})();
