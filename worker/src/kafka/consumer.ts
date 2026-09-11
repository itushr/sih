import { Kafka } from "kafkajs";
import { executeWorkflow } from "../workflow/executor.js";

const kafka = new Kafka({
    clientId:
        process.env.KAFKA_CLIENT_ID ??
        "interop-worker",

    brokers: [
        process.env.KAFKA_BROKER ??
        "localhost:19092",
    ],
});

const consumer = kafka.consumer({
    groupId:
        process.env.KAFKA_GROUP_ID ??
        "interop-workflow-workers",
});

export async function startConsumer() {
    await consumer.connect();

    await consumer.subscribe({
        topic:
            process.env.KAFKA_WORKFLOW_TOPIC ??
            "workflow.tasks",

        fromBeginning: false,
    });

    console.log(
        "Connected to Redpanda."
    );

    console.log(
        "Waiting for workflow jobs..."
    );

    await consumer.run({
        eachMessage: async ({ message }) => {
            if (!message.value) {
                return;
            }

            const data = JSON.parse(
                message.value.toString()
            );

            const workflowId =
                data.runningWorkflowId;

            if (
                typeof workflowId !== "string"
            ) {
                throw new Error(
                    "Invalid workflow job"
                );
            }

            console.log(
                `Received workflow run ${workflowId}`
            );

            await executeWorkflow(
                workflowId
            );
        },
    });
}
