import MCBuffer from '../../utils/MCBuffer.js'

export default {
    handle(socket) {
        const packetData = new MCBuffer()
        packetData.writeVarInt(0x03)
        packetData.send(socket)
    },
}
