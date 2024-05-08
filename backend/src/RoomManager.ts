import { MyWebSocket } from "./interfaces.js";

class RoomManager {

    Rooms = new Map<number, MyWebSocket[]>()

    constructor() { }

    getRoom = (roomId: number) => {
        return this.Rooms.get(roomId) ?? null
    }

    addRoom = (roomId: number) => {
        this.Rooms.set(roomId, [])
    }

    getRoomSize = (roomId: number) => {
        const room = this.getRoom(roomId)
        if (room) {
            return room.length
        }
        return 0
    }

    joinRoom = (roomId: number, socket: MyWebSocket) => {
        let room = this.getRoom(roomId)
        if (!room) {
            this.addRoom(roomId)
            room = this.getRoom(roomId)
        }
        room?.push(socket)
        socket.roomId = roomId
    }

    broadcast = (roomId: number, data: string) => {
        const room = this.Rooms.get(roomId)
        room?.forEach((socket: MyWebSocket) => {
            socket.send(data)
        })
    }

    deleteRoom = (roomId: number) => {
        this.Rooms.delete(roomId)
    }

}

const room = new RoomManager()

export default room