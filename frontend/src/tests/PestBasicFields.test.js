import { render, screen, fireEvent } from "@testing-library/react";
import PestBasicFields from "../components/pestForm/PestBasicFields";

describe("PestBasicFields", () => {
    const pests = [
        { id: 1, name: "German Wasp" },
        { id: 2, name: "Argentine Ant" },
    ];

    const formData = {
        pest_id: "",
        custom_pest_name: "",
        pest_type: "",
        description: "",
        status_choice: "Uncertain",
        notifiable_choice: "Uncertain",
    };

    test("renders all basic fields", () => {
        render(
            <PestBasicFields
                pests={pests}
                formData={formData}
                onChange={jest.fn()}
                onDatabaseSelect={jest.fn()}
            />
        );

        expect(screen.getByText("Report details")).toBeInTheDocument();
        expect(screen.getByText("Select from pest database")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter pest name")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter pest type")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter pest description")).toBeInTheDocument();
    });

    test("renders pest options", () => {
        render(
            <PestBasicFields
                pests={pests}
                formData={formData}
                onChange={jest.fn()}
                onDatabaseSelect={jest.fn()}
            />
        );

        expect(screen.getByText("German Wasp")).toBeInTheDocument();
        expect(screen.getByText("Argentine Ant")).toBeInTheDocument();
    });

    test("calls onDatabaseSelect when select changes", () => {
        const onDatabaseSelect = jest.fn();

        render(
            <PestBasicFields
                pests={pests}
                formData={formData}
                onChange={jest.fn()}
                onDatabaseSelect={onDatabaseSelect}
            />
        );

        fireEvent.change(screen.getByDisplayValue("-- Select from database --"), {
            target: { value: "1" },
        });

        expect(onDatabaseSelect).toHaveBeenCalled();
    });

    test("calls onChange for text input", () => {
        const onChange = jest.fn();

        render(
            <PestBasicFields
                pests={pests}
                formData={formData}
                onChange={onChange}
                onDatabaseSelect={jest.fn()}
            />
        );

        fireEvent.change(screen.getByPlaceholderText("Enter pest name"), {
            target: { value: "Test Pest", name: "custom_pest_name" },
        });

        expect(onChange).toHaveBeenCalled();
    });
});