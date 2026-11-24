// priority: 0

// Tier 3 (Getting Tinks Done, "Gold! (Gold)"): gold from crushed netherrack with an Iron Mesh or higher.

onEvent('recipes', e => {
  // remove standard drop
  e.remove({id: 'exnihilosequentia:sieve/ens_piece_gold_crushed_netherrack'})

  // add drops
  e.custom({
    "type": "exnihilosequentia:sieve",
    "rolls": [
      {
        "chance": 0.2,
        "mesh": "iron"
      },
      {
        "chance": 0.1,
        "mesh": "diamond"
      },
      {
        "chance": 0.05,
        "mesh": "emerald"
      }
    ],
    "input": {
      "item": "exnihilosequentia:crushed_netherrack"
    },
    "result": {
      "item": "exnihilosequentia:piece_gold"
    }
  })
})
