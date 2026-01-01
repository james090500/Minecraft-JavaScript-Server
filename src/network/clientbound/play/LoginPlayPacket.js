import MCBuffer from '../../utils/MCBuffer.js'

export default {
    handle(socket) {
        // Build inner packet (packetId + json string)
        const packetData = new MCBuffer()
        packetData.writeVarInt(0x30)
        packetData.writeInt(30) // EnntityId
        packetData.writeBoolean(false) // Hardcore

        // "Prefixed Array"
        packetData.writeVarInt(1) // number of dimensions
        packetData.writeString('minecraft:overworld') // Identifier

        packetData.writeVarInt(20) // Max Players
        packetData.writeVarInt(10) // View Distance
        packetData.writeVarInt(6) // Simulation Distance
        packetData.writeBoolean(false) // Reduced Debug Info
        packetData.writeBoolean(true) // Enable Respawn Screen
        packetData.writeBoolean(false) // Limited Crafting
        packetData.writeVarInt('minecraft:overworld') // Dimension Type
        packetData.writeString('minecraft:overworld') // Dimension Name
        packetData.writeLong(0n) // Seed
        packetData.writeUByte(3) // Spectator GameMode
        packetData.writeByte(-1) // Previous Gamemode
        packetData.writeBoolean(false) // Debug World
        packetData.writeBoolean(false) // Flat World
        packetData.writeBoolean(false) // Death Dimension
        packetData.writeVarInt(0) // Portal Cooldown
        packetData.writeVarInt(64) // Sea Level
        packetData.writeBoolean(false) // Enforce Secure Chat
        packetData.send(socket)
    },
}
