import MCBuffer from '../../utils/MCBuffer.js'
import GameProfile from '../../utils/GameProfile.js'

export default {
    handle(socket) {
        const profile = new GameProfile(
            '00000000-0000-0000-0000-000000000000',
            'Player'
        )
        const packetData = new MCBuffer()
        packetData.writeVarInt(0x02)
        profile.writeToBuffer(packetData)
        packetData.send(socket)
    },
}
