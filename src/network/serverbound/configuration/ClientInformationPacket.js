import FinishConfigurationPacket from '../../clientbound/configuration/FinishConfigurationPacket.js'
import RegistryDataPacket from '../../clientbound/configuration/RegistryDataPacket.js'
import SelectKnownPacksPacket from '../../clientbound/configuration/SelectKnownPacksPacket.js'
import logger from '../../utils/Logger.js'

export default {
    handle(connection, length, packet) {
        logger.debug('Handling ClientInformation')

        const locale = packet.readString()

        SelectKnownPacksPacket.handle(connection)
        RegistryDataPacket.handle(connection)

        FinishConfigurationPacket.handle(connection)
    },
}
