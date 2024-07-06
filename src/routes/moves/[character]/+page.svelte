<script lang="ts">
	import { tooltip } from '@svelte-plugins/tooltips';
	import { debounce } from 'remeda';

	type move = {
		input: string;
		startup: string;
		startupValue: number;
		hitLevel: string;
		damage: number;
		blockFrame: string;
		blockFrameValue: number;
		hitFrame: string;
		hitFrameValue: number;
		chFrame: string;
		chFrameValue: number;
		trades?: boolean;
		balconyBreak?: boolean;
		notes?: string;
		tornado?: boolean;
	};
	// your script goes here
	export let data;

	import { DataHandler, type Field, check } from '@vincjo/datatables';
	import { fade } from 'svelte/transition';

	let { character } = data;

	let filteredMoves: move[] = data.filteredMoves;
	let allMoves: move[] = data.allMoves;
	let traps: move[] = [];
	let hitTraps: move[] = [];
	let blockTraps: move[] = [];
	let extensions: move[] = [];
	let trapsFor: {
		move: move;
		frameType: string;
	};
	let trapMove: move;
	let currentTab: string = 'moves';
	let filter: string = '';
	let trapFilter: string = '';

	const handler = new DataHandler(allMoves);
	const sort = handler.getSort();

	const hitTrapsHandler = new DataHandler(hitTraps);
	const blockTrapsHandler = new DataHandler(blockTraps);
	const hitTrapsSort = hitTrapsHandler.getSort();
	const blockTrapsSort = blockTrapsHandler.getSort();

	const trapsHandler = new DataHandler(traps);
	const trapsSort = trapsHandler.getSort();

	const rows = handler.getRows();
	const trapRows = trapsHandler.getRows();
	const hitTrapsRows = hitTrapsHandler.getRows();
	const blockTrapsRows = blockTrapsHandler.getRows();

	function sortBy(sortField: string) {
		handler.sort(sortField as Field<move>);
	}

	function getMoveTraps(row: move) {
		console.log(row);
		blockTraps = allMoves.filter((move) => {
			return row.startupValue - move.blockFrameValue <= 10 && move.blockFrameValue
		});

		hitTraps = allMoves.filter((move) => {
			return row.startupValue - move.hitFrameValue <= 10 && move.hitFrameValue;
		});

		blockTraps.forEach(blockTrap => {
			blockTrap.trades = row.startupValue - blockTrap.blockFrameValue === 10
		})

		hitTraps.forEach(hitTrap => {
			hitTrap.trades = row.startupValue - hitTrap.blockFrameValue === 10
		})

		blockTrapsHandler.setRows(blockTraps);
		hitTrapsHandler.setRows(hitTraps);
	}

	function getStrings(event: Event) {
		const checkbox = event.target as HTMLInputElement;

		if (!checkbox.checked) {
			handler.setRows(allMoves);
			return;
		}

		const strings = allMoves.filter((move) => {
			const moveSplit = move.input.substring(move.input.indexOf('+') + 1);

			return moveSplit.split(',').length > 1;
		});

		handler.setRows(strings);
	}

	function getTornado(event: Event) {
		const checkbox = event.target as HTMLInputElement;

		if (!checkbox.checked) {
			handler.setRows(allMoves);
			return;
		}

		const tornadoMoves = allMoves.filter((move) => move.tornado);

		handler.setRows(tornadoMoves);
	}

	function clearMoveFilters() {
		filter = '';
		handler.clearFilters();
	}

	function getTraps(frames: number, move: move, frameType: string) {
		traps = filteredMoves.filter((x) => x.startupValue && x.startupValue - frames <= 10 && x.hitLevel !== 't');

		traps.forEach((trap) => {
			trap.startupValue - frames === 10 ? (trap.trades = true) : (trap.trades = false);
		});

		trapsFor = {
			move,
			frameType
		};

		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'smooth'
		});
		trapsHandler.setRows(traps);
	}

	function sortTraps(sortField: string) {
		trapsHandler.sort(sortField as Field<move>);
	}

	function sortHitTraps(sortField: string) {
		hitTrapsHandler.sort(sortField as Field<move>);
	}

	function sortBlockTraps(sortField: string) {
		blockTrapsHandler.sort(sortField as Field<move>);
	}

	function getExtensions(move: move) {
		trapMove = move;

		extensions = allMoves.filter((x) => x.input.startsWith(`${move.input},`));
	}

	const filterDebouncer = debounce(
		() => {
			handler.filter(filter, 'input', check.isLike);
		},
		{
			waitMs: 500
		}
	);

	function filterMoves() {
		filterDebouncer.call();
	}

	function filterTraps() {
		trapsHandler.filter(trapFilter, 'input', check.isLike);
	}
</script>

<div class="container movetable pl-4">
	<h1 class="text-white font-mono">
		{character.charAt(0).toUpperCase() + character.slice(1)} Moves
	</h1>

	<div>
		<div class="flex gap-4 mb-8">
			<button
				class:active={currentTab === 'moves'}
				class="tabs__item"
				on:click={() => (currentTab = 'moves')}
			>
				Moves
			</button>
			{#if traps.length > 0}
				<button
					class:active={currentTab === 'traps'}
					class="tabs__item"
					on:click={() => (currentTab = 'traps')}
				>
					Traps
				</button>
			{/if}
			{#if extensions.length > 0}
				<button
					class:active={currentTab === 'extensions'}
					class="tabs__item"
					on:click={() => (currentTab = 'extensions')}
				>
					Extensions
				</button>
			{/if}
			{#if hitTraps.length > 0}
				<button
					class:active={currentTab === 'hitTraps'}
					class="tabs__item"
					on:click={() => (currentTab = 'hitTraps')}
				>
					Hit Traps
				</button>
			{/if}
			{#if blockTraps.length > 0}
				<button
					class:active={currentTab === 'blockTraps'}
					class="tabs__item"
					on:click={() => (currentTab = 'blockTraps')}
				>
					Block Traps
				</button>
			{/if}
		</div>
	</div>

	<div class="flex gap-4 align-top">
		{#if currentTab === 'moves'}
			<div>
				<div class="move_filters mb-4">
					<label for="strings">Strings</label>
					<input
						type="checkbox"
						name="strings"
						id="strings"
						on:change={(event) => {
							getStrings(event);
						}}
					/>

					<label for="tornado">Tornado Moves</label>
					<input
						type="checkbox"
						name="tornado"
						id="tornado"
						on:change={(event) => {
							getTornado(event);
						}}
					/>
				</div>
				<table class="movetable__table rounded-md">
					<thead>
						<tr>
							<th on:click={() => sortBy('input')}>
								{#if $sort.identifier === 'input'}
									{#if $sort.direction === 'asc'}
										⬆️
									{:else}
										⬇️
									{/if}
								{/if}
								Input
							</th>
							<th on:click={() => sortBy('damage')}>
								{#if $sort.identifier === 'damage'}
									{#if $sort.direction === 'asc'}
										⬆️
									{:else}
										⬇️
									{/if}
								{/if}
								Damage
							</th>
							<th> Hit Level </th>
							<th on:click={() => sortBy('startupValue')}>
								{#if $sort.identifier === 'startupValue'}
									{#if $sort.direction === 'asc'}
										⬆️
									{:else}
										⬇️
									{/if}
								{/if}
								Startup
							</th>
							<th on:click={() => sortBy('blockFrameValue')}>
								{#if $sort.identifier === 'blockFrameValue'}
									{#if $sort.direction === 'asc'}
										⬆️
									{:else}
										⬇️
									{/if}
								{/if}
								Block
							</th>
							<th on:click={() => sortBy('hitFrameValue')}>
								{#if $sort.identifier === 'hitFrameValue'}
									{#if $sort.direction === 'asc'}
										⬆️
									{:else}
										⬇️
									{/if}
								{/if}
								Hit
							</th>
							<th on:click={() => sortBy('chFrameValue')}>
								{#if $sort.identifier === 'chFrameValue'}
									{#if $sort.direction === 'asc'}
										⬆️
									{:else}
										⬇️
									{/if}
								{/if}
								CH</th
							>
							<th on:click={() => sortBy('balconyBreak')}> Balcony Break </th>
						</tr>
						<tr>
							<th>
								<input
									type="text"
									class="text-black p-1"
									bind:value={filter}
									on:input={() => filterMoves()}
								/>
							</th>
							<th></th>
							<th></th>
							<th></th>
							<th></th>
							<th></th>
							<th></th>
							<th></th>
						</tr>
					</thead>
					<tbody class="movetable__table-body">
						{#each $rows as row}
							<tr class="even:bg-lilac-800 odd:bg-lilac-900" use:tooltip={{ content: row.notes }}>
								<td>{row.input}</td>
								<td>
									{#if row.damage}
										{row.damage}
									{/if}
								</td>
								<td>
									{row.hitLevel}
								</td>
								<td on:click={() => getMoveTraps(row)}>
									{row.startup}
								</td>
								<td on:click={() => getTraps(row.blockFrameValue, row, 'block')}>
									{#if row.blockFrame !== null}
										{row.blockFrame}
									{/if}
								</td>
								<td on:click={() => getTraps(row.hitFrameValue, row, 'hit')}>
									{#if row.hitFrame !== null}
										{row.hitFrame}
									{/if}
								</td>
								<td>
									{#if row.chFrame !== null}
										{row.chFrame}
									{/if}
								</td>
								<td>
									{#if row.balconyBreak}
										✅
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		{#if traps.length > 0 && currentTab === 'traps'}
			<div class="trapsContainer">
				<h2>Potentials traps for {trapsFor.move.input} on {trapsFor.frameType}</h2>
				<input
					class="text-black mb-4 mt-4 text-lg pl-2"
					bind:value={trapFilter}
					on:input={() => filterTraps()}
					type="text"
				/>
				<table class="mt-2">
					<thead>
						<tr>
							<th on:click={() => sortTraps('input')}>
								{#if $trapsSort.identifier === 'input'}
									{#if $trapsSort.direction === 'asc'}
										⬆️
									{:else}
										⬇️
									{/if}
								{/if}
								Input
							</th>
							<th>
								Hit Level
							</th>
							<th on:click={() => sortTraps('damage')}>
								{#if $trapsSort.identifier === 'damage'}
									{#if $trapsSort.direction === 'asc'}
										⬆️
									{:else}
										⬇️
									{/if}
								{/if}
								Damage
							</th>
							<th>Startup</th>
							<th on:click={() => sortTraps('blockFrameValue')}>
								{#if $trapsSort.identifier === 'blockFrameValue'}
									{#if $trapsSort.direction === 'asc'}
										⬆️
									{:else}
										⬇️
									{/if}
								{/if}
								Block
							</th>
							<th on:click={() => sortTraps('hitFrameValue')}>
								{#if $trapsSort.identifier === 'hitFrameValue'}
									{#if $trapsSort.direction === 'asc'}
										⬆️
									{:else}
										⬇️
									{/if}
								{/if}
								Hit
							</th>
							<th on:click={() => sortTraps('chFrameValue')}>
								{#if $trapsSort.identifier === 'chFrameValue'}
									{#if $trapsSort.direction === 'asc'}
										⬆️
									{:else}
										⬇️
									{/if}
								{/if}
								CH
							</th>
							<th on:click={() => sortTraps('trades')}>Trades</th>
							<th on:click={() => sortTraps('balconyBreak')}> Balcony Break </th>
						</tr>
					</thead>
					<tbody>
						{#each $trapRows as row}
							<tr class="even:bg-lilac-800 odd:bg-lilac-900" on:click={() => getExtensions(row)}>
								<td>{row.input}</td>
								<td>{row.hitLevel}</td>
								<td>{row.damage}</td>
								<td>{row.startup}</td>
								<td>{row.blockFrame}</td>
								<td>{row.hitFrame}</td>
								<td>{row.chFrame}</td>
								<td>
									{#if row.trades}
										✅
									{/if}
								</td>
								<td>
									{#if row.balconyBreak}
										✅
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		{#if extensions.length > 0 && trapMove && currentTab === 'extensions'}
			<div>
				Extension for {trapMove.input}

				<table class="mt-2">
					<thead>
						<tr>
							<th>Input</th>
							<th>Block</th>
							<th>Hit</th>
							<th>CH</th>
						</tr>
					</thead>
					<tbody>
						<tr class="bg-lilac-900">
							<td>{trapMove.input}</td>
							<td>{trapMove.blockFrame}</td>
							<td>{trapMove.hitFrame}</td>
							<td>{trapMove.chFrame}</td>
						</tr>
						{#each extensions as extension}
							<tr class="even:bg-lilac-800 odd:bg-lilac-900">
								<td>{extension.input}</td>
								<td>{extension.blockFrame}</td>
								<td>{extension.hitFrame}</td>
								<td>{extension.chFrame}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		{#if hitTraps.length > 0 && currentTab === 'hitTraps'}
			<div>
				<table class="mt-2">
					<thead>
						<tr>
							<th>Input</th>
							<th on:click={() => hitTrapsHandler.sort('startupValue')}>
								{#if $hitTrapsSort.identifier === 'startupValue'}
									{#if $hitTrapsSort.direction === 'asc'}
										⬆️
									{:else}
										⬇️
									{/if}
								{/if}
								Startup
							</th>
							<th on:click={() => sortHitTraps('blockFrameValue')}>
								{#if $hitTrapsSort.identifier === 'blockFrameValue'}
									{#if $hitTrapsSort.direction === 'asc'}
										⬆️
									{:else}
										⬇️
									{/if}
								{/if}
								Block
							</th>
							<th on:click={() => sortHitTraps('hitFrameValue')}>
								{#if $hitTrapsSort.identifier === 'hitFrameValue'}
									{#if $hitTrapsSort.direction === 'asc'}
										⬆️
									{:else}
										⬇️
									{/if}
								{/if}
								Hit
							</th>
							<th on:click={() => sortHitTraps('chFrameValue')}>
								{#if $hitTrapsSort.identifier === 'chFrameValue'}
									{#if $hitTrapsSort.direction === 'asc'}
										⬆️
									{:else}
										⬇️
									{/if}
								{/if}
								CH
							</th>
							<th>Trades</th>
						</tr>
						<tr>
							<th>
								<input
									on:input={(event) =>
										hitTrapsHandler.filter(event.target?.value, 'input', check.isLike)}
									type="text"
									class="text-black p-1"
								/>
							</th>
							<th></th>
							<th></th>
							<th></th>
							<th></th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{#each $hitTrapsRows as move}
							<tr class="even:bg-lilac-800 odd:bg-lilac-900">
								<td>{move.input}</td>
								<td>{move.startup}</td>
								<td>{move.blockFrame}</td>
								<td>{move.hitFrame}</td>
								<td>{move.chFrame}</td>
								<td>
									{#if move.trades}
										✅
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		{#if blockTraps.length > 0 && currentTab === 'blockTraps'}
			<div>
				<table class="mt-2">
					<thead>
						<tr>
							<th>Input</th>
							<th on:click={() => blockTrapsHandler.sort('startupValue')}>
								{#if $blockTrapsSort.identifier === 'startupValue'}
									{#if $blockTrapsSort.direction === 'asc'}
										⬆️
									{:else}
										⬇️
									{/if}
								{/if}
								Startup
							</th>
							<th
								on:click={() => blockTrapsHandler.sort('blockFrameValue')}
							>
								{#if $blockTrapsSort.identifier === 'blockFrameValue'}
									{#if $blockTrapsSort.direction === 'asc'}
										⬆️
									{:else}
										⬇️
									{/if}
								{/if}
								Block
							</th>
							<th
								on:click={() => blockTrapsHandler.sort('hitFrameValue')}
							>
								{#if $blockTrapsSort.identifier === 'hitFrameValue'}
									{#if $blockTrapsSort.direction === 'asc'}
										⬆️
									{:else}
										⬇️
									{/if}
								{/if}
								Hit
							</th>
							<th
								on:click={() => blockTrapsHandler.sort('chFrameValue')}
							>
								{#if $blockTrapsSort.identifier === 'chFrameValue'}
									{#if $blockTrapsSort.direction === 'asc'}
										⬆️
									{:else}
										⬇️
									{/if}
								{/if}
								CH
							</th>
							<th>
								Trades
							</th>
						</tr>
						<tr>
							<th>
								<input
									type="text"
									class="text-black p-1"
									on:input={(event) =>
										blockTrapsHandler.filter(event.target?.value, 'input', check.isLike)}
								/>
							</th>
							<th></th>
							<th></th>
							<th></th>
							<th></th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{#each $blockTrapsRows as move}
							<tr class="even:bg-lilac-800 odd:bg-lilac-900">
								<td>{move.input}</td>
								<td>{move.startup}</td>
								<td>{move.blockFrame}</td>
								<td>{move.hitFrame}</td>
								<td>{move.chFrame}</td>
								<td>
									{#if move.trades}
										✅
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		{#if extensions.length === 0 && trapMove}
			<h2>No extensions found for {trapMove.input}</h2>
		{/if}
	</div>
</div>

<style lang="postcss">
	table {
		@apply text-white rounded-md border-white border-separate border 
			border-spacing-0;
	}

	tr {
		&:last-child {
			& > td:first-child {
				@apply rounded-bl-md;
			}

			& > td:last-child {
				@apply rounded-br-md;
			}
		}
	}

	td {
		@apply px-4 py-3;
	}

	th {
		@apply border-b px-4 py-3;

		&:not(:last-child) {
			@apply border-r;
		}
	}

	thead {
		@apply bg-black;
		position: sticky;
		inset-block-start: 0;

		tr:first-child {
			th:first-child {
				@apply rounded-tl-md;
			}

			th:last-child {
				@apply rounded-tr-md;
			}
		}
	}

	.tabs__item {
		@apply py-4 px-2;
		&.active {
			@apply bg-lilac-700;
		}
	}

	.movetable {
		&__table {
			@apply m-auto;
		}
	}
</style>
