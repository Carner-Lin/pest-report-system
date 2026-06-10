// Shared helper functions for formatting report data in the UI.

export function getDisplayPestName(report) {
    return report?.pest_name || report?.custom_pest_name || "Unknown Pest";
}

export function getDisplayUsername(report) {
    return report?.username || "Anonymous User";
}

export function getDisplayDate(report) {
    if (!report?.report_date) return "Unknown date";

    return new Date(report.report_date).toLocaleDateString("en-NZ", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export function getCityLevelLocation(locationName, fallback = "Unknown city") {
    if (!locationName) return fallback;

    // Nominatim returns comma-separated addresses; the city is usually near the end.
    const parts = locationName
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);

    if (parts.length >= 2) {
        return parts[parts.length - 2];
    }

    return locationName;
}

export function getDisplayType(report) {
    return report?.pest_type || report?.organism_type || "Unknown";
}

export function getDisplayStatus(report) {
    return report?.status_choice || report?.regulatory_status || "Unknown";
}

export function getDisplayNotifiable(report) {
    if (report?.notifiable_choice) {
        return report.notifiable_choice;
    }

    // Support MySQL, JSON, and boolean representations of the same flag.
    if (
        report?.notifiable === 1 ||
        report?.notifiable === "1" ||
        report?.notifiable === true
    ) {
        return "Yes";
    }

    if (
        report?.notifiable === 0 ||
        report?.notifiable === "0" ||
        report?.notifiable === false
    ) {
        return "No";
    }

    return "Unknown";
}

export function getValidSelectedLocation(report) {
    if (!report || report.latitude == null || report.longitude == null) {
        return null;
    }

    // Google Maps expects numeric lat/lng values, not database strings.
    return {
        lat: Number(report.latitude),
        lng: Number(report.longitude),
    };
}
