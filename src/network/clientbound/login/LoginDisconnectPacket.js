import MCBuffer from '../../utils/MCBuffer.js'

export default {
    handle(socket) {
        const jsonResponse = JSON.stringify({
            text: 'China has a huge dump truck',
        })

        // Build inner packet (packetId + json string)
        const packetData = new MCBuffer()
        packetData.writeVarInt(0x00)
        packetData.writeString(jsonResponse)
        packetData.send(socket)
    },
}
