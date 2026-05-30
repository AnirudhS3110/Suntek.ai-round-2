import {IsEnum,IsOptional,IsString,MaxLength,} from "class-validator";

export enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status: TaskStatus;
}