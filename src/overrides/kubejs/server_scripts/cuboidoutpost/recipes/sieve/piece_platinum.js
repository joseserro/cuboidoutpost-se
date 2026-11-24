// priority: 0

// Platinum is a completionist resource (quantum singularity); Netherite Mesh only.

onEvent('recipes', e => {
  // remove standard drop
  e.remove({id: 'exnihilosequentia:sieve/ens_piece_platinum_gravel'})

  // add drops for gravel
  e.custom({
    "type": "exnihilosequentia:sieve",
    "rolls": [
      {
        "chance": 0.1,
        "mesh": "netherite"
      }
    ],
    "input": {
      "item": "minecraft:gravel"
    },
    "result": {
      "item": "exnihilosequentia:piece_platinum"
    }
  })
})
