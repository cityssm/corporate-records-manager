document.querySelector("#is-restore-hidden-sections-button").addEventListener("click", (clickEvent) => {
  clickEvent.preventDefault();

  const sectionEles = document.querySelectorAll("section");

  for (const sectionEle of sectionEles) {
    sectionEle.classList.remove("is-hidden");
  }
});


(() => {
  const hideSectionFunction = (clickEvent: MouseEvent) => {
    clickEvent.preventDefault();
    (clickEvent.currentTarget as HTMLElement).closest("section").classList.add("is-hidden");
  };

  const hideButtonEles = document.querySelectorAll(".is-hide-section-button");

  for (const hideButtonEle of hideButtonEles) {
    hideButtonEle.addEventListener("click", hideSectionFunction);
  }
})();
