function createPageNavigationButton(direction, link) {
    const isPrevious = direction === "prev";
    const element = link ? document.createElement("a") : document.createElement("span");

    element.className = `page-nav-button page-nav-button--${direction}${link ? "" : " page-nav-button--disabled"}`;

    if (link) {
        element.href = link.href;
    } else {
        element.setAttribute("aria-disabled", "true");
    }

    element.innerHTML = isPrevious
        ? '<span aria-hidden="true">&lt;</span><span>Previous</span>'
        : '<span>Next</span><span aria-hidden="true">&gt;</span>';

    return element;
}

function addPageNavigationButtons() {
    if (document.querySelector(".page-nav-buttons")) {
        return;
    }

    const previousLink = document.querySelector('link[rel="prev"]');
    const nextLink = document.querySelector('link[rel="next"]');

    if (!previousLink && !nextLink) {
        return;
    }

    const container = document.createElement("nav");
    container.className = "page-nav-buttons";
    container.setAttribute("aria-label", "Page navigation");
    container.append(
        createPageNavigationButton("prev", previousLink),
        createPageNavigationButton("next", nextLink),
    );

    document.body.append(container);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addPageNavigationButtons);
} else {
    addPageNavigationButtons();
}
