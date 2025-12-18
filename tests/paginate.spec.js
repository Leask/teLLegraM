import { paginate } from '../index.js';

describe('Test paginate method', () => {
	it('should return original text', () => {
		const text = 'Hello world!';
		expect(paginate(text)).toBe(text);
	});
});
