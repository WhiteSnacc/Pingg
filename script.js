// =======================================================================================================
// Navigasi halaman dan menu mobile
// =======================================================================================================
const pageOrder = ["home.html", "community.html", "inbox.html", "profile.html"];
const directionKey = "pingg-nav-direction";
const currentPage = window.location.pathname.split("/").pop() || "home.html";

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  try {
    const direction = window.sessionStorage.getItem(directionKey);
    window.sessionStorage.removeItem(directionKey);

    if (direction === "from-left" || direction === "from-right") {
      document.querySelector(".page-content")?.classList.add(`nav-page-enter-${direction}`);
    }
  } catch (error) {
    console.error("Could not restore the page transition direction.", error);
  }
}

document.querySelectorAll("[data-menu-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    const menu = document.getElementById("mobile-accordion");
    if (!menu) {
      console.error("The mobile navigation menu is missing.");
      return;
    }

    const isExpanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isExpanded));
    menu.classList.toggle("hidden", isExpanded);
  });
});

document.querySelectorAll(".mobile-accordion a").forEach((link) => {
  link.addEventListener("click", () => {
    const menu = document.getElementById("mobile-accordion");
    const toggle = document.querySelector("[data-menu-toggle]");
    menu?.classList.add("hidden");
    toggle?.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll("[data-post-url]").forEach((post) => {
  const openPost = () => {
    const destination = post.dataset.postUrl;
    if (!destination) {
      console.error("The post destination is missing.");
      return;
    }

    window.location.assign(destination);
  };

  post.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a, button, input, textarea, select")) {
      return;
    }

    openPost();
  });

});

document.querySelectorAll("nav a[href]").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      link.target === "_blank" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const destination = new URL(link.href, window.location.href);
    const destinationPage = destination.pathname.split("/").pop() || "home.html";
    const currentIndex = pageOrder.indexOf(currentPage);
    const destinationIndex = pageOrder.indexOf(destinationPage);

    if (
      destination.origin !== window.location.origin ||
      currentIndex === -1 ||
      destinationIndex === -1 ||
      currentIndex === destinationIndex
    ) {
      return;
    }

    event.preventDefault();
    const movingRight = destinationIndex < currentIndex;
    const enterDirection = movingRight ? "from-left" : "from-right";
    const leaveDirection = movingRight ? "nav-page-leave-to-right" : "nav-page-leave-to-left";

    try {
      window.sessionStorage.setItem(directionKey, enterDirection);
    } catch (error) {
      console.error("Could not save the page transition direction.", error);
    }

    document.querySelector(".page-content")?.classList.add(leaveDirection);
    window.setTimeout(() => {
      window.location.assign(destination.href);
    }, 180);
  });
});

// =======================================================================================================
// Pengurutan feed berdasarkan waktu dan jumlah vote
// =======================================================================================================
const feed = document.querySelector('.page-content > section[aria-label="Feed postingan"]');
const sortButtons = document.querySelectorAll(".feed-sort-button");

if (feed && sortButtons.length > 0) {
  const posts = [...feed.querySelectorAll("article[data-age-hours][data-votes]")];

  sortButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const sortBy = button.dataset.sort;
      if (sortBy !== "new" && sortBy !== "top") {
        console.error(`Unsupported post sort order: ${sortBy}`);
        return;
      }

      const sortedPosts = posts.toSorted((first, second) => {
        const firstValue = Number(first.dataset[sortBy === "new" ? "ageHours" : "votes"]);
        const secondValue = Number(second.dataset[sortBy === "new" ? "ageHours" : "votes"]);
        return sortBy === "new" ? firstValue - secondValue : secondValue - firstValue;
      });

      sortedPosts.forEach((post) => feed.append(post));
      sortButtons.forEach((sortButton) => {
        const isSelected = sortButton === button;
        sortButton.setAttribute("aria-pressed", String(isSelected));
        sortButton.classList.toggle("bg-forest", isSelected);
        sortButton.classList.toggle("text-white", isSelected);
        sortButton.classList.toggle("font-bold", isSelected);
        sortButton.classList.toggle("text-slate-600", !isSelected);
        sortButton.classList.toggle("font-medium", !isSelected);
      });
    });
  });
}

// =======================================================================================================
// Histori postingan yang sudah dilihat
// =======================================================================================================
const historyList = document.getElementById("viewed-posts-list");
const clearHistoryButton = document.getElementById("clear-view-history");
const viewHistoryKey = "pingg-viewed-posts";
const historyLimit = 10;

if (historyList && clearHistoryButton) {
  const getHistory = () => {
    try {
      const savedHistory = window.localStorage.getItem(viewHistoryKey);
      if (!savedHistory) {
        return [];
      }

      const parsedHistory = JSON.parse(savedHistory);
      if (!Array.isArray(parsedHistory)) {
        throw new TypeError("Saved post history is not a list.");
      }

      return parsedHistory.filter(
        (item) =>
          item &&
          typeof item.id === "string" &&
          typeof item.title === "string" &&
          typeof item.community === "string" &&
          typeof item.viewedAt === "number",
      );
    } catch (error) {
      console.error("Could not read viewed post history.", error);
      return [];
    }
  };

  const renderHistory = () => {
    const history = getHistory();
    historyList.replaceChildren();

    if (history.length === 0) {
      const emptyState = document.createElement("li");
      emptyState.className = "py-3 text-xs text-slate-500";
      emptyState.textContent = "Belum ada postingan yang dilihat.";
      historyList.append(emptyState);
      return;
    }

    history.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.className = "py-3";

      const link = document.createElement("a");
      link.href = `#${item.id}`;
      link.className = "block font-semibold text-sm text-slate-700 hover:text-forest transition";
      link.textContent = item.title;

      const metadata = document.createElement("span");
      metadata.className = "mt-1 block text-xs text-slate-400";
      metadata.textContent = `${item.community} · ${new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(item.viewedAt)}`;

      listItem.append(link, metadata);
      historyList.append(listItem);
    });
  };

  const rememberPost = (post) => {
    const id = post.dataset.postId;
    const title = post.querySelector("h2")?.textContent?.trim();
    const community = post.querySelector("header span.px-2")?.textContent?.trim();

    if (!id || !title || !community) {
      console.error("Cannot save viewed post: required post details are missing.", post);
      return;
    }

    const history = getHistory().filter((item) => item.id !== id);
    history.unshift({ id, title, community, viewedAt: Date.now() });

    try {
      window.localStorage.setItem(viewHistoryKey, JSON.stringify(history.slice(0, historyLimit)));
      renderHistory();
    } catch (error) {
      console.error("Could not save viewed post history.", error);
    }
  };

  renderHistory();

  clearHistoryButton.addEventListener("click", () => {
    try {
      window.localStorage.removeItem(viewHistoryKey);
      renderHistory();
    } catch (error) {
      console.error("Could not clear viewed post history.", error);
    }
  });

  window.addEventListener("storage", (event) => {
    if (event.key === viewHistoryKey) {
      renderHistory();
    }
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            rememberPost(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 },
    );

    document.querySelectorAll("article[data-post-id]").forEach((post) => observer.observe(post));
  } else {
    console.error("This browser does not support tracking viewed posts.");
  }
}
