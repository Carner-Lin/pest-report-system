// Shared API functions for frontend pages.

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

async function handleJsonResponse(response, fallbackMessage) {
    // Normalize backend errors so pages can show one consistent message.
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || fallbackMessage);
    }

    return data;
}

export async function getReports() {
    const response = await fetch(`${API_BASE_URL}/api/reports`);
    return handleJsonResponse(response, "Failed to fetch reports.");
}

export async function getPests() {
    const response = await fetch(`${API_BASE_URL}/api/pests`);
    return handleJsonResponse(response, "Failed to fetch pests.");
}

export async function getUserReports(userId) {
    const response = await fetch(`${API_BASE_URL}/api/reports/user/${userId}`);
    return handleJsonResponse(response, "Failed to fetch user reports.");
}

export async function getNotedReports(userId) {
    const response = await fetch(`${API_BASE_URL}/api/reports/noted/${userId}`);
    return handleJsonResponse(response, "Failed to fetch noted reports.");
}

export async function deleteReport(reportId, currentUserId) {
    const response = await fetch(`${API_BASE_URL}/api/reports/${reportId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            currentUserId,
        }),
    });

    return handleJsonResponse(response, "Failed to delete report.");
}

export async function removeNotedReport(reportId, userId) {
    const response = await fetch(
        `${API_BASE_URL}/api/reports/${reportId}/note/${userId}`,
        {
            method: "DELETE",
        }
    );

    return handleJsonResponse(response, "Failed to remove note.");
}

export async function loginUser(formData) {
    const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });

    return handleJsonResponse(response, "Login failed.");
}

export async function registerUser(formData) {
    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });

    return handleJsonResponse(response, "Registration failed.");
}
