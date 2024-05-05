import WebSocket from "ws"

export interface MyWebSocket extends WebSocket {
    id: string,
    roomId: number
}

export interface WsRequest {
    type: string,
    data?: any
}

export interface Game {
    turn: number
    board: number[]
    players: MyWebSocket[]
}

export interface Move {
    player: MyWebSocket,
    position: number
}