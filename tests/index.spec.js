import convertDefault, { convert, paginate } from '../index.js';

describe('Test index exports', () => {
	it('should export convert as default', () => {
		expect(typeof convertDefault).toBe('function');
	});

	it('should export convert as named export', () => {
		expect(typeof convert).toBe('function');
		expect(convert).toBe(convertDefault);
	});

	it('should export paginate as named export', () => {
		expect(typeof paginate).toBe('function');
	});
});
