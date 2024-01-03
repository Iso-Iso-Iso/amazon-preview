import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { CredentialService } from "./services/credential.service";

@Module({
    imports: [HttpModule.register({})],
    providers: [CredentialService],
    exports: [CredentialService],
})
export class UserCredentialManagerModule {}
