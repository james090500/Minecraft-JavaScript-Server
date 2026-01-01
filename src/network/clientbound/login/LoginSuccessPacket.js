import MCBuffer from '../../utils/MCBuffer.js'
import GameProfile from '../../utils/GameProfile.js'

export default {
    handle(socket) {
        const profile = new GameProfile(
            'ba4161c0-3a42-496c-8ae0-7d13372f3371',
            'james090500'
        )
        const packetData = new MCBuffer()
        packetData.writeVarInt(0x02)
        profile.writeToBuffer(packetData)
        packetData.send(socket)
    },
}
