// priority: 0

// Tier 1 (Getting Going): tin pieces come from the Flint Mesh on crushed andesite.
// Higher meshes only add a small bonus (rolls are flattened, so a mesh also rolls every lower-tier entry).

onEvent('recipes', e => {
  // remove standard drop
  e.remove({id: 'exnihilosequentia:sieve/ens_piece_tin_gravel'})

  // add drops for crushed andesite
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
      "item": "exnihilosequentia:crushed_andesite"
    },
    "result": {
      "item": "exnihilosequentia:piece_tin"
    }
  })
})
