// priority: 0

onEvent('recipes', e => {

  // get rid of silkworm 10% chance drop from crooks on leaves
  e.remove({id: 'exnihilosequentia:crook/ens_leaves'})

  e.shaped('exnihilosequentia:hammer_stone', [
    ' S ',
    ' RS',
    'R  '
  ], {
    S: '#forge:stone',
    R: '#forge:rods'
  })

  e.shaped('4x cuboidmod:aggregate', [
    'CR',
    'RC',
  ], {
    C: 'minecraft:clay',
    R: 'exnihilosequentia:crushed_andesite'
  })

  e.shaped('4x cuboidmod:aggregate', [
    'CR',
    'RC',
  ], {
    C: 'minecraft:clay',
    R: 'exnihilosequentia:crushed_diorite'
  })

  e.shaped('4x cuboidmod:aggregate', [
    'CR',
    'RC',
  ], {
    C: 'minecraft:clay',
    R: 'exnihilosequentia:crushed_granite'
  })

  // -- mesh progression --
  // The Emerald Mesh used to be 6 emeralds around a Diamond Mesh, i.e. reachable straight after
  // the first iron (Getting Creative) via Iron Mesh -> diamonds -> Diamond Mesh -> emeralds.
  // Its drops (osmium, uranium, uraninite) let players skip the Smeltery osmium alloy
  // ("Osmium Osmosis") and jump into Mekanism. It now also needs 2 Osmium Ingots, so it can
  // only be made once osmium has been unlocked the intended way. The Netherite Mesh is
  // smithed from the Emerald Mesh, so it inherits this gate.
  e.remove({id: 'exnihilosequentia:ens_mesh_emerald'})

  e.custom({
    "type": "minecraft:crafting_shaped",
    "pattern": [
      "EOE",
      "EME",
      "EOE"
    ],
    "key": {
      "E": {
        "tag": "forge:gems/emerald"
      },
      "O": {
        "tag": "forge:ingots/osmium"
      },
      "M": {
        "item": "exnihilosequentia:mesh_diamond"
      }
    },
    "result": {
      "item": "exnihilosequentia:mesh_emerald"
    }
  })

})