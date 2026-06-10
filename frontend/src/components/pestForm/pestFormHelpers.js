// Helper functions for PestForm.
// These functions keep data logic outside the main UI component.

export function getEmptyFormData() {
    return {
        user_id: null,
        pest_id: "",
        custom_pest_name: "",
        pest_type: "",
        description: "",
        location_name: "",
        latitude: "",
        longitude: "",
        image_url: "",
        status_choice: "Uncertain",
        notifiable_choice: "Uncertain",
    };
}

export function getNotifiableValue(notifiable) {
    if (notifiable === 1 || notifiable === "1" || notifiable === true) {
        return "Yes";
    }

    if (notifiable === 0 || notifiable === "0" || notifiable === false) {
        return "No";
    }

    return "Uncertain";
}

export function buildDetailedLocation(address) {
    const street =
        [address.house_number, address.road].filter(Boolean).join(" ") || "";

    const suburb =
        address.suburb ||
        address.neighbourhood ||
        address.hamlet ||
        "";

    const city =
        address.city ||
        address.town ||
        address.village ||
        address.county ||
        "";

    const state = address.state || "";

    return [street, suburb, city, state].filter(Boolean).join(", ");
}

export function buildReportPayload(formData) {
    return {
        user_id: formData.user_id,
        pest_id: formData.pest_id ? Number(formData.pest_id) : null,
        custom_pest_name: formData.custom_pest_name,
        pest_type: formData.pest_type,
        description: formData.description,
        location_name: formData.location_name,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        image_url: formData.image_url || null,
        status_choice: formData.status_choice,
        notifiable_choice: formData.notifiable_choice,
    };
}