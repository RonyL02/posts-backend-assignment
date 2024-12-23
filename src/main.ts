import { initApp } from "./app";

const start = async ()=>{
    const app = await initApp();

    const port = process.env.PORT;

    app.listen(port, () => {
        console.log(`Posts backend is running on port ${port} 🖼️`);
    });
}

start();

