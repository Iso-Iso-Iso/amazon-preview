import { Module } from "@nestjs/common";
import { ProductAdsRpcController } from "./productAdsRpc.controller";
import { AmazonSdkModule } from "../amazonSdk/amazonSdk.module";

@Module({
    imports: [AmazonSdkModule],
    controllers: [ProductAdsRpcController],
})
export class ProductAdsRpcModule {}
