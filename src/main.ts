import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import * as path from "path";

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
        transport: Transport.GRPC,
        options: {
            package: ["Campaign", "Profile", "AdGroups", "Metrics", "ProductAds"],
            protoPath: [
                path.resolve("src", "protobuf", "campaign.proto"),
                path.resolve("src", "protobuf", "profile.proto"),
                path.resolve("src", "protobuf", "adGroups.proto"),
                path.resolve("src", "protobuf", "metrics.proto"),
                path.resolve("src", "protobuf", "productAds.proto"),
            ],
            url: "localhost:3000",
        },
    });

    await app.listen();
}
bootstrap();
