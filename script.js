document.addEventListener("DOMContentLoaded", () => {
    fetch("data.json")
      .then(response => response.json())
      .then(data => renderJobs(data));
});

function renderJobs(jobs) {
    const jobListings = document.getElementById("job-listings");
    jobListings.innerHTML = ""; 

    jobs.forEach(job => {
        const jobCard = document.createElement("div");
        jobCard.className = "job-card";

        if (job.featured) {
            jobCard.classList.add("featured-card"); 
        }

        const logo = document.createElement("img");
        logo.src = job.logo;
        logo.alt = `${job.company} logo`;
        jobCard.appendChild(logo);

        const jobInfo = document.createElement("div");
        jobInfo.className = "job-info";

        const companyInfo = document.createElement("div");
        companyInfo.className = "company-info";

        const companyName = document.createElement("div");
        companyName.className = "company-name";
        companyName.textContent = job.company;
        companyInfo.appendChild(companyName);

        const badges = document.createElement("div");
        badges.className = "badges";

        if (job.new) {
            const newBadge = document.createElement("span");
            newBadge.className = "new";
            newBadge.textContent = "NEW!";
            badges.appendChild(newBadge);
        }

        if (job.featured) {
            const featuredBadge = document.createElement("span");
            featuredBadge.className = "featured";
            featuredBadge.textContent = "FEATURED";
            badges.appendChild(featuredBadge);
        }

        companyInfo.appendChild(badges);
        jobInfo.appendChild(companyInfo);

        const title = document.createElement("h2");
        title.textContent = job.position;
        jobInfo.appendChild(title);

        const details = document.createElement("p");
        details.textContent = `${job.postedAt} • ${job.contract} • ${job.location}`;
        jobInfo.appendChild(details);

        const techTags = document.createElement("div");
        techTags.className = "tech-tags";

        const roleTag = document.createElement("span");
        roleTag.className = "tag";
        roleTag.textContent = job.role;
        techTags.appendChild(roleTag);

        const levelTag = document.createElement("span");
        levelTag.className = "tag";
        levelTag.textContent = job.level;
        techTags.appendChild(levelTag);

        job.languages.forEach(language => {
            const langTag = document.createElement("span");
            langTag.className = "tag";
            langTag.textContent = language;
            techTags.appendChild(langTag);
        });

        job.tools.forEach(tool => {
            const toolTag = document.createElement("span");
            toolTag.className = "tag";
            toolTag.textContent = tool;
            techTags.appendChild(toolTag);
        });

        jobCard.appendChild(jobInfo);
        jobCard.appendChild(techTags); 
        jobListings.appendChild(jobCard);
    });
}

let selectedFilters = [];

document.addEventListener("DOMContentLoaded", () => {
    fetch("data.json")
      .then(response => response.json())
      .then(data => renderJobs(data));

    document.getElementById("job-listings").addEventListener("click", event => {
        if (event.target.classList.contains("tag")) {
            const filterValue = event.target.textContent;
            if (!selectedFilters.includes(filterValue)) {
                selectedFilters.push(filterValue);
                renderFilters();
                filterJobs();
            }
        }
    });

    document.getElementById("clear-filters").addEventListener("click", () => {
        selectedFilters = [];
        renderFilters();
        filterJobs();
    });
});

function renderFilters() {
    const filtersContainer = document.getElementById("filters");
    filtersContainer.innerHTML = "";

    selectedFilters.forEach(filter => {
        const filterTag = document.createElement("span");
        filterTag.className = "active-filter";
        filterTag.textContent = filter;

        const removeBtn = document.createElement("span");
        removeBtn.className = "remove-filter";
        removeBtn.textContent = "x";
        removeBtn.onclick = () => {
            selectedFilters = selectedFilters.filter(f => f !== filter);
            renderFilters();
            filterJobs();
        };

        filterTag.appendChild(removeBtn);
        filtersContainer.appendChild(filterTag);
    });

    document.getElementById("filters-bar").style.display = selectedFilters.length ? "flex" : "none";
}

function filterJobs() {
    fetch("data.json")
      .then(response => response.json())
      .then(jobs => {
          const filteredJobs = jobs.filter(job => {
              const jobTags = [job.role, job.level, ...job.languages, ...job.tools];
              return selectedFilters.every(filter => jobTags.includes(filter));
          });
          renderJobs(filteredJobs);
      });
}