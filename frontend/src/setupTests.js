import "@testing-library/jest-dom";

process.env.REACT_APP_API_BASE_URL = "http://localhost:5000";
process.env.REACT_APP_GOOGLE_MAPS_API_KEY = "test-key";

global.fetch = jest.fn();

window.alert = jest.fn();
window.confirm = jest.fn(() => true);

global.URL.createObjectURL = jest.fn(() => "blob:preview-url");

Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

Object.defineProperty(window, "scrollTo", {
    writable: true,
    value: jest.fn(),
});

jest.mock(
    "react-router-dom",
    () => {
        const React = require("react");

        const navigateMock = jest.fn();

        return {
            BrowserRouter: ({ children }) => <div>{children}</div>,
            MemoryRouter: ({ children }) => <div>{children}</div>,
            Link: ({ to, children, ...rest }) => (
                <a href={to} {...rest}>
                    {children}
                </a>
            ),
            Routes: ({ children }) => <div>{children}</div>,
            Route: ({ element }) => element || null,
            useNavigate: () => navigateMock,
        };
    },
    { virtual: true }
);

jest.mock("@vis.gl/react-google-maps", () => {
    const React = require("react");

    return {
        APIProvider: ({ children }) => (
            <div data-testid="api-provider">{children}</div>
        ),
        Map: ({ children }) => <div data-testid="mock-map">{children}</div>,
        Marker: ({ position }) => (
            <div data-testid="mock-marker">
                {position ? `${position.lat},${position.lng}` : "marker"}
            </div>
        ),
        AdvancedMarker: ({ children, onClick }) => (
            <div
                data-testid="mock-advanced-marker"
                role="button"
                tabIndex={0}
                onClick={onClick}
                onKeyDown={() => {}}
            >
                {children}
            </div>
        ),
        useMap: jest.fn(() => ({
            panTo: jest.fn(),
            setZoom: jest.fn(),
            addListener: jest.fn(() => ({
                remove: jest.fn(),
            })),
        })),
    };
});