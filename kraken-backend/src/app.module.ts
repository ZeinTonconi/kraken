import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { WalletModule } from './wallet/wallet.module';
import { TeamsModule } from './teams/teams.module';
import { CommonModule } from './common/common.module';
import { PrismaModule } from './prisma/prisma.module';
import { RotationProgramModule } from './rotation-program/rotation-program.module';
import { OfferingsModule } from './offerings/offerings.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { MeModule } from './me/me.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProfilesModule,
    WalletModule,
    TeamsModule,
    CommonModule,
    RotationProgramModule,
    OfferingsModule,
    EnrollmentsModule,
    MeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
