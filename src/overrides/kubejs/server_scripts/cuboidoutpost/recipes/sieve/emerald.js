// priority: 0

// Tier 3/4: emeralds start with the Diamond Mesh. Rates trimmed.

onEvent('recipes', e => {
  // remove standard drop
  e.remove({id: 'exnihilosequentia:sieve/ens_emerald'})

  // add drops
  e.custom({
    "type": "exnihilosequentia:sieve",
    "rolls": [
      {
        "chance": 0.03,
        "mesh": "diamond"
      },
      {
        "chance": 0.02,
        "mesh": "emerald"
      },
      {
        "chance": 0.02,
        "mesh": "netherite"
      }
    ],
    "input": {
      "item": "minecraft:gravel"
    },
    "result": {
      "item": "minecraft:emerald"
    }
  })

  // add drops
  e.custom({
    "type": "exnihilosequentia:sieve",
    "rolls": [
      {
        "chance": 0.05,
        "mesh": "diamond"
      },
      {
        "chance": 0.03,
        "mesh": "emerald"
      },
      {
        "chance": 0.02,
        "mesh": "netherite"
      }
    ],
    "input": {
      "item": "exnihilosequentia:crushed_granite"
    },
    "result": {
      "item": "minecraft:emerald"
    }
  })
})
