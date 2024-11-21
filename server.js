import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { cwd } from "node:process";
import { Kafka } from "kafkajs";
import { Server } from "socket.io";

// server
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = false;

function resolvePath(p) {
  return path.resolve(__dirname, p);
}
function getIndexFilePath() {
  return isProd ? resolvePath("dist/index.html") : resolvePath("index.html");
}

export async function createServer() {
  const resolvePath = (p) => path.resolve(__dirname, p);
  const app = express();

  let vite = undefined;
  if (isProd) {
    let compression = await import("compression");
    let serve_static = await import("serve-static");
    app.use(compression.default());
    app.use(
      serve_static.default(resolvePath("dist/client"), {
        index: false,
      })
    );
  } else {
    vite = await import("vite");
    vite = await vite.createServer({
      cwd,
      logLevel: "info",
      server: {
        middlewareMode: true,
        watch: {
          usePolling: true,
          interval: 100,
        },
      },
      appType: "custom",
    });
    app.use(vite.middlewares);
  }

  let template = fs.readFileSync(getIndexFilePath(), "utf-8");

  let getServerRender;
  if (isProd) {
    getServerRender = (await import("./dist/server/entry-server.js")).getServerRender;
  }

  app.use("*", async (req, res) => {
    try {
      const queryClient = new QueryClient();

      const url = req.originalUrl;

      let requestTemplate = template;

      let render;
      if (isProd) {
        render = getServerRender(queryClient);
      } else {
        requestTemplate = fs.readFileSync(getIndexFilePath(), "utf-8");
        requestTemplate = await vite.transformIndexHtml(url, requestTemplate);

        render = (await vite.ssrLoadModule("/src/entry-server.jsx")).getServerRender(queryClient);
      }

      const context = {};
      const appHtml = render(url, context);

      if (context.url) {
        return res.redirect(301, context.url);
      }

      let html = requestTemplate.replace(`<!--app-html-->`, appHtml);
      html = html.replace(`<!--query-state-->`, JSON.stringify(dehydrate(queryClient)));

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      !isProd && vite.ssrFixStacktrace(e);
      console.log(e.stack);
      res.status(500).end(e.stack);
    }
  });

  return { app, vite };
}

// createServer().then(({ app }) => app.listen(3000));

const http = await createServer();
const server = http.app.listen(3000);

// socket
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("connected: " + socket.id);

  socket.on("disconnect", () => {
    console.log("disconnected: " + socket.id);
  });
});

// kafka
const kafka = new Kafka({
  clientId: "SBT-Office",
  brokers: ["192.168.0.75:9092"],
  connectionTimeout: 10000,
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
});

const consumer = kafka.consumer({ groupId: "SBT_Office_group" });

const topicCO2 = "raspberry60-MHZ19B";
const topicTemp = "raspberry42-DHT22";
const topicDist = "raspberry42-HC-SR04";

const kafkaData = { co2: "0", temp: "0", humidity: "0", dist: "0" };

await consumer.connect();
await consumer.subscribe({ topics: [topicCO2, topicTemp, topicDist] });
await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    const value = message.value.toString();
    console.log(value);
    if (topic === topicCO2) {
      kafkaData.co2 = value.split(": ")[1];
    } else if (topic === topicTemp) {
      const split = value.split(", ");
      kafkaData.temp = split[0].split(": ")[1];
      kafkaData.humidity = split[1].split(": ")[1];
    } else if (topic === topicDist) {
      kafkaData.dist = value.split(": ")[1];
    }

    io.emit("kafka", kafkaData);
  },
});
