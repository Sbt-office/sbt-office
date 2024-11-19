import { Kafka } from "kafkajs";
import React, { useEffect, useRef } from "react";

const Kafkajs = () => {
  const kafkaRef = useRef(import.meta.env.VITE_KAFKA_URL);
  const topicRef = useRef(import.meta.env.VITE_TOPIC_CO2);

  const kafka = new Kafka({
    clientId: "SBT-Office",
    brokers: [kafkaRef.current],
  });

  const consumer = kafka.consumer({ groupId: "SBT_Office_group" });

  useEffect(() => {
    const kafkaSetup = async () => {
      await consumer.connect();
      await consumer.subscribe({ topic: topicRef.current });
      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          console.log(message);
        },
      });
    };

    kafkaSetup();
  }, [consumer]);

  return <></>;
};

export default Kafkajs;
