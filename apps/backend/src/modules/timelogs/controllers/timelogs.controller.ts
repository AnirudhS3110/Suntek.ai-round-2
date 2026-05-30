import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/common/decorators/currentuser.decorator";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { StartTimerDto } from "../dto/start-timer.dto";
import { TimelogsService } from "../services/timelogs.service";

@UseGuards(JwtAuthGuard)
@Controller("timelogs")
export class TimelogsController 
{
  constructor(private readonly timelogsService: TimelogsService) {}

  @Post("start")
  start(@CurrentUser() user:any,@Body() dto:StartTimerDto) {
    return this.timelogsService.start(user.userId,dto);
  }

  @Post("stop")
  stop(@CurrentUser() user:any) {
    return this.timelogsService.stop(user.userId);
  }

  @Get()
  findAll(@CurrentUser() user:any) {
    return this.timelogsService.findAll(user.userId);
  }
}