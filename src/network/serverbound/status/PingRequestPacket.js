import PongResponsePacket from '../../clientbound/status/PongResponsePacket.js'
import logger from '../../utils/Logger.js'

export default {
    handle(socket, length, packet) {
        logger.debug('Received Ping Request Packet from client')
        const number = packet.readLong()
        PongResponsePacket.handle(socket, number)
    },
}
