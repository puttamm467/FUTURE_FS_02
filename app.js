let leads = [];

// API request helper
async function api(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;
}

// Show notification
function showToast(message) {
    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.style.display = "block";

    setTimeout(() => {
        toast.style.display = "none";
    }, 2500);
}

// Load all leads
async function loadLeads() {
    try {
        leads = await api("/api/leads");

        renderLeads();
        renderRecentLeads();
        renderFollowUps();
        loadDashboard();

    } catch (error) {
        showToast(error.message);
    }
}

// Load dashboard
async function loadDashboard() {
    try {
        const data = await api("/api/dashboard");

        document.getElementById("total-leads").textContent =
            data.total;

        document.getElementById("converted-leads").textContent =
            data.converted;

        document.getElementById("pending-followups").textContent =
            data.pending;

        document.getElementById("overdue-followups").textContent =
            data.overdue;

        document.getElementById("conversion-rate").textContent =
            data.conversionRate + "%";

    } catch (error) {
        showToast(error.message);
    }
}

// Switch pages
function showPage(page) {
    const pages = [
        "dashboard",
        "leads",
        "followups"
    ];

    pages.forEach(name => {
        document.getElementById(name + "-page")
            .classList.toggle("hidden", name !== page);
    });

    document.getElementById("page-title").textContent =
        page === "followups"
            ? "Follow-ups"
            : page === "leads"
                ? "All Leads"
                : "Dashboard";

    document.querySelectorAll(".nav-btn").forEach(button => {
        button.classList.remove("active");
    });

    const selectedButton = Array.from(
        document.querySelectorAll(".nav-btn")
    ).find(button =>
        button.getAttribute("onclick").includes(page)
    );

    if (selectedButton) {
        selectedButton.classList.add("active");
    }
}

// Render status
function statusBadge(status) {
    return `<span class="status ${status}">${escapeHTML(status)}</span>`;
}

// Escape user-provided text before displaying it in HTML
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

// Render all leads
function renderLeads() {
    const search = document.getElementById("search-input")
        .value.toLowerCase();

    const filter = document.getElementById("status-filter")
        .value;

    const filteredLeads = leads.filter(lead => {
        const matchesSearch =
            lead.name.toLowerCase().includes(search) ||
            lead.email.toLowerCase().includes(search) ||
            (lead.company || "").toLowerCase().includes(search);

        const matchesStatus =
            !filter || lead.status === filter;

        return matchesSearch && matchesStatus;
    });

    const table = document.getElementById("leads-table");

    if (filteredLeads.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="7">No leads found.</td>
            </tr>
        `;
        return;
    }

    table.innerHTML = filteredLeads.map(lead => `
        <tr>
            <td>${escapeHTML(lead.name)}</td>
            <td>${escapeHTML(lead.email)}</td>
            <td>${escapeHTML(lead.phone)}</td>
            <td>${escapeHTML(lead.company)}</td>
            <td>${statusBadge(lead.status)}</td>
            <td>${escapeHTML(lead.follow_up || "Not scheduled")}</td>

            <td>
                <button class="action-btn"
                    onclick="editLead(${lead.id})">
                    Edit
                </button>

                <button class="action-btn delete-btn"
                    onclick="deleteLead(${lead.id})">
                    Delete
                </button>
            </td>
        </tr>
    `).join("");
}

// Render recent leads
function renderRecentLeads() {
    const recent = leads.slice(0, 5);

    const table = document.getElementById("recent-leads");

    if (recent.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="5">No leads added yet.</td>
            </tr>
        `;
        return;
    }

    table.innerHTML = recent.map(lead => `
        <tr>
            <td>${escapeHTML(lead.name)}</td>
            <td>${escapeHTML(lead.email)}</td>
            <td>${escapeHTML(lead.company)}</td>
            <td>${statusBadge(lead.status)}</td>
            <td>${escapeHTML(lead.follow_up || "Not scheduled")}</td>
        </tr>
    `).join("");
}

// Render follow-ups
function renderFollowUps() {
    const container = document.getElementById("followup-list");

    const followUps = leads
        .filter(lead =>
            lead.follow_up &&
            !["Converted", "Lost"].includes(lead.status)
        )
        .sort((a, b) =>
            a.follow_up.localeCompare(b.follow_up)
        );

    if (followUps.length === 0) {
        container.innerHTML = `
            <p class="empty-message">
                No follow-ups scheduled.
            </p>
        `;
        return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    container.innerHTML = followUps.map(lead => {
        const followUpDate = new Date(
            lead.follow_up + "T00:00:00"
        );

        const overdue = followUpDate < today;

        return `
            <div class="followup-item">

                <div>
                    <h3>${escapeHTML(lead.name)}</h3>

                    <p>${escapeHTML(lead.email)}</p>

                    <p>${escapeHTML(lead.company)}</p>
                </div>

                <div>
                    <p class="${overdue ? "overdue-text" : ""}">
                        ${overdue ? "Overdue: " : "Follow-up: "}
                        ${escapeHTML(lead.follow_up)}
                    </p>

                    ${statusBadge(lead.status)}
                </div>

            </div>
        `;
    }).join("");
}

// Open modal
function openModal() {
    document.getElementById("lead-form").reset();

    document.getElementById("lead-id").value = "";

    document.getElementById("modal-title").textContent =
        "Add New Lead";

    document.getElementById("lead-modal")
        .classList.remove("hidden");
}

// Close modal
function closeModal() {
    document.getElementById("lead-modal")
        .classList.add("hidden");
}

// Edit lead
function editLead(id) {
    const lead = leads.find(item => item.id === id);

    if (!lead) return;

    document.getElementById("lead-id").value = lead.id;
    document.getElementById("name").value = lead.name;
    document.getElementById("email").value = lead.email;
    document.getElementById("phone").value = lead.phone || "";
    document.getElementById("company").value = lead.company || "";
    document.getElementById("source").value = lead.source || "Website";
    document.getElementById("status").value = lead.status;
    document.getElementById("follow_up").value = lead.follow_up || "";
    document.getElementById("notes").value = lead.notes || "";

    document.getElementById("modal-title").textContent =
        "Edit Lead";

    document.getElementById("lead-modal")
        .classList.remove("hidden");
}

// Add or update lead
document.getElementById("lead-form")
    .addEventListener("submit", async function(event) {

        event.preventDefault();

        const id = document.getElementById("lead-id").value;

        const leadData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            company: document.getElementById("company").value,
            source: document.getElementById("source").value,
            status: document.getElementById("status").value,
            follow_up: document.getElementById("follow_up").value,
            notes: document.getElementById("notes").value
        };

        try {
            if (id) {
                await api(`/api/leads/${id}`, {
                    method: "PUT",
                    body: JSON.stringify(leadData)
                });

                showToast("Lead updated successfully!");

            } else {
                await api("/api/leads", {
                    method: "POST",
                    body: JSON.stringify(leadData)
                });

                showToast("Lead added successfully!");
            }

            closeModal();

            await loadLeads();

        } catch (error) {
            showToast(error.message);
        }
    });

// Delete lead
async function deleteLead(id) {
    const confirmDelete = confirm(
        "Are you sure you want to delete this lead?"
    );

    if (!confirmDelete) return;

    try {
        await api(`/api/leads/${id}`, {
            method: "DELETE"
        });

        showToast("Lead deleted successfully!");

        await loadLeads();

    } catch (error) {
        showToast(error.message);
    }
}

// Start application
loadLeads();