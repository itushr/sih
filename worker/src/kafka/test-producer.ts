import "dotenv/config";
import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: "test-backend",
    brokers: [
        process.env.KAFKA_BROKER ?? "localhost:19092",
    ],
});

const producer = kafka.producer();

const runningWorkflowId = "a06ddc46-367c-4771-b83b-cbf18da8c3c8";

await producer.connect();

await producer.send({
    topic: "workflow.tasks",
    messages: [
        {
            key: runningWorkflowId,
            value: JSON.stringify({
                runningWorkflowId,
            }),
        },
    ],
});

console.log(
    `Workflow ${runningWorkflowId} triggered`
);

await producer.disconnect();