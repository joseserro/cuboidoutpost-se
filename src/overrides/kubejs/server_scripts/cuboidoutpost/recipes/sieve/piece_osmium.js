// priority: 0

// Osmium is meant to be unlocked by alloying Iron + Thatldu + Fullerene in the Smeltery
// ("Osmium Osmosis", end of Getting Tinks Done), which in turn unlocks Getting Mekanised.
// The Emerald Mesh now needs Osmium Ingots to craft (see exnihilo.js), so sieved osmium is a
// supplement after that point, never a way around it. Rates were 0.1 / 0.2.

onEvent('recipes', e => {
  // remove standard drop
  e.remove({id: 'exnihilomekanism:sieve/ens_piece_osmium_1'})

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
      "item": "exnihilosequentia:piece_osmium"
    }
  })
})
