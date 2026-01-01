import LoginDisconnectPacket from '../../clientbound/login/LoginDisconnectPacket.js'
import LoginSuccessPacket from '../../clientbound/login/LoginSuccessPacket.js'
import logger from '../../utils/Logger.js'

export default {
    handle(connection, length, packet) {
        logger.debug('Handling LoginStart')

        const username = packet.readString()
        const uuid = packet.readUUID()

        logger.info(
            `Player "${username}, ${uuid}" is starting the login process`
        )

        // Proceed with login process...
        LoginSuccessPacket.handle(connection)
        // LoginDisconnectPacket.handle(connection)
    },
}
