import { RawData, WebSocketServer } from 'ws'
import { v4 as uuidv4 } from 'uuid'
import { MyWebSocket, WsRequest } from './interfaces.js'
import RoomManager from './RoomManager.js'
import GameManager from './GameManager.js'

const wss: WebSocketServer = new WebSocketServer({ port: 6969 })

const room = new RoomManager()
const game = new GameManager()

wss.on('connection', (socket: MyWebSocket) => {

    socket.id = uuidv4()
    console.log(`Connected: ${socket.id}`)

    socket.on('message', (data: RawData) => {
        const msg: WsRequest = JSON.parse(data.toString())
        switch (msg.type) {
            case 'CREATE_ROOM': {
                room.createRoom(socket)
                break
            }
            case 'JOIN_ROOM': {
                room.joinRoom(Number(msg.data), socket)
                break
            }
            case 'START_GAME': {
                game.startGame(socket.roomId)
                break
            }
            case 'MOVE': {
                game.move(socket.roomId, { player: socket, position: msg.data })
                break
            }
            default: socket.send('Invalid Request')
        }
    })


    socket.on('close', (code) => {
        console.log(`Disconnected: ${socket.id} code: ${code}`)
        room.deleteRoom(socket.roomId)
        game.deleteGame(socket.roomId)
    })

})