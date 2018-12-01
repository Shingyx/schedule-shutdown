import { parseDurationPatternSeconds } from '../../lib/utilities';

describe('parseDurationPatternSeconds', () => {
    test('0s returns 0', () => {
        expect(parseDurationPatternSeconds('0s')).toBe(0);
    });

    test('5s returns 5', () => {
        expect(parseDurationPatternSeconds('5s')).toBe(5);
    });

    test('12s returns 12', () => {
        expect(parseDurationPatternSeconds('12s')).toBe(12);
    });

    test('321s returns 321', () => {
        expect(parseDurationPatternSeconds('321s')).toBe(321);
    });

    test('5m returns 300', () => {
        expect(parseDurationPatternSeconds('5m')).toBe(300);
    });

    test('5m10s returns 310', () => {
        expect(parseDurationPatternSeconds('5m10s')).toBe(310);
    });

    test('1h returns 3600', () => {
        expect(parseDurationPatternSeconds('1h')).toBe(3600);
    });

    test('1h30m returns 5400', () => {
        expect(parseDurationPatternSeconds('1h30m')).toBe(5400);
    });

    test('1h2m3s returns 3723', () => {
        expect(parseDurationPatternSeconds('1h2m3s')).toBe(3723);
    });

    test('1h30s returns 3630', () => {
        expect(parseDurationPatternSeconds('1h30s')).toBe(3630);
    });

    test('11h30s returns 39630', () => {
        expect(parseDurationPatternSeconds('11h30s')).toBe(39630);
    });

    test('0m returns 0', () => {
        expect(parseDurationPatternSeconds('0m')).toBe(0);
    });

    test('0h returns 0', () => {
        expect(parseDurationPatternSeconds('0h')).toBe(0);
    });

    test('0h0m0s returns 0', () => {
        expect(parseDurationPatternSeconds('0h')).toBe(0);
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
                expect(parseDurationPatternSeconds(value)).toBe(-1);
            });
        }
    });
});
