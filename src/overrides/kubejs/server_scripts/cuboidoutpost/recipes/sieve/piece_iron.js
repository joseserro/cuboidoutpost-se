// priority: 0

// Iron is meant to come from Create washing + the QTC (Getting Creative). The Diamond Mesh
// (which itself needs iron) only gives a modest top-up, so sieving does not replace that route.

onEvent('recipes', e => {
  // remove standard drop
  e.remove({id: 'exnihilosequentia:sieve/ens_piece_iron_gravel'})
  e.remove({id: 'exnihilosequentia:sieve/ens_piece_iron_sand'})

  // add drops for gravel
  e.custom({
    "type": "exnihilosequentia:sieve",
    "rolls": [
      {
        "chance": 0.12,
        "mesh": "diamond"
      },
      {
        "chance": 0.04,
        "mesh": "emerald"
      },
      {
        "chance": 0.04,
        "mesh": "netherite"
      }
    ],
    "input": {
      "item": "minecraft:gravel"
    },
    "result": {
      "item": "exnihilosequentia:piece_iron"
    }
  })
})
