// priority: 0

// Tier 1 (Getting Going): nickel pieces come from the Flint Mesh on crushed granite.
// Higher meshes only add a small bonus (rolls are flattened, so a mesh also rolls every lower-tier entry).

onEvent('recipes', e => {
  // remove standard drop
  e.remove({id: 'exnihilosequentia:sieve/ens_piece_nickel_gravel'})

  // add drops for crushed granite
  e.custom({
    "type": "exnihilosequentia:sieve",
    "rolls": [
      {
        "chance": 0.25,
        "mesh": "flint"
      },
      {
        "chance": 0.1,
        "mesh": "iron"
      },
      {
        "chance": 0.05,
        "mesh": "diamond"
      }
    ],
    "input": {
      "item": "exnihilosequentia:crushed_granite"
    },
    "result": {
      "item": "exnihilosequentia:piece_nickel"
    }
  })
})
