// priority: 0

// Tier 3 (Iron Mesh): lead is first needed for IE capacitors / Thermal augments / Enderium.

onEvent('recipes', e => {
  // remove standard drop
  e.remove({id: 'exnihilosequentia:sieve/ens_piece_lead_gravel'})

  // add drops for gravel
  e.custom({
    "type": "exnihilosequentia:sieve",
    "rolls": [
      {
        "chance": 0.1,
        "mesh": "iron"
      },
      {
        "chance": 0.05,
        "mesh": "diamond"
      },
      {
        "chance": 0.05,
        "mesh": "emerald"
      }
    ],
    "input": {
      "item": "minecraft:gravel"
    },
    "result": {
      "item": "exnihilosequentia:piece_lead"
    }
  })
})
