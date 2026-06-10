import {
    getEmptyFormData,
    getNotifiableValue,
    buildDetailedLocation,
    buildReportPayload,
} from "../components/pestForm/pestFormHelpers";

describe("pestFormHelpers", () => {
    test("getEmptyFormData returns default form structure", () => {
        const result = getEmptyFormData();

        expect(result).toEqual({
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
        });
    });

    test("getNotifiableValue returns Yes", () => {
        expect(getNotifiableValue(1)).toBe("Yes");
        expect(getNotifiableValue("1")).toBe("Yes");
        expect(getNotifiableValue(true)).toBe("Yes");
    });

    test("getNotifiableValue returns No", () => {
        expect(getNotifiableValue(0)).toBe("No");
        expect(getNotifiableValue("0")).toBe("No");
        expect(getNotifiableValue(false)).toBe("No");
    });

    test("getNotifiableValue returns Uncertain for unknown values", () => {
        expect(getNotifiableValue(null)).toBe("Uncertain");
        expect(getNotifiableValue(undefined)).toBe("Uncertain");
    });

    test("buildDetailedLocation builds formatted address", () => {
        const result = buildDetailedLocation({
            house_number: "10",
            road: "Victoria Street",
            suburb: "Hamilton East",
            city: "Hamilton",
            state: "Waikato",
        });

        expect(result).toBe("10 Victoria Street, Hamilton East, Hamilton, Waikato");
    });

    test("buildDetailedLocation skips empty values", () => {
        const result = buildDetailedLocation({
            road: "Victoria Street",
            city: "Hamilton",
        });

        expect(result).toBe("Victoria Street, Hamilton");
    });

    test("buildReportPayload converts numeric fields", () => {
        const result = buildReportPayload({
            user_id: 1,
            pest_id: "2",
            custom_pest_name: "German Wasp",
            pest_type: "Insect",
            description: "Test",
            location_name: "Hamilton",
            latitude: "-37.787",
            longitude: "175.279",
            image_url: "",
            status_choice: "Regulated",
            notifiable_choice: "Yes",
        });

        expect(result).toEqual({
            user_id: 1,
            pest_id: 2,
            custom_pest_name: "German Wasp",
            pest_type: "Insect",
            description: "Test",
            location_name: "Hamilton",
            latitude: -37.787,
            longitude: 175.279,
            image_url: null,
            status_choice: "Regulated",
            notifiable_choice: "Yes",
        });
    });
});