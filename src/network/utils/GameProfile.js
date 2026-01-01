export default class GameProfile {
    /**
     * @param {string} id        UUID string: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
     * @param {string} name      Player name
     * @param {Array<{ name: string, value: string, signature?: string | null }>} properties
     */
    constructor(id, name, properties = []) {
        this.id = id
        this.name = name
        this.properties = properties
    }

    /**
     * Write this profile into a MCBuffer in the format used by Login Success.
     * @param {MCBuffer} buffer
     */
    writeToBuffer(buffer) {
        // UUID (128-bit, msb then lsb)
        buffer.writeUUID(this.id)

        // Name (String)
        buffer.writeString(this.name)

        // Properties (VarInt count + entries)
        buffer.writeVarInt(this.properties.length)

        for (const prop of this.properties) {
            buffer.writeString(prop.name)
            buffer.writeString(prop.value)

            const hasSignature = prop.signature != null
            buffer.writeBoolean(hasSignature)

            if (hasSignature) {
                buffer.writeString(prop.signature)
            }
        }
    }

    /**
     * Very simple factory for an "offline" profile with no properties.
     * (Does NOT implement Mojang's real offline UUID algorithm – just a helper.)
     */
    static simple(id, name) {
        return new GameProfile(id, name, [])
    }
}
