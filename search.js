(function () {
  function setupSearch() {
    const searchBox = document.querySelector("#site-header .search-box");
    if (!searchBox || searchBox.dataset.ready === "true") {
      return;
    }

    searchBox.innerHTML = `
      <button class="search-toggle" type="button" aria-label="Abrir buscador" aria-expanded="false">🔍</button>
      <input class="site-search-input" type="search" placeholder="¿Has encontrado lo que buscabas?" aria-label="Buscar en esta página" hidden>
    `;
    searchBox.dataset.ready = "true";

    const toggle = searchBox.querySelector(".search-toggle");
    const input = searchBox.querySelector(".site-search-input");
    const searchableSelector = [
      ".content p", ".content li", ".content tr", ".content .poem-line",
      ".content h1", ".content h2", ".content h3", ".content h4",
      ".container p", ".container li", ".container tr", ".container .poem-line",
      ".container h1", ".container h2", ".container h3", ".container h4",
    ].join(", ");

    function filterContent() {
      const query = input.value.trim().toLocaleLowerCase();
      document.querySelectorAll(searchableSelector).forEach((element) => {
        const matches = !query || element.textContent.toLocaleLowerCase().includes(query);
        element.classList.toggle("search-filter-hidden", !matches);
      });
    }

    function closeSearch() {
      input.value = "";
      input.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir buscador");
      filterContent();
    }

    toggle.addEventListener("click", () => {
      if (!input.hidden) {
        closeSearch();
        return;
      }

      input.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Cerrar buscador");
      input.focus();
    });

    input.addEventListener("input", filterContent);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeSearch();
        toggle.focus();
      }
    });
  }

  function observeHeader() {
    const header = document.getElementById("site-header");
    if (!header) {
      return;
    }

    setupSearch();
    new MutationObserver(setupSearch).observe(header, {
      childList: true,
      subtree: true,
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", observeHeader, { once: true });
  } else {
    observeHeader();
  }
})();
