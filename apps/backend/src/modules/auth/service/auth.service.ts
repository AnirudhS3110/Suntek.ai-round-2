import {ConflictException,Injectable,UnauthorizedException} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "../dto/login.dto";
import { RegisterDto } from "../dto/register.dto";
import { AuthRepositoryService } from "../repository/auth.repository";


@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepositoryService,
    private readonly jwtService: JwtService,
  ) {};

  async register(dto: RegisterDto) 
  {
    const existingUser = await this.authRepository.findByEmail(dto.email);
    if (existingUser) 
      throw new ConflictException("User already exists");

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.authRepository.create(dto.username,dto.email,hashedPassword);

    const accessToken = await this.jwtService.signAsync({sub: user.id,email: user.email});
    return {user,accessToken};
  }

  async login(dto: LoginDto) 
  {
    const user = await this.authRepository.findByEmail(dto.email);
    if (!user) 
      throw new UnauthorizedException("Invalid credentials");
    
    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash,);

    if (!isPasswordValid) 
      throw new UnauthorizedException("Invalid credentials");
    
    const accessToken = await this.jwtService.signAsync({sub: user.id,email: user.email,});

    return {user: {id: user.id,email: user.email,},accessToken};
  }

}