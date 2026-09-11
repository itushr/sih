import { Kafka, type Producer } from "kafkajs";

let producer: Producer | null = null;

const getBroker = () =>
    process.env.KAFKA_BROKER ?? "localhost:19092";

const getTopic = () =>
    process.env.KAFKA_WORKFLOW_TOPIC ?? "workflow.tasks";

export async function getWorkflowProducer(): Promise<Producer> {
    if (producer) {
        return producer;
    }

    const kafka = new Kafka({
        clientId:
            process.env.KAFKA_CLIENT_ID ??
            "interop-core",
        brokers: [getBroker()],
    });

    producer = kafka.producer();
    await producer.connect();

    return producer;
}

export async function enqueueWorkflowRun(
    runningWorkflowId: string
): Promise<void> {
    const kafkaProducer =
        await getWorkflowProducer();

    await kafkaProducer.send({
        topic: getTopic(),
        messages: [
            {
                key: runningWorkflowId,
                value: JSON.stringify({
                    runningWorkflowId,
                }),
            },
        ],
    });
}
