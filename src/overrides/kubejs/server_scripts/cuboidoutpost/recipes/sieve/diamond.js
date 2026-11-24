// priority: 0

// Tier 3: diamonds start with the Iron Mesh (quest "Olde Fungus" says so). Rates trimmed, and the
// per-tier bonuses are small because rolls are flattened (a mesh rolls all lower-tier entries too).

onEvent('recipes', e => {
  // remove standard drop
  e.remove({id: 'exnihilosequentia:sieve/ens_diamond'})

  // add drops
  e.custom({
    "type": "exnihilosequentia:sieve",
    "rolls": [
      {
        "chance": 0.02,
        "mesh": "iron"
      },
      {
        "chance": 0.015,
        "mesh": "diamond"
      },
      {
        "chance": 0.015,
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
      "item": "minecraft:diamond"
    }
  })

  // add drops
  e.custom({
    "type": "exnihilosequentia:sieve",
    "rolls": [
      {
        "chance": 0.06,
        "mesh": "iron"
      },
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
      "item": "exnihilosequentia:crushed_diorite"
    },
    "result": {
      "item": "minecraft:diamond"
    }
  })
})
