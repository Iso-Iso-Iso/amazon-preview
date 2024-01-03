import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import * as path from "path";

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
        transport: Transport.GRPC,
        options: {
            package: ["Campaign", "Profile", "AdGroups"],
            protoPath: [
                path.resolve("protobuf", "campaign.proto"),
                path.resolve("protobuf", "profile.proto"),
                path.resolve("protobuf", "adGroups.proto"),
            ],
            url: "localhost:3000",
        },
    });

    await app.listen();
}
bootstrap();
