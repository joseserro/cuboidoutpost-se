// priority: 0

// Tier 3: quartz from soul sand with an Iron Mesh. Upper-tier bonuses trimmed (was up to ~2.9 per block).

onEvent('recipes', e => {
  // remove standard drop
  e.remove({id: 'exnihilosequentia:sieve/ens_quartz'})

  // add drops
  e.custom({
    "type": "exnihilosequentia:sieve",
    "rolls": [
      {
        "chance": 0.33,
        "mesh": "iron"
      },
      {
        "chance": 0.33,
        "mesh": "iron"
      },
      {
        "chance": 0.25,
        "mesh": "diamond"
      },
      {
        "chance": 0.25,
        "mesh": "emerald"
      },
      {
        "chance": 0.35,
        "mesh": "netherite"
      }
    ],
    "input": {
      "item": "minecraft:soul_sand"
    },
    "result": {
      "item": "minecraft:quartz"
    }
  })
})
