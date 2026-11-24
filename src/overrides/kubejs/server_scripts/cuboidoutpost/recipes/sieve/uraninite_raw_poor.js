// priority: 0

// Powah reactor fuel (All Powah-ful appendix): Emerald Mesh and up.

onEvent('recipes', e => {

  // add drops
  e.custom({
    "type": "exnihilosequentia:sieve",
    "rolls": [
      {
        "chance": 0.04,
        "mesh": "emerald"
      },
      {
        "chance": 0.06,
        "mesh": "netherite"
      }
    ],
    "input": {
      "item": "minecraft:gravel"
    },
    "result": {
      "item": "powah:uraninite_raw_poor"
    }
  })
})
