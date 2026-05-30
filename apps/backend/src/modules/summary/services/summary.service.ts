import { Injectable } from "@nestjs/common";
import { SummaryRepository } from "../repository/summary.repository"; 

@Injectable()
export class SummaryService 
{
  constructor(private readonly summaryRepository: SummaryRepository) {}

  async getTodaySummary(userId:string) 
  {
    const startOfDay = new Date();
    startOfDay.setHours(0,0,0,0);
    const endOfDay = new Date();
    endOfDay.setHours(23,59,59,999);
    return this.summaryRepository.getTodaySummary(userId,startOfDay,endOfDay);
  }

  async getWeeklySummary(userId:string) 
  {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    startDate.setHours(0,0,0,0);
    return this.summaryRepository.getWeeklySummary(userId,startDate);
  }
}