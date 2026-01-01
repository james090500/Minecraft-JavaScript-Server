import MCBuffer from '../../utils/MCBuffer.js'

export default {
    handle(socket) {
        const statusResponse = {
            version: {
                name: '1.21.11',
                protocol: 774,
            },
            players: {
                max: 100,
                online: 5,
                sample: [],
            },
            description: {
                text: 'A Minecraft Server',
            },
            enforcesSecureChat: false,
        }

        const jsonResponse = JSON.stringify(statusResponse)

        // Build inner packet (packetId + json string)
        const packetData = new MCBuffer()
        packetData.writeVarInt(0x00)
        packetData.writeString(jsonResponse)
        packetData.send(socket)
    },
}
