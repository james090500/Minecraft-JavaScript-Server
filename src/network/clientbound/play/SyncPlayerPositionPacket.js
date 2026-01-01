import MCBuffer from '../../utils/MCBuffer.js'

export default {
    handle(socket) {
        // Build inner packet (packetId + json string)
        const packetData = new MCBuffer()

        packetData.writeVarInt(0x46) // Packet ID for Sync Player Position

        packetData.writeVarInt(10) // Teleport ID
        packetData.writeDouble(0) // X
        packetData.writeDouble(64) // Y
        packetData.writeDouble(0) // Ze2
        packetData.writeDouble(0) // Velocity X
        packetData.writeDouble(0) // Velocity Y
        packetData.writeDouble(0) // Velocity Z
        packetData.writeFloat(0) // Yaw
        packetData.writeFloat(0) // Pitch
        packetData.writeInt(0) // Teleport Flags

        packetData.send(socket)
    },
}
