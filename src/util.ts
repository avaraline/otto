export const deg2rad = (d:number): number =>
{ return (Math.PI / 180.0) * d; }

export const equalish = (a:number, b:number): boolean =>
{ return Math.abs(a - b) < 10; }

export const radians = (deg:number): number => deg * (Math.PI / 180)