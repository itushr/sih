import "dotenv/config";
import { startConsumer } from "./kafka/consumer.js";

async function main() {
    console.log(
        "Starting Interop Worker..."
    );

    await startConsumer();
}

main().catch((error) => {
    console.error(
        "Worker crashed:",
        error
    );

    process.exit(1);
});
