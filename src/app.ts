import express, { Express } from "express";
import morgan from "morgan";
import cors from "cors";
import http from "http";
import Sockets from "./models/sockets";
import path from "path";
import socketio from "socket.io";
import mongoose, { ConnectionOptions } from "mongoose";

class App {
  app: Express;
  server: http.Server;
  io: socketio.Server;
  port = process.env.PORT || 3000;
  uriDB =
    process.env.URIDB ||
    `mongodb+srv://cosbiome:Ac03901582@pruebas.2rdch.mongodb.net/chatreact?retryWrites=true&w=majority`;

  dbOptions: ConnectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  constructor() {
    this.app = express();
    this.server = new http.Server(this.app);
    this.io = new socketio.Server(this.server, {
      cors: {
        origin: "*",
      },
    });
  }

  execute(): void {
    this.middlewares();

    this.server.listen(this.port, () => {
      console.log("Server on port " + this.port);
    });

    this.initSockets();
    this.dbConecction();
  }

  initSockets(): void {
    new Sockets(this.io);
  }

  middlewares(): void {
    this.app.use(morgan("dev"));
    this.app.use(cors({ origin: true }));
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.json());
    this.app.use(express.static(path.resolve(__dirname, "../public")));
  }

  dbConecction(): void {
    mongoose.connect(this.uriDB, this.dbOptions);

    const connection = mongoose.connection;

    connection.once("open", () => {
      console.log("Mongodb Connection stablished");
    });

    connection.on("error", (err) => {
      console.log("Mongodb connection error:", err);
      process.exit();
    });
  }
}

export default App;
