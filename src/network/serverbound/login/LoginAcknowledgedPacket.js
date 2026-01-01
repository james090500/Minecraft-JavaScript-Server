import logger from '../../utils/Logger.js'

export default {
    handle(connection, length, packet) {
        logger.debug('Received Login Acknowledged Packet from client')
        connection.setPhase(4) // Switch to Configuration state
    },
}
