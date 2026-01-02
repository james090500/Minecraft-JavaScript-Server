import { log } from 'console'
import SyncPlayerPositionPacket from '../../clientbound/play/SyncPlayerPositionPacket.js'
import logger from '../../utils/Logger.js'
import LoginPlayPacket from '../../clientbound/play/LoginPlayPacket.js'
import MCBuffer from '../../utils/MCBuffer.js'

export default {
    handle(connection, length, packet) {
        logger.debug('Handling AcknowledgeFinishConfigurationPacket')
        connection.setPhase(5) // Switch to Play state

        LoginPlayPacket.handle(connection)

        SyncPlayerPositionPacket.handle(connection)

        // Set centre chunk
        const centreChunk = new MCBuffer()
        centreChunk.writeVarInt(0x5c) // packet id
        centreChunk.writeVarInt(0) // chunkX
        centreChunk.writeVarInt(0) // chunkZ
        centreChunk.send(connection)

        const gameEvent = new MCBuffer()
        gameEvent.writeVarInt(0x26) // packet id
        gameEvent.writeUByte(13) // event id
        gameEvent.writeFloat(0) // event data
        gameEvent.send(connection)

        // send chunk data
        const chunkData = new MCBuffer()

        chunkData.writeVarInt(0x2c) // packet id
        chunkData.writeInt(0) // chunk X
        chunkData.writeInt(0) // chunk Z

        // --- Chunk Data ---
        // Heightmaps (NBT Compound)
        chunkData.writeEmptyNbtCompound()

        // Data (byte array prefixed by VarInt length)
        chunkData.writeVarInt(0) // data length
        // (no bytes)

        // Block Entities (count)
        chunkData.writeVarInt(0) // 0 block entities

        // --- Light Data ---
        // Trust Edges (required by the light update data structure)
        chunkData.writeBoolean(true)

        // Masks
        chunkData.writeBitset([]) // sky light mask
        chunkData.writeBitset([]) // block light mask
        chunkData.writeBitset([]) // empty sky light mask
        chunkData.writeBitset([]) // empty block light mask

        // Sky light arrays (count)
        chunkData.writeVarInt(0)

        // Block light arrays (count)
        chunkData.writeVarInt(0)

        chunkData.send(connection)
    },
}
