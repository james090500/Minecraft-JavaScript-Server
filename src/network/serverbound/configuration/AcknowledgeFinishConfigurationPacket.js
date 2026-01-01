import { log } from 'console'
import FinishConfigurationPacket from '../../clientbound/configuration/FinishConfigurationPacket.js'
import logger from '../../utils/Logger.js'
import LoginPlayPacket from '../../clientbound/play/LoginPlayPacket.js'

export default {
    handle(connection, length, packet) {
        logger.debug('Handling AcknowledgeFinishConfigurationPacket')
        connection.setPhase(5) // Switch to Play state

        LoginPlayPacket.handle(connection)
    },
}
