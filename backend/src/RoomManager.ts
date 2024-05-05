import { MyWebSocket } from "./interfaces.js";

const Rooms = new Map<number, MyWebSocket[]>()

export default class RoomManager {

    constructor() { }

    getRoom = (roomId: number) => {
        return Rooms.get(roomId) ?? []
    }

    createRoom = (socket: MyWebSocket) => {
        const roomId: number = Math.floor(100000 + Math.random() * 900000)
        Rooms.set(roomId, [])
        socket.send(`Room ID: ${roomId}`)
        this.joinRoom(roomId, socket)
    }

    joinRoom = (roomId: number, socket: MyWebSocket) => {
        const room = Rooms.get(roomId)
        if (!room) {
            socket.send(`Room ID ${roomId} not found`)
            return
        }
        if (room.length === 2) {
            socket.send(`Room limit exceeded`)
            return
        }
        room?.push(socket)
        socket.roomId = roomId
        this.broadcast(roomId, `Socket ${socket.id} joined`)
    }

    broadcast = (roomId: number, data: string) => {
        const room = Rooms.get(roomId)
        room?.forEach((socket: MyWebSocket) => {
            socket.send(data)
        })
    }

    deleteRoom = (roomId: number) => {
        this.broadcast(roomId, 'Room deleted')
        Rooms.delete(roomId)
    }

}