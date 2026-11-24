// priority: 0

// Powah reactor fuel (All Powah-ful appendix): Netherite Mesh only.

onEvent('recipes', e => {

  // add drops
  e.custom({
    "type": "exnihilosequentia:sieve",
    "rolls": [
      {
        "chance": 0.03,
        "mesh": "netherite"
      }
    ],
    "input": {
      "item": "minecraft:gravel"
    },
    "result": {
      "item": "powah:uraninite_raw_dense"
    }
  })
})
