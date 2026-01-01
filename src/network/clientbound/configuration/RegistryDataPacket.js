import logger from '../../utils/Logger.js'
import MCBuffer from '../../utils/MCBuffer.js'

export default {
    handle(connection, length, packet) {
        const registry = [
            {
                name: 'minecraft:dimension_type',
                entries: [{ name: 'minecraft:overworld', nbt: null }],
            },
            {
                name: 'minecraft:cat_variant',
                entries: [{ name: 'minecraft:black', nbt: null }],
            },
            {
                name: 'minecraft:chicken_variant',
                entries: [{ name: 'minecraft:cold', nbt: null }],
            },
            {
                name: 'minecraft:cow_variant',
                entries: [{ name: 'minecraft:cold', nbt: null }],
            },
            {
                name: 'minecraft:frog_variant',
                entries: [{ name: 'minecraft:cold', nbt: null }],
            },
            {
                name: 'minecraft:painting_variant',
                entries: [{ name: 'minecraft:alban', nbt: null }],
            },
            {
                name: 'minecraft:pig_variant',
                entries: [{ name: 'minecraft:cold', nbt: null }],
            },
            {
                name: 'minecraft:wolf_sound_variant',
                entries: [{ name: 'minecraft:classic', nbt: null }],
            },
            {
                name: 'minecraft:wolf_variant',
                entries: [{ name: 'minecraft:black', nbt: null }],
            },
            {
                name: 'minecraft:zombie_nautilus_variant',
                entries: [{ name: 'minecraft:temperate', nbt: null }],
            },
            {
                name: 'minecraft:worldgen/biome',
                entries: [{ name: 'minecraft:plains', nbt: null }],
            },
            {
                name: 'minecraft:damage_type',
                entries: [
                    { name: 'minecraft:cactus', nbt: null },
                    { name: 'minecraft:campfire', nbt: null },
                    { name: 'minecraft:cramming', nbt: null },
                    { name: 'minecraft:dragon_breath', nbt: null },
                    { name: 'minecraft:drown', nbt: null },
                    { name: 'minecraft:dry_out', nbt: null },
                    { name: 'minecraft:ender_pearl', nbt: null },
                    { name: 'minecraft:fall', nbt: null },
                    { name: 'minecraft:fly_into_wall', nbt: null },
                    { name: 'minecraft:freeze', nbt: null },
                    { name: 'minecraft:generic', nbt: null },
                    { name: 'minecraft:generic_kill', nbt: null },
                    { name: 'minecraft:hot_floor', nbt: null },
                    { name: 'minecraft:in_fire', nbt: null },
                    { name: 'minecraft:in_wall', nbt: null },
                    { name: 'minecraft:lava', nbt: null },
                    { name: 'minecraft:lightning_bolt', nbt: null },
                    { name: 'minecraft:magic', nbt: null },
                    { name: 'minecraft:on_fire', nbt: null },
                    { name: 'minecraft:out_of_world', nbt: null },
                    { name: 'minecraft:outside_border', nbt: null },
                    { name: 'minecraft:stalagmite', nbt: null },
                    { name: 'minecraft:starve', nbt: null },
                    { name: 'minecraft:sweet_berry_bush', nbt: null },
                    { name: 'minecraft:wither', nbt: null },
                ],
            },
        ]

        const tags = [
            {
                name: 'minecraft:timeline',
                entries: [{ name: 'minecraft:in_overworld', ids: [0] }],
            },
            // {
            //     name: 'minecraft:worldgen/biome',
            //     entries: [{ name: 'minecraft:plains', ids: [0] }],
            // },
        ]

        logger.debug('Handling RegistryData')

        // Registries
        for (const reg of registry) {
            const regPacket = new MCBuffer()
            regPacket.writeVarInt(0x07) // Packet ID for Registry Data
            regPacket.writeString(reg.name)

            regPacket.writeVarInt(reg.entries.length) // Number of entries
            for (const entry of reg.entries) {
                regPacket.writeString(entry.name)
                regPacket.writeVarInt(0) // No NBT
            }
            regPacket.send(connection)
        }

        //Tags
        const tagPacket = new MCBuffer()
        tagPacket.writeVarInt(0x0d) // Packet ID for Update Tags
        tagPacket.writeVarInt(tags.length)
        for (const tag of tags) {
            tagPacket.writeString(tag.name)

            tagPacket.writeVarInt(tag.entries.length) // Number of entries
            for (const entry of tag.entries) {
                tagPacket.writeString(entry.name)
                tagPacket.writeVarInt(entry.ids.length) // Number of IDs
                for (const id of entry.ids) {
                    tagPacket.writeVarInt(id)
                }
            }
        }
        tagPacket.send(connection)

        // // Tags
        // const tagPacket = new MCBuffer()

        // // Packet ID: update_tags (configuration)
        // tagPacket.writeVarInt(0x0d)

        // // Prefixed Array of Tagged Registries: we send 1 registry
        // tagPacket.writeVarInt(1)

        // // 1) Registry identifier, e.g. minecraft:timeline
        // tagPacket.writeString('minecraft:timeline')

        // // 2) Prefixed Array of Tags in this registry (we send 1 tag)
        // tagPacket.writeVarInt(1)

        // // 2a) Tag name (identifier), WITHOUT '#' prefix
        // tagPacket.writeString('minecraft:in_overworld')

        // // 2b) Prefixed Array of VarInt entry IDs
        // // Let's say the tag contains a single entry: numeric ID 0
        // tagPacket.writeVarInt(1) // number of entries in tag
        // tagPacket.writeVarInt(0) // entry id 0

        // tagPacket.send(connection)
    },
}
