import StatusResponsePacket from '../../clientbound/status/StatusResponsePacket.js'
import logger from '../../utils/Logger.js'

export default {
    handle(socket, length, packet) {
        logger.debug('Received Status Request Packet from client')
        StatusResponsePacket.handle(socket)
    },
}
