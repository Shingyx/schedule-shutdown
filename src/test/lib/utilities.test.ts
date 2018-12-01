import { parseDurationPatternMinutes } from '../../lib/utilities';

describe('parseDurationPatternMinutes', () => {
    test('0m returns 0', () => {
        expect(parseDurationPatternMinutes('0m')).toBe(0);
    });

    test('0h returns 0', () => {
        expect(parseDurationPatternMinutes('0h')).toBe(0);
    });

    test('0h0m returns 0', () => {
        expect(parseDurationPatternMinutes('0h0m')).toBe(0);
    });

    test('5m returns 5', () => {
        expect(parseDurationPatternMinutes('5m')).toBe(5);
    });

    test('12m returns 12', () => {
        expect(parseDurationPatternMinutes('12m')).toBe(12);
    });

    test('321m returns 321', () => {
        expect(parseDurationPatternMinutes('321m')).toBe(321);
    });

    test('5h returns 300', () => {
        expect(parseDurationPatternMinutes('5h')).toBe(300);
    });

    test('5h10m returns 310', () => {
        expect(parseDurationPatternMinutes('5h10m')).toBe(310);
    });

    test('1h60m returns 120', () => {
        expect(parseDurationPatternMinutes('1h60m')).toBe(120);
    });

    describe('invalid values', () => {
        const invalidValues: any[] = [
            '',
            'hello world',
            '1s2s',
            '2m3m3s',
            '3s2m1h',
            [],
            [8],
            {},
            { a: 'b' },
            0,
            6,
            -1,
        ];

        for (const value of invalidValues) {
            test(`${JSON.stringify(value)} returns -1`, () => {
                expect(parseDurationPatternMinutes(value)).toBe(-1);
            });
        }
    });
});
