export function deg2rad(d:number): number {
    return (Math.PI / 180.0) * d;
}

export function equalish(a:number, b:number): boolean {
    return Math.abs(a - b) < 10;
}

