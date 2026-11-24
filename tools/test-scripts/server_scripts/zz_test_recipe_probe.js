// priority: -100
// Test-server only (copied in by tools/test-server.mjs, never shipped).
// After the server has fully loaded, list live recipes whose id or output item
// matches the probe pattern. This sees the final recipe manager, including
// recipes mods add outside the KubeJS event and the effect of KubeJS removals.
onEvent('server.load', event => {
  const pattern = /singularity|_qs$|mesh_emerald|piece_osmium/
  const manager = event.server.minecraftServer.func_199529_aN() // getRecipeManager
  let n = 0
  manager.func_199510_b().forEach(r => { // getRecipes
    const id = String(r.func_199560_c()) // getId
    let out = ''
    try { out = String(r.func_77571_b()) } catch (e) { out = '?' } // getRecipeOutput() -> "<count> <item>" (avoid reflecting Item: client-only classes)
    if (!pattern.test(id) && !pattern.test(out)) return
    n++
    let ings = []
    try {
      r.func_192400_c().forEach(ing => { // getIngredients
        const stacks = ing.func_193365_a() // getMatchingStacks
        ings.push(stacks.length ? String(stacks[0]) + (stacks.length > 1 ? '+' + (stacks.length - 1) : '') : '-')
      })
    } catch (e) { ings = ['?'] }
    console.info('[probe] ' + id + ' -> ' + out + ' :: ' + r.getClass().getSimpleName() + ' :: ' + ings.join(','))
  })
  console.info('[probe] total matching recipes: ' + n)
})
