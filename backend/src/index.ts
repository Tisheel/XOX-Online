import { RawData, WebSocketServer } from 'ws'
import { v4 as uuidv4 } from 'uuid'
import { MyWebSocket, WsRequest } from './interfaces.js'
import { Game, GameManager } from './GameManager.js'
import room from './RoomManager.js'

const wss: WebSocketServer = new WebSocketServer({ port: Number(process.env.PORT) || 6969 })

const games = new GameManager()

wss.on('connection', (socket: MyWebSocket) => {

    socket.id = uuidv4()
    console.log(`Connected: ${socket.id}`)

    socket.on('message', (data: RawData) => {
        const msg: WsRequest = JSON.parse(data.toString())
        switch (msg.type) {
            case 'JOIN_ROOM': {
                socket.name = msg.data.name
                const roomId = Number(msg.data.roomId)
                if (room.getRoomSize(roomId) === 2) {
                    socket.send(JSON.stringify({
                        type: 'ROOM_ERR',
                        data: 'Room is full'
                    }))
                    return
                }
                room.joinRoom(roomId, socket)
                room.broadcast(roomId, JSON.stringify({
                    type: 'ROOM_JOIN',
                    data: room.getRoom(roomId)?.map(x => x.name)
                }))
                if (room.getRoomSize(roomId) === 2) {
                    socket.game = new Game(socket.roomId)
                }
                break
            }
            case 'MOVE': {
                const game = games.getGame(socket.roomId)
                game?.move(socket.roomId, { player: socket, position: msg.data })
                break
            }
            default: socket.send('Invalid Request')
        }
    })

    socket.on('close', (code) => {
        console.log(`Disconnected: ${socket.id} code: ${code}`)
        room.deleteRoom(socket.roomId)
        games.deleteGame(socket.roomId)
    })

})