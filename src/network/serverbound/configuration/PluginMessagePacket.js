import logger from '../../utils/Logger.js'

export default {
    handle(connection, length, packet) {
        logger.debug('Received Plugin Message Packet from client')
    },
}
