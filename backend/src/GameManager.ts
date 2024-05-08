import room from "./RoomManager.js"
import { Move, MyWebSocket } from "./interfaces.js"

const Games = new Map<number, Game>()

export class GameManager {

    constructor() { }

    getGame = (roomId: number) => {
        return Games.get(roomId) ?? null
    }

    addGame = (roomId: number, game: Game) => {
        Games.set(roomId, game)
    }

    deleteGame = (roomId: number) => {
        Games.delete(roomId)
    }

}

export class Game extends GameManager {
    roomId: number
    players: MyWebSocket[]
    turn: number
    board: number[]
    constructor(roomId: number) {
        super()
        this.roomId = roomId
        this.players = room.getRoom(roomId) ?? []
        this.turn = 1
        this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0]
        this.addGame(roomId, this)
        room.broadcast(roomId, JSON.stringify({
            type: 'GAME_STATE',
            data: {
                players: this.players.map(x => x.name),
                turn: this.turn,
                board: this.board
            }
        }))
    }

    move = (roomId: number, move: Move) => {
        if (this.players[this.turn - 1].id !== move.player.id) {
            move.player.send(JSON.stringify({
                type: 'ILLEGAL_MOVE',
                data: 0
            }))
            return
        }
        this.board[move.position] = this.turn
        this.turn === 1 ? this.turn = 2 : this.turn = 1
        room.broadcast(roomId, JSON.stringify({
            type: 'GAME_STATE',
            data: {
                players: this.players.map(x => x.name),
                turn: this.turn,
                board: this.board
            }
        }))
        const winner: number = checkWinner(this.board)
        if (winner) {
            room.broadcast(roomId, JSON.stringify({
                type: 'WINNER',
                data: this.players[winner - 1].name
            }))
            return
        }
    }
}

function checkWinner(board: number[]) {
    // Check rows
    for (let i = 0; i < 9; i += 3) {
        if (board[i] === board[i + 1] && board[i] === board[i + 2] && board[i] !== 0) {
            return board[i];
        }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
        if (board[i] === board[i + 3] && board[i] === board[i + 6] && board[i] !== 0) {
            return board[i];
        }
    }

    // Check diagonals
    if ((board[0] === board[4] && board[0] === board[8] && board[0] !== 0) ||
        (board[2] === board[4] && board[2] === board[6] && board[2] !== 0)) {
        return board[4];
    }

    return 0; // No winner yet
}