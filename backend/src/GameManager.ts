import RoomManager from "./RoomManager.js"
import { Game, Move } from "./interfaces.js"

const Games = new Map<number, Game>()

const room = new RoomManager()

export default class GameManager {

    constructor() { }

    startGame = (roomId: number) => {
        const players = room.getRoom(roomId)
        const game: Game = {
            turn: 1,
            board: [0, 0, 0, 0, 0, 0, 0, 0, 0],
            players
        }
        Games.set(roomId, game)
        this.boradcastTurn(roomId)
        this.boradcastBoard(roomId)
    }

    getTurn = (roomId: number) => {
        return Games.get(roomId)?.turn ?? -1
    }

    setTurn = (roomId: number, turn: number) => {
        const game = Games.get(roomId)
        if (game)
            game.turn = turn
    }

    getBoard = (roomId: number) => {
        return Games.get(roomId)?.board ?? []
    }

    getPlayers = (roomId: number) => {
        return Games.get(roomId)?.players ?? []
    }

    boradcastTurn = (roomId: number) => {

        room.broadcast(roomId, JSON.stringify({
            type: 'TURN',
            data: this.getPlayers(roomId)[this.getTurn(roomId) - 1].id
        }))

    }

    boradcastBoard = (roomId: number) => {

        room.broadcast(roomId, JSON.stringify({
            type: 'BOARD',
            data: this.getBoard(roomId)
        }))

    }

    move = (roomId: number, move: Move) => {
        if (this.getPlayers(roomId)[this.getTurn(roomId) - 1].id !== move.player.id) {
            move.player.send('Not your turn')
            return
        }
        this.getBoard(roomId)[move.position] = this.getTurn(roomId)
        const winner: number = checkWinner(this.getBoard(roomId))
        if (winner) {
            room.broadcast(roomId, JSON.stringify({
                type: 'WINNER',
                data: this.getPlayers(roomId)[winner - 1]
            }))
        }
        this.getTurn(roomId) === 1 ? this.setTurn(roomId, 2) : this.setTurn(roomId, 1)
        this.boradcastTurn(roomId)
        this.boradcastBoard(roomId)
    }

    deleteGame = (roomId: number) => {
        Games.delete(roomId)
    }

}

function checkWinner(board: number[]) {
    // Define winning combinations (indices)
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ]

    // Check each winning combination
    for (const combo of winningCombos) {
        const [a, b, c] = combo
        if (board[a] !== 0 && board[a] === board[b] && board[a] === board[c]) {
            return board[a] // Return the winning player
        }
    }

    return 0 // If no winner
}