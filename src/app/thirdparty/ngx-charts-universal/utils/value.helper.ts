export function formatValue(value: any, formatter): string {
	if (formatter) {
		return formatter(value);
	}
	if (value instanceof Date) {
		return value.toLocaleDateString();
	}
	return value.toLocaleString();
}
