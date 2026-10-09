
"use strict";

/*
  PHYSICAL COMPUTING PROJECT HUB 2026

  Static website — no backend required.

  Edit the projects array to add or update featured projects.
  GitHub repositories are loaded from the public GitHub API.
*/

/* =========================================
   1. FEATURED PROJECT DATA
   ========================================= */

const projects = [
  {
    id: "PC-001",
    title: "Smart Environment Monitor",
    category: "Sensing",
    status: "progress",
    description:
      "A sensor-based system for collecting environmental data and presenting measurements in an easy-to-understand dashboard.",
    technologies: ["Arduino", "C++", "Sensors"],
    type: "Environmental Monitoring",
    symbol: "⌁",
    color: "#b8f56a",
    background: "#182019",
    info:
      "Prototype concept: collect sensor readings, process measurements on a microcontroller, and display the results. Replace this description with the actual sensors, measurements, and test results from your project."
  },
  {
    id: "PC-002",
    title: "IoT Device Dashboard",
    category: "IoT",
    status: "progress",
    description:
      "An exploration of connected devices, network communication, and real-time data visualization for physical computing projects.",
    technologies: ["Arduino", "Wi-Fi", "JavaScript"],
    type: "IoT & Networking",
    symbol: "⌘",
    color: "#7dd3fc",
    background: "#141e2b",
    info:
      "Prototype concept: connect a compatible device to a Wi-Fi network and send readings to a visualization interface. A remote service or server would be needed for live cross-device data."
  },
  {
    id: "PC-003",
    title: "Automated Control System",
    category: "Automation",
    status: "planned",
    description:
      "A prototype exploring how sensor inputs and programmed conditions can trigger automated responses.",
    technologies: ["Embedded C", "GPIO", "Logic"],
    type: "Automation",
    symbol: "↯",
    color: "#ffb86b",
    background: "#261d18",
    info:
      "Planned project: define input conditions, implement control logic, and test behavior under different conditions. Update this section when implementation begins."
  },
  {
    id: "PC-004",
    title: "Network Health Monitor",
    category: "IoT",
    status: "completed",
    description:
      "A software-focused prototype for presenting network-related measurements and device connectivity information.",
    technologies: ["Networking", "Python", "HTML"],
    type: "Networking & Software",
    symbol: "⌁",
    color: "#c1a7ff",
    background: "#1e192b",
    info:
      "Example showcase entry. Replace it with your own completed work, including actual network measurements, testing methods, and evidence of results."
  },
  {
    id: "PC-005",
    title: "Embedded Data Logger",
    category: "Embedded",
    status: "progress",
    description:
      "A compact embedded-system concept that collects measurements and records data for later analysis.",
    technologies: ["Arduino", "C++", "Serial"],
    type: "Embedded Systems",
    symbol: "▤",
    color: "#f9a8d4",
    background: "#281923",
    info:
      "Prototype concept: sample data at defined intervals, format readings, and transfer or store the resulting records. Specify the actual storage method and sampling interval in your final report."
  },
  {
    id: "PC-006",
    title: "Sensor Data Visualizer",
    category: "Sensing",
    status: "completed",
    description:
      "A lightweight interface concept for converting raw sensor readings into a visual summary that is easier to interpret.",
    technologies: ["JavaScript", "HTML", "CSS"],
    type: "Data Visualization",
    symbol: "▥",
    color: "#67e8f9",
    background: "#142328",
    info:
      "Example showcase entry. This static website can visualize sample data, but it does not receive live hardware measurements unless connected to a suitable data source."
  }
];

/* =========================================
   2. STATUS CONFIGURATION
   ========================================= */

const statusConfig = {
  progress: {
    label: "In development",
    className: "status-progress"
  },
  completed: {
    label: "Completed",
    className: "status-completed"
  },
  planned: {
    label: "Planned",
    className: "status-planned"
  }
};

/* =========================================
   3. DOM ELEMENTS
   ========================================= */

const $ = (id) => document.getElementById(id);

const projectGrid = $("projectGrid");
const searchInput = $("searchInput");
const categoryFilter = $("categoryFilter");
const emptyState = $("emptyState");
const collectionCount = $("collectionCount");

const totalProjects = $("totalProjects");
const activeProjects = $("activeProjects");
const completedProjects = $("completedProjects");
const totalTechnologies = $("totalTechnologies");

const modal = $("projectModal");
const modalClose = $("modalClose");
const modalDone = $("modalDone");
const modalTitle = $("modalTitle");
const modalProjectId = $("modalProjectId");
const modalCategory = $("modalCategory");
const modalStatus = $("modalStatus");
const modalDescription = $("modalDescription");
const modalTags = $("modalTags");
const modalInfo = $("modalInfo");
const modalCover = $("modalCover");
const modalSymbol = $("modalSymbol");

const menuToggle = $("menuToggle");
const sidebar = $("sidebar");
const toast = $("toast");

/* GitHub repository elements */
const repoGrid = document.getElementById("repo-grid");
const repoMessage = document.getElementById("repo-message");
const refreshReposButton = document.getElementById("refreshRepos");

let previousFocus = null;
let toastTimeout = null;
let isLoadingRepos = false;

/* =========================================
   4. STATISTICS
   ========================================= */

function updateStatistics() {
  const uniqueTechnologies = new Set(
    projects.flatMap((project) => project.technologies)
  );

  totalProjects.textContent = String(projects.length).padStart(2, "0");

  activeProjects.textContent = String(
    projects.filter((project) => project.status === "progress").length
  ).padStart(2, "0");

  completedProjects.textContent = String(
    projects.filter((project) => project.status === "completed").length
  ).padStart(2, "0");

  totalTechnologies.textContent = String(
    uniqueTechnologies.size
  ).padStart(2, "0");
}

/* =========================================
   5. PROJECT CARDS
   ========================================= */

function createProjectCard(project, index) {
  const status = statusConfig[project.status] || statusConfig.planned;

  const card = document.createElement("article");
  card.className = "project-card";
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-haspopup", "dialog");
  card.setAttribute("aria-label", `View project: ${project.title}`);

  const art = document.createElement("div");
  art.className = "project-art";
  art.style.setProperty("--art-bg", project.background);
  art.style.setProperty("--art-color", project.color);

  const artIndex = document.createElement("span");
  artIndex.className = "art-index";
  artIndex.textContent = `PROJECT / ${String(index + 1).padStart(2, "0")}`;

  const orbit = document.createElement("span");
  orbit.className = "art-orbit";
  orbit.setAttribute("aria-hidden", "true");

  const symbol = document.createElement("span");
  symbol.className = "art-symbol";
  symbol.textContent = project.symbol;
  symbol.setAttribute("aria-hidden", "true");

  const artCategory = document.createElement("span");
  artCategory.className = "art-category";
  artCategory.textContent = project.category.toUpperCase();

  art.append(artIndex, orbit, symbol, artCategory);

  const body = document.createElement("div");
  body.className = "project-card-body";

  const meta = document.createElement("div");
  meta.className = "project-card-meta";

  const projectId = document.createElement("span");
  projectId.className = "project-id";
  projectId.textContent = project.id;

  const statusBadge = document.createElement("span");
  statusBadge.className = `status ${status.className}`;
  statusBadge.textContent = status.label;

  meta.append(projectId, statusBadge);

  const title = document.createElement("h3");
  title.textContent = project.title;

  const description = document.createElement("p");
  description.className = "project-card-description";
  description.textContent = project.description;

  const tags = document.createElement("div");
  tags.className = "tag-list";

  project.technologies.slice(0, 3).forEach((technology) => {
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = technology;
    tags.appendChild(tag);
  });

  const footer = document.createElement("div");
  footer.className = "project-card-footer";

  const type = document.createElement("span");
  type.className = "project-type";
  type.textContent = project.type;

  const open = document.createElement("span");
  open.className = "project-open";
  open.textContent = "View details ↗";

  footer.append(type, open);
  body.append(meta, title, description, tags, footer);
  card.append(art, body);

const openProjectModal = modalProjectId.textContent === project.id;

  card.addEventListener("click", () => {
    openProjectModal(project);
  });

  card.addEventListener("keydown", (event) => {
    if (event.target !== card) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openProjectModal(project);
    }
  });

  return card;
}

/* =========================================
   6. SEARCH AND FILTER
   ========================================= */

function getFilteredProjects() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;

  return projects.filter((project) => {
    const searchableText = [
      project.id,
      project.title,
      project.description,
      project.category,
      project.type,
      ...project.technologies
    ].join(" ").toLowerCase();

    const matchesSearch = searchableText.includes(query);
    const matchesCategory =
      category === "all" || project.category === category;

    return matchesSearch && matchesCategory;
  });
}

function renderProjects() {
  const filteredProjects = getFilteredProjects();

  projectGrid.replaceChildren();

  filteredProjects.forEach((project, index) => {
    projectGrid.appendChild(createProjectCard(project, index));
  });

  collectionCount.textContent =
    `${String(filteredProjects.length).padStart(2, "0")} PROJECTS`;

  emptyState.hidden = filteredProjects.length !== 0;
  projectGrid.hidden = filteredProjects.length === 0;
}

function resetFilters() {
  searchInput.value = "";
  categoryFilter.value = "all";
  renderProjects();
}

/* =========================================
   7. PROJECT DETAILS MODAL
   ========================================= */

function openProjectModal(project) {
  previousFocus = document.activeElement;

  const status = statusConfig[project.status] || statusConfig.planned;

  modalTitle.textContent = project.title;
  modalProjectId.textContent = project.id;
  modalCategory.textContent = project.category.toUpperCase();

  modalStatus.className = `status ${status.className}`;
  modalStatus.textContent = status.label;

  modalDescription.textContent = project.description;
  modalInfo.textContent = project.info;

  modalSymbol.textContent = project.symbol;
  modalCover.style.setProperty("--modal-bg", project.background);
  modalCover.style.setProperty("--modal-color", project.color);

  modalTags.replaceChildren();

  project.technologies.forEach((technology) => {
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = technology;
    modalTags.appendChild(tag);
  });

  modal.hidden = false;
  document.body.classList.add("modal-open");
  modalClose.focus();
}

function closeProjectModal() {
  if (modal.hidden) return;

  modal.hidden = true;
  document.body.classList.remove("modal-open");

  if (previousFocus && typeof previousFocus.focus === "function") {
    previousFocus.focus();
  }
}

/* =========================================
   8. MOBILE NAVIGATION
   ========================================= */

function closeSidebar() {
  sidebar.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", () => {
  const isOpen = sidebar.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".nav-link").forEach((item) => {
      item.classList.remove("active");
    });

    link.classList.add("active");
    closeSidebar();
  });
});

/* =========================================
   9. TOAST NOTIFICATION
   ========================================= */

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");

  window.clearTimeout(toastTimeout);

  toastTimeout = window.setTimeout(() => {
    toast.classList.remove("visible");
  }, 2200);
}

/* =========================================
   10. GITHUB REPOSITORIES
   ========================================= */

const githubUsername = "KNIGHTsss-labs";

async function loadRepositories() {
  // Check that the HTML container exists.
  if (!repoGrid || !repoMessage) {
    console.error(
      'GitHub section is missing. Check the "repo-grid" and "repo-message" IDs in index.html.'
    );
    return;
  }

  // Prevent multiple simultaneous requests.
  if (isLoadingRepos) return;

  isLoadingRepos = true;

  if (refreshReposButton) {
    refreshReposButton.disabled = true;
    refreshReposButton.textContent = "Loading...";
  }

  repoGrid.replaceChildren();
  repoGrid.hidden = true;
  repoMessage.hidden = false;
  repoMessage.textContent = "Loading repositories from GitHub...";

  try {
    const apiUrl =
      `https://api.github.com/users/${encodeURIComponent(githubUsername)}/repos?sort=updated&per_page=100`;

    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/vnd.github+json"
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(
          "GitHub user not found. Check the username in script.js."
        );
      }

      if (response.status === 403 || response.status === 429) {
        throw new Error(
          "GitHub API rate limit reached. Please wait and try again later."
        );
      }

      throw new Error(`GitHub API returned HTTP ${response.status}.`);
    }

    const repos = await response.json();

    if (!Array.isArray(repos)) {
      throw new Error("Unexpected response from GitHub API.");
    }

    // Show public repositories that are not forks.
    const publicRepos = repos.filter((repo) => !repo.fork);

    repoGrid.replaceChildren();

    if (publicRepos.length === 0) {
      repoMessage.textContent =
        "No public non-fork repositories were found for this account.";
      return;
    }

    publicRepos.forEach((repo) => {
      repoGrid.appendChild(createRepositoryCard(repo));
    });

    repoMessage.textContent =
      `Loaded ${publicRepos.length} public repositories successfully.`;

    repoGrid.hidden = false;
  } catch (error) {
    console.error("Failed to load GitHub repositories:", error);

    repoMessage.textContent =
      `${error.message} You can still visit the GitHub profile directly.`;

    const profileLink = document.createElement("a");
    profileLink.className = "text-button";
    profileLink.href = `https://github.com/${githubUsername}`;
    profileLink.target = "_blank";
    profileLink.rel = "noopener noreferrer";
    profileLink.textContent = "Open GitHub profile ↗";

    repoMessage.appendChild(document.createElement("br"));
    repoMessage.appendChild(profileLink);
  } finally {
    isLoadingRepos = false;

    if (refreshReposButton) {
      refreshReposButton.disabled = false;
      refreshReposButton.textContent = "Refresh ↻";
    }
  }
}

function createRepositoryCard(repo) {
  const card = document.createElement("article");
  card.className = "repo-card";

  const top = document.createElement("div");
  top.className = "repo-card-top";

  const title = document.createElement("h3");
  title.textContent = repo.name;

  const visibility = document.createElement("span");
  visibility.className = "repo-visibility";
  visibility.textContent = "Public";

  top.append(title, visibility);

  const description = document.createElement("p");
  description.textContent =
    repo.description || "No description provided.";

  const meta = document.createElement("div");
  meta.className = "repo-meta";

  if (repo.language) {
    const language = document.createElement("span");

    const dot = document.createElement("span");
    dot.className = "repo-language-dot";
    dot.setAttribute("aria-hidden", "true");

    language.append(dot, document.createTextNode(repo.language));
    meta.appendChild(language);
  } else {
    const language = document.createElement("span");
    language.textContent = "Language not specified";
    meta.appendChild(language);
  }

  const stars = document.createElement("span");
  stars.textContent = `☆ ${repo.stargazers_count ?? 0} stars`;

  const forks = document.createElement("span");
  forks.textContent = `⑂ ${repo.forks_count ?? 0} forks`;

  meta.append(stars, forks);

  const link = document.createElement("a");
  link.className = "repo-link";
  link.href = repo.html_url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";

  const linkText = document.createElement("span");
  linkText.textContent = "View on GitHub";

  const arrow = document.createElement("span");
  arrow.textContent = "↗";
  arrow.setAttribute("aria-hidden", "true");

  link.append(linkText, arrow);
  card.append(top, description, meta, link);

  return card;
}

/* =========================================
   11. EVENT LISTENERS
   ========================================= */

searchInput.addEventListener("input", renderProjects);
categoryFilter.addEventListener("change", renderProjects);

$("resetFilters").addEventListener("click", resetFilters);
$("emptyReset").addEventListener("click", resetFilters);

modalClose.addEventListener("click", closeProjectModal);
modalDone.addEventListener("click", closeProjectModal);

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeProjectModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeProjectModal();
    closeSidebar();
  }

  const isTyping = [
    "INPUT",
    "TEXTAREA",
    "SELECT"
  ].includes(document.activeElement?.tagName);

  if (
    event.key === "/" &&
    !isTyping &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.altKey
  ) {
    event.preventDefault();
    searchInput.focus();
  }
});

document.querySelectorAll(".back-to-top").forEach((link) => {
  link.addEventListener("click", () => {
    showToast("Back to the top ↑");
  });
});

const emptyReset = document.getElementById("emptyReset");

if (emptyReset) {
  emptyReset.addEventListener("click", resetFilters);
}

refreshReposButton.addEventListener("click", loadRepositories);

/* =========================================
   12. INITIALIZE
   ========================================= */

function init() {
  updateStatistics();
  renderProjects();
  loadRepositories();

  console.log("Physical Computing Project Hub 2026 initialized.");
  console.log(`Loaded ${projects.length} example projects.`);
}

init();