import { json } from '@sveltejs/kit';
import * as cheerio from 'cheerio';

export async function GET({ params }) {
	const wavuUrl = `https://wavu.wiki/w/index.php?title=Special:CargoQuery&limit=500&offset=0&tables=Move&fields=CONCAT%28id%2C%27%27%29%3DMove%2Cstartup%3DStartup%2Ctarget%3DHit+Level%2Cdamage%3DDamage%2Cblock%3DOn+Block%2CCONCAT%28hit%2C%27%27%29%3DOn+Hit%2CCONCAT%28ch%2C%27%27%29%3DOn+CH%2Ccrush%3DStates%2Cnotes%3DNotes&where=Move._pageName%3D%27${params.character.charAt(0).toUpperCase() + params.character.slice(1)}+movelist%27+AND+parent+IS+NULL&format=table`;
	const allMovesUrl = `https://wavu.wiki/w/index.php?title=Special:CargoQuery&limit=500&offset=0&tables=Move&fields=CONCAT%28id%2C%27%27%29%3DMove%2Cstartup%3DStartup%2Ctarget%3DHit+Level%2Cdamage%3DDamage%2Cblock%3DOn+Block%2CCONCAT%28hit%2C%27%27%29%3DOn+Hit%2CCONCAT%28ch%2C%27%27%29%3DOn+CH%2Ccrush%3DStates%2Cnotes%3DNotes&where=Move._pageName%3D%27${params.character.charAt(0).toUpperCase() + params.character.slice(1)}+movelist%27&format=table`;

	const res = await fetch(wavuUrl);
	const body = await res.text();

	const $ = cheerio.load(body);

	const filteredTable = $('.cargoTable')
	const filteredTableBody = filteredTable.find('tbody');
	const filteredTableRows = filteredTableBody.children('tr');
	const filteredMoves: move[] = [];

	filteredTableRows.each((index, row) => {
		const cells = $(row).children();

		const move: move = {
			input: $(cells[0]).text().split(`-`)[1].replaceAll('\n', ''),
			startup: $(cells[1]).text(),
			startupValue: parseInt($(cells[1]).text().replaceAll('i', '')),
			hitLevel: $(cells[2]).text(),
			damage: parseInt($(cells[3]).text()),
			blockFrame: $(cells[4]).text(),
			blockFrameValue: parseInt($(cells[4]).text()),
			hitFrame: $(cells[5]).text(),
			hitFrameValue: parseInt($(cells[5]).text()),
			chFrame: $(cells[6]).text(),
			chFrameValue: parseInt($(cells[6]).text()),
			balconyBreak: $(cells[8]).text().toLowerCase().includes('balcony break'),
			tornado: $(cells[8]).text().toLowerCase().includes('tornado'),
			notes: $(cells[8]).text(),
		};

		filteredMoves.push(move);
	});

  const allMovesRes = await fetch(allMovesUrl);
  const allMovesData = await allMovesRes.text()

  const allMovesCheerio = cheerio.load(allMovesData)
  const allMovesTable = allMovesCheerio('.cargoTable');

  const allMovesTableBody = allMovesTable.find('tbody');
	const allMovesTableRows = allMovesTableBody.children('tr');

	const allMoves: move[] = [];

	allMovesTableRows.each((index, row) => {
		const cells = $(row).children();

		console.log(allMovesCheerio(cells[0]).text())

		const move: move = {
			input: allMovesCheerio(cells[0]).text().replace('Jack-8', '').split('-')[1].replaceAll('\n', ''),
			startup: $(cells[1]).text(),
			startupValue: parseInt($(cells[1]).text().replaceAll('i', '')),
			hitLevel: $(cells[2]).text(),
			damage: parseInt($(cells[3]).text()),
			blockFrame: $(cells[4]).text(),
			blockFrameValue: parseInt($(cells[4]).text()),
			hitFrame: $(cells[5]).text(),
			hitFrameValue: parseInt($(cells[5]).text()),
			chFrame: $(cells[6]).text(),
			chFrameValue: parseInt($(cells[6]).text()),
			balconyBreak: $(cells[8]).text().toLowerCase().includes('balcony break'),
			tornado: $(cells[8]).text().toLowerCase().includes('tornado'),
			notes: $(cells[8]).text(),
		};

		allMoves.push(move);
	});

	return json({
		filteredMoves,
		allMoves
	});
}
