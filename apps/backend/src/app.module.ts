import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { TimelogsModule } from './modules/timelogs/timelogs.module';
import { SummaryModule } from './modules/summary/summary.module';
import { WebsocketModule } from './modules/websocket/websocket.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}),AuthModule,TasksModule,TimelogsModule,SummaryModule, WebsocketModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
