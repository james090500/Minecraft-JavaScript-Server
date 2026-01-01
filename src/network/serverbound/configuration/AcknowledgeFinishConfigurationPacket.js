import { log } from 'console'
import SyncPlayerPositionPacket from '../../clientbound/play/SyncPlayerPositionPacket.js'
import logger from '../../utils/Logger.js'
import LoginPlayPacket from '../../clientbound/play/LoginPlayPacket.js'

export default {
    handle(connection, length, packet) {
        logger.debug('Handling AcknowledgeFinishConfigurationPacket')
        connection.setPhase(5) // Switch to Play state

        LoginPlayPacket.handle(connection)

        SyncPlayerPositionPacket.handle(connection)

        // Set centre chunk
        // send chunk data
    },
}
