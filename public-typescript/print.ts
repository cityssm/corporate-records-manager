document.getElementById("is-restore-hidden-sections-button").addEventListener("click", (clickEvent) => {
  clickEvent.preventDefault();

  const sectionEles = document.getElementsByTagName("section");

  for (let index = 0; index < sectionEles.length; index += 1) {
    sectionEles[index].classList.remove("is-hidden");
  }
});

(() => {
  const hideSectionFn = (clickEvent: MouseEvent) => {
    clickEvent.preventDefault();
    (clickEvent.currentTarget as HTMLElement).closest("section").classList.add("is-hidden");
  };

  const hideButtonEles = document.getElementsByClassName("is-hide-section-button");

  for (let index = 0; index < hideButtonEles.length; index += 1) {
    hideButtonEles[index].addEventListener("click", hideSectionFn);
  }
})();
