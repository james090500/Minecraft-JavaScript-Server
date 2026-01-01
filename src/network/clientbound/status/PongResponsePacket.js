import MCBuffer from '../../utils/MCBuffer.js'

export default {
    handle(socket, number) {
        const packetData = new MCBuffer()
        packetData.writeVarInt(0x01)
        packetData.writeLong(number)
        packetData.send(socket)
        socket.end()
    },
}
