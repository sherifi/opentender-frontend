export function bestFilterColCount(index: number, nrOfFilter: number): number {
	let col = 4;
	if (nrOfFilter < 3) {
		col = 2;
	} else if (nrOfFilter < 4) {
		col = 3;
	}
	let rows = Math.floor(nrOfFilter / col) + 1;
	let currentrow = Math.floor(index / col);
	if (currentrow == rows - 1) {
		let itemsleft = col - (rows * col - nrOfFilter);
		col = Math.max(itemsleft, 2);
	}
	return col;
}
