import WebSocket from "ws"
import { Game } from "./GameManager.js"

export interface MyWebSocket extends WebSocket {
    id: string,
    name: string,
    roomId: number,
    game: Game
}

export interface WsRequest {
    type: string,
    data?: any
}

export interface Move {
    player: MyWebSocket,
    position: number
}