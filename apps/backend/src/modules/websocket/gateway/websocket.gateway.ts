import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
  cors:{
    origin:"*",
    credentials:true,
  },
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect 
{
  @WebSocketServer()
  server:Server;

  handleConnection(client:Socket) 
  {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client:Socket) 
  {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("join")
  handleJoinRoom(@MessageBody() userId:string,@ConnectedSocket() client:Socket) 
  {
    client.join(userId);
  }

  emitTimerStarted(userId:string,data:any) 
  {
    this.server.to(userId).emit("timerStarted",data);
  }

  emitTimerStopped(userId:string,data:any) 
  {
    this.server.to(userId).emit("timerStopped",data);
  }
}