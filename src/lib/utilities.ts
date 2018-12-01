export function parseDurationPatternMinutes(pattern: string): number {
    const durationMatch = /^(\d+h)?(\d+m)?$/.exec(pattern);
    if (!durationMatch || !durationMatch.input) {
        return -1;
    }
    let minutes = 0;
    for (let i = 1; i < durationMatch.length; i++) {
        const match = durationMatch[i];
        if (!match) {
            continue;
        }
        let value = Number(match.slice(0, -1));
        const unit = match.slice(-1);
        if (unit !== 'm') {
            value *= 60;
        }
        minutes += value;
    }
    return minutes;
}
