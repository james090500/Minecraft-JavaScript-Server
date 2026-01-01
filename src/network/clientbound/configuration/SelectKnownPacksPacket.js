import logger from '../../utils/Logger.js'
import MCBuffer from '../../utils/MCBuffer.js'

export default {
    handle(connection, length, packet) {
        logger.debug('Sending SelectKnownPacksPacket to client')

        const packetData = new MCBuffer()
        packetData.writeVarInt(0x0e) // Packet ID
        packetData.writeVarInt(1) // Number of packs
        packetData.writeString('minecraft')
        packetData.writeString('core')
        packetData.writeString('1.21.11')

        packetData.send(connection)
    },
}
