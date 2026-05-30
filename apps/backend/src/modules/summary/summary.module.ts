import { Module } from "@nestjs/common";
import { SummaryController } from "./controllers/summary.controller";
import { SummaryRepository } from "./repository/summary.repository";
import { SummaryService } from "./services/summary.service";

@Module({
  controllers:[SummaryController],
  providers:[SummaryRepository,SummaryService],
})
export class SummaryModule {}