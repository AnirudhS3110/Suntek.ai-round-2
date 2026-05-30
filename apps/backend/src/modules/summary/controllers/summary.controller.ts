import { Controller, Get, UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/common/decorators/currentuser.decorator";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { SummaryService } from "../services/summary.service";

@UseGuards(JwtAuthGuard)
@Controller("summary")
export class SummaryController 
{
  constructor(private readonly summaryService: SummaryService) {}

  @Get("today")
  getTodaySummary(@CurrentUser() user:any) 
  {
    return this.summaryService.getTodaySummary(user.userId);
  }

  @Get("weekly")
  getWeeklySummary(@CurrentUser() user:any) 
  {
    return this.summaryService.getWeeklySummary(user.userId);
  }
}