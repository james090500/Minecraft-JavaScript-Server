import MCBuffer from './utils/MCBuffer.js'
import logger from './utils/Logger.js'

import HandShakePacket from './serverbound/HandShakePacket.js'
import StatusRequestPacket from './serverbound/status/StatusRequestPacket.js'
import PingRequestPacket from './serverbound/status/PingRequestPacket.js'
import LoginStartPacket from './serverbound/login/LoginStartPacket.js'
import LoginAcknowledgedPacket from './serverbound/login/LoginAcknowledgedPacket.js'
import PluginMessagePacket from './serverbound/configuration/PluginMessagePacket.js'
import ClientInformationPacket from './serverbound/configuration/ClientInformationPacket.js'
import AcknowledgeFinishConfigurationPacket from './serverbound/configuration/AcknowledgeFinishConfigurationPacket.js'

// Register the Packets
const STATUS = [
    {
        id: 0x00,
        class: HandShakePacket,
    },
    {
        id: 0x01,
        class: PingRequestPacket,
    },
]
const LOGIN = [
    {
        id: 0x00,
        class: LoginStartPacket,
    },
    {
        id: 0x03,
        class: LoginAcknowledgedPacket,
    },
]
const CONFIG = [
    {
        id: 0x00,
        class: ClientInformationPacket,
    },
    {
        id: 0x02,
        class: PluginMessagePacket,
    },
    {
        id: 0x03,
        class: AcknowledgeFinishConfigurationPacket,
    },
]
const PLAY = []

// Return Packets
export default {
    handle(connection, data) {
        const stream = new MCBuffer(data)

        while (stream.offset < stream.buffer.length) {
            // 1) Read VarInt packet length
            const packetLength = stream.readVarInt()

            // 2) Make sure this chunk actually contains the whole packet
            if (stream.buffer.length - stream.offset < packetLength) {
                // TODO: if you want to be robust, stash leftover for next time
                logger.warn('Not enough data for full packet, breaking')
                break
            }

            // 3) Slice *exactly* this packet’s body
            const body = stream.buffer.subarray(
                stream.offset,
                stream.offset + packetLength
            )
            stream.offset += packetLength

            // 4) Parse packet body in a fresh MCBuffer
            const packet = new MCBuffer(body)
            const packetId = packet.readVarInt()

            logger.debug(`Handling Packet ID: 0x${packetId.toString(16)}`)

            let packetClass

            if (connection.isReadyForStatus() && packetId === 0x00) {
                packetClass = {
                    id: 0x00,
                    class: StatusRequestPacket,
                }
            } else if (connection.getPhase() === 1) {
                packetClass = STATUS.find((p) => p.id === packetId)
            } else if (connection.getPhase() === 2) {
                packetClass = LOGIN.find((p) => p.id === packetId)
            } else if (connection.getPhase() === 4) {
                packetClass = CONFIG.find((p) => p.id === packetId)
            }

            if (packetClass) {
                packetClass.class.handle(connection, packetLength, packet)
            } else {
                logger.warn(`Unhandled packet ID: 0x${packetId.toString(16)}`)
            }
        }
    },
}
