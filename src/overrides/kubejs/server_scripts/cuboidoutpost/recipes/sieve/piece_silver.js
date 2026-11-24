// priority: 0

// Tier 1 (Getting Going): silver pieces come from the Flint Mesh on crushed diorite.
// Higher meshes only add a small bonus (rolls are flattened, so a mesh also rolls every lower-tier entry).

onEvent('recipes', e => {
  // remove standard drop
  e.remove({id: 'exnihilosequentia:sieve/ens_piece_silver_gravel'})

  // add drops for crushed diorite
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
      "item": "exnihilosequentia:crushed_diorite"
    },
    "result": {
      "item": "exnihilosequentia:piece_silver"
    }
  })
})
