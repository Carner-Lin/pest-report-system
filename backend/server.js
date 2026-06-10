const app = require("./app");

// This file starts the Express server.

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});