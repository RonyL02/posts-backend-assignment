import { initApp, initSwagger } from "./app";

const start = async () => {
    const app = await initApp();

    const port = process.env.PORT;

    if (process.env.NODE_ENV === 'dev') {
        initSwagger(app);
    }

    app.listen(port, () => {
        console.log(`Posts backend is running on port ${port} 🖼️`);
    });
}

start();

