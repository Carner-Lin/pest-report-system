import { render, screen, fireEvent } from "@testing-library/react";
import PestImageSection from "../components/pestForm/PestImageSection";

describe("PestImageSection", () => {
    test("renders upload section with default text", () => {
        render(
            <PestImageSection
                selectedImageFile={null}
                imagePreview=""
                aiLoading={false}
                aiResult={null}
                onImageChange={jest.fn()}
                onIdentifyPest={jest.fn()}
            />
        );

        expect(screen.getByText("Upload pest image")).toBeInTheDocument();
        expect(screen.getByText("Choose File")).toBeInTheDocument();
        expect(screen.getByText("No file chosen")).toBeInTheDocument();
        expect(screen.getByText("No image selected")).toBeInTheDocument();
    });

    test("shows file name when image is selected", () => {
        render(
            <PestImageSection
                selectedImageFile={{ name: "test.jpg" }}
                imagePreview=""
                aiLoading={false}
                aiResult={null}
                onImageChange={jest.fn()}
                onIdentifyPest={jest.fn()}
            />
        );

        expect(screen.getByText("test.jpg")).toBeInTheDocument();
    });

    test("calls identify handler when button is clicked", () => {
        const onIdentifyPest = jest.fn();

        render(
            <PestImageSection
                selectedImageFile={null}
                imagePreview=""
                aiLoading={false}
                aiResult={null}
                onImageChange={jest.fn()}
                onIdentifyPest={onIdentifyPest}
            />
        );

        fireEvent.click(screen.getByText("Identify with AI"));
        expect(onIdentifyPest).toHaveBeenCalled();
    });

    test("shows AI loading state", () => {
        render(
            <PestImageSection
                selectedImageFile={null}
                imagePreview=""
                aiLoading={true}
                aiResult={null}
                onImageChange={jest.fn()}
                onIdentifyPest={jest.fn()}
            />
        );

        expect(screen.getByText("Identifying.")).toBeInTheDocument();
    });

    test("renders AI result", () => {
        render(
            <PestImageSection
                selectedImageFile={{ name: "test.jpg" }}
                imagePreview=""
                aiLoading={false}
                aiResult={{
                    predicted_name: "Puriri Moth",
                    predicted_type: "Insect",
                    confidence: 0.95,
                }}
                onImageChange={jest.fn()}
                onIdentifyPest={jest.fn()}
            />
        );

        expect(screen.getByText(/AI Predicted Name:/)).toBeInTheDocument();
        expect(screen.getByText(/Puriri Moth/)).toBeInTheDocument();
        expect(screen.getByText(/Insect/)).toBeInTheDocument();
        expect(screen.getByText(/95%/)).toBeInTheDocument();
    });
});