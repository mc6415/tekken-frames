import { json } from '@sveltejs/kit'
import * as cheerio from 'cheerio'

export async function GET({ params }) {
  const wavuUrl = `https://wavu.wiki/t/${params.character}_combos`

  const rest = await fetch(wavuUrl)
  const body = await rest.text()

  const $ = cheerio.load(body);

  const bnbComboSection = $('[id="Bread_n\'_butter"]').parent().nextAll('.combolist')
  const bnbCombos = bnbComboSection.find('dl')
  // const bnbComboList = bnbTitle.next('.comboList')


  return json({
    source: bnbComboSection.prop('tagName'),
    children: bnbComboSection.children().length,
    combos: bnbCombos.length
    // comboList: bnbComboList.text()
  })
}