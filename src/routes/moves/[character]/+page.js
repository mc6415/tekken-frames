export async function load({ fetch, params }) {
  let res = await fetch(`/api/moves/${params.character}`)
  let data = await res.json()


  return {
    character: params.character,
    filteredMoves: data.filteredMoves,
    allMoves: data.allMoves,
  }
}