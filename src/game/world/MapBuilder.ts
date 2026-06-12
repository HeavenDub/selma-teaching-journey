/**
 * Tiny imperative canvas for authoring tile grids in code. Guarantees every
 * row has the same width and every write stays in bounds, so maps can't ship
 * malformed — the world integrity test then verifies walkability on top.
 */
export class MapBuilder {
  private cells: string[][];

  constructor(
    public readonly width: number,
    public readonly height: number,
    fillChar = ".",
  ) {
    this.cells = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => fillChar),
    );
  }

  set(x: number, y: number, ch: string): this {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      throw new Error(`MapBuilder.set out of bounds: ${x},${y}`);
    }
    this.cells[y]![x] = ch;
    return this;
  }

  rect(x: number, y: number, w: number, h: number, ch: string): this {
    for (let j = y; j < y + h; j++) {
      for (let i = x; i < x + w; i++) this.set(i, j, ch);
    }
    return this;
  }

  hline(x: number, y: number, length: number, ch: string): this {
    return this.rect(x, y, length, 1, ch);
  }

  vline(x: number, y: number, length: number, ch: string): this {
    return this.rect(x, y, 1, length, ch);
  }

  border(ch: string): this {
    this.hline(0, 0, this.width, ch);
    this.hline(0, this.height - 1, this.width, ch);
    this.vline(0, 0, this.height, ch);
    this.vline(this.width - 1, 0, this.height, ch);
    return this;
  }

  /** Scatter a char at fixed positions (kept explicit for determinism). */
  scatter(points: [number, number][], ch: string): this {
    for (const [x, y] of points) this.set(x, y, ch);
    return this;
  }

  /**
   * A standard building: two roof rows, two wall rows with arched windows on
   * the upper row, and a door punched into the lower wall row at doorX.
   */
  building(x: number, y: number, w: number, doorX: number): this {
    this.rect(x, y, w, 2, "R");
    this.rect(x, y + 2, w, 2, "W");
    for (let i = x + 1; i < x + w - 1; i += 2) {
      this.set(i, y + 2, "w");
    }
    this.set(doorX, y + 3, "D");
    return this;
  }

  rows(): string[] {
    return this.cells.map((row) => row.join(""));
  }

  charAt(x: number, y: number): string {
    return this.cells[y]![x]!;
  }
}
