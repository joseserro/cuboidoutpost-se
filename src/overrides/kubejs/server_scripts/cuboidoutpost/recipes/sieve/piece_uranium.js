// priority: 0

// Uranium is only used by late Mekanism (fission, waste) and IE uranium blocks; moved from the
// Iron/Diamond Mesh to the Emerald/Netherite Mesh (Emerald Mesh is gated behind Osmium).

onEvent('recipes', e => {
  // remove standard drop
  e.remove({id: 'exnihilosequentia:sieve/ens_piece_uranium_gravel'})

  // add drops for gravel
  e.custom({
    "type": "exnihilosequentia:sieve",
    "rolls": [
      {
        "chance": 0.06,
        "mesh": "emerald"
      },
      {
        "chance": 0.06,
        "mesh": "netherite"
      }
    ],
    "input": {
      "item": "minecraft:gravel"
    },
    "result": {
      "item": "exnihilosequentia:piece_uranium"
    }
  })
})
