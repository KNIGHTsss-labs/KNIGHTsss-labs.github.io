"use strict";

/*
  PHYSICAL COMPUTING PROJECT 2026
  Static dashboard — no backend required.

  To add or edit a project, modify the projects array below.
*/

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
      "Prototype concept: collect sensor readings, process the measurements on a microcontroller, and display the results. Replace this description with the actual sensors, measurements, and test results from your project."
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
      "Prototype concept: connect a compatible device to a Wi-Fi network and send readings to a visualization interface. A real remote service or server would be needed for live cross-device data."
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
      "Planned project: define input conditions, implement the control logic, and test the behavior under different conditions. Update this section when implementation begins."
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
      "Example showcase entry. Replace it with your own completed work, including the actual network measurements, testing method, and evidence of the results."
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
      "Example showcase entry. This static website can visualize sample data, but it does not receive live hardware measurements unless you connect a suitable data source."
  }
];

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

// DOM elements
const projectGrid = document.getElementById("projectGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const emptyState = document.getElementById("emptyState");
const collectionCount = document.getElementById("collectionCount");

const totalProjects = document.getElementById("totalProjects");
const activeProjects = document.getElementById("activeProjects");
const completedProjects = document.getElementById("completedProjects");
const totalTechnologies = document.getElementById("totalTechnologies");

const modal = document.getElementById("projectModal");
const modalClose = document.getElementById("modalClose");
const modalDone = document.getElementById("modalDone");
const modalTitle = document.getElementById("modalTitle");
const modalCategory = document.getElementById("modalCategory");
const modalStatus = document.getElementById("modalStatus");
const modalDescription = document.getElementById("modalDescription");
const modalTags = document.getElementById("modalTags");
const modalInfo = document.getElementById("modalInfo");
const modalCover = document.getElementById("modalCover");
const modalSymbol = document.getElementById("modalSymbol");

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const toast = document.getElementById("toast");

let previousFocus = null;
let toastTimeout = null;

/* --------------------------------
   Statistics
-------------------------------- */

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

/* --------------------------------
   Project cards
-------------------------------- */

function createProjectCard(project, index) {
  const status = statusConfig[project.status] || statusConfig.planned;

  const card = document.createElement("article");
  card.className = "project-card";
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `View project: ${project.title}`);

  // Keep project content as text instead of injecting HTML.
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
  open.innerHTML = "View details <span aria-hidden='true'>↗</span>";

  footer.append(type, open);
  body.append(meta, title, description, tags, footer);
  card.append(art, body);

  card.addEventListener("click", () => {
    openProjectModal(project);
  });

  card.addEventListener("keydown", (event) => {
    // Prevent keyboard activation from firing twice.
    if (event.target !== card) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openProjectModal(project);
    }
  });

  return card;
}

/* --------------------------------
   Search and category filter
-------------------------------- */

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

  const count = String(filteredProjects.length).padStart(2, "0");
  collectionCount.textContent = `${count} PROJECTS`;

  emptyState.hidden = filteredProjects.length !== 0;
  projectGrid.hidden = filteredProjects.length === 0;
}

function resetFilters() {
  searchInput.value = "";
  categoryFilter.value = "all";
  renderProjects();
}

/* --------------------------------
   Project details modal
-------------------------------- */

function openProjectModal(project) {
  previousFocus = document.activeElement;

  const status = statusConfig[project.status] || statusConfig.planned;

  modalTitle.textContent = project.title;
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

/* --------------------------------
   Mobile navigation
-------------------------------- */

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

/* --------------------------------
   Toast
-------------------------------- */

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");

  window.clearTimeout(toastTimeout);

  toastTimeout = window.setTimeout(() => {
    toast.classList.remove("visible");
  }, 2200);
}

/* --------------------------------
   Event listeners
-------------------------------- */

searchInput.addEventListener("input", renderProjects);
categoryFilter.addEventListener("change", renderProjects);

document.getElementById("resetFilters").addEventListener(
  "click",
  resetFilters
);

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

  // Press / to focus search when not typing in another field.
  const isTyping = ["INPUT", "TEXTAREA", "SELECT"].includes(
    document.activeElement?.tagName
  );

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


/* --------------------------------
   GitHub Repositories
-------------------------------- */

const username = "KNIGHTsss-labs";
const repoGrid = document.getElementById("repo-grid");

async function loadRepositories() {
  // Prevent an error if the HTML section does not exist.
  if (!repoGrid) {
    console.warn('Missing element: id="repo-grid"');
    return;
  }

  repoGrid.textContent = "Loading repositories...";

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos = await response.json();

    const publicRepos = repos.filter((repo) => !repo.fork);

    repoGrid.replaceChildren();

    if (publicRepos.length === 0) {
      repoGrid.textContent = "No repositories found.";
      return;
    }

    publicRepos.forEach((repo) => {
      const card = document.createElement("article");
      card.className = "repo-card";

      const title = document.createElement("h3");
      title.textContent = repo.name;

      const description = document.createElement("p");
      description.textContent =
        repo.description || "No description provided.";

      const language = document.createElement("p");
      language.textContent =
        repo.language || "Language not specified";

      const link = document.createElement("a");
      link.href = repo.html_url;
      link.textContent = "View on GitHub ↗";
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      card.append(title, description, language, link);
      repoGrid.appendChild(card);
    });
  } catch (error) {
    console.error("Failed to load repositories:", error);

    repoGrid.textContent =
      "Unable to load repositories. Please visit GitHub directly.";
  }
}


/* --------------------------------
   Initialize
-------------------------------- */

function init() {
  updateStatistics();
  renderProjects();
  loadRepositories();

  console.log("Physical Computing Project Hub 2026 initialized.");
  console.log(`Loaded ${projects.length} example projects.`);
}

init();