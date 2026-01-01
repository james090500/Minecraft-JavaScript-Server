import logger from '../utils/Logger.js'
import StatusResponsePacket from '../clientbound/status/StatusResponsePacket.js'

export default {
    handle(connection, length, packet) {
        logger.debug('Handling HandshakeClientPacket')

        const protocolVersion = packet.readVarInt()
        const serverAddress = packet.readString()
        const serverPort = packet.readUShort()
        const nextState = packet.readVarInt()

        if (nextState == 1) {
            logger.debug('Client is requesting status')
            connection.setPhase(1) // Switch to Status state
            connection.waitForStatus()
        } else if (nextState == 2) {
            connection.setPhase(2) // Switch to Login state
            logger.debug('Client is requesting login')
        } else if (nextState == 3) {
            logger.debug('Client is requesting transfer')
        }
    },
}
