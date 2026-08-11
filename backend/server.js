import app, { connectDatabase } from "./src/app.js";

const PORT = process.env.PORT || 8080;

try {
    await connectDatabase();
    app.listen(PORT, () => {
        console.log(`CDC Backend Express API rodando na porta ${PORT}`);
    });
} catch {
    process.exit(1);
}
