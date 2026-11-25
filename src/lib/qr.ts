// Deterministic ISO/IEC 18004 QR Code (Byte mode, Error Correction Level L, Versions 1-6)
// Pure TypeScript with zero runtime dependencies.

const EC_CODEWORDS_L = [0, 7, 10, 15, 20, 26, 36]; // v1..v6
const TOTAL_DATA_BYTES_L = [0, 19, 34, 55, 80, 108, 136]; // v1..v6 (single block for v1..v5, 2 blocks for v6)
const ALIGNMENT_CENTERS: number[][] = [[], [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34]];

const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x;
    GF_LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) GF_EXP[i] = GF_EXP[i - 255];
})();

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return GF_EXP[GF_LOG[a] + GF_LOG[b]];
}

function rsGeneratorPoly(degree: number): number[] {
  let poly = [1];
  for (let i = 0; i < degree; i++) {
    const next = new Array(poly.length + 1).fill(0);
    const factor = GF_EXP[i];
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= poly[j];
      next[j + 1] ^= gfMul(poly[j], factor);
    }
    poly = next;
  }
  return poly;
}

function rsComputeEc(data: number[], ecLen: number): number[] {
  const gen = rsGeneratorPoly(ecLen);
  const res = new Array(data.length + ecLen).fill(0);
  for (let i = 0; i < data.length; i++) res[i] = data[i];
  for (let i = 0; i < data.length; i++) {
    const coef = res[i];
    if (coef !== 0) {
      for (let j = 0; j < gen.length; j++) {
        res[i + j] ^= gfMul(gen[j], coef);
      }
    }
  }
  return res.slice(data.length);
}

function chooseVersion(byteLen: number): number {
  for (let v = 1; v <= 6; v++) {
    // 4 bits mode + 8 bits len + 8*byteLen + 4 bits terminator
    const capacityBits = TOTAL_DATA_BYTES_L[v] * 8;
    if (12 + byteLen * 8 <= capacityBits) return v;
  }
  return 6;
}

function encodeCodewords(bytes: Uint8Array, version: number): number[] {
  const totalData = TOTAL_DATA_BYTES_L[version];
  const bits: number[] = [];
  const pushBits = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) bits.push((val >> i) & 1);
  };
  const maxBytes = totalData - 2; // safe cap
  const sliced = bytes.slice(0, maxBytes);

  pushBits(0b0100, 4); // Byte mode
  pushBits(sliced.length, 8);
  for (const b of sliced) pushBits(b, 8);

  const maxBits = totalData * 8;
  const term = Math.min(4, maxBits - bits.length);
  for (let i = 0; i < term; i++) bits.push(0);
  while (bits.length % 8 !== 0) bits.push(0);

  const data: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j++) byte = (byte << 1) | bits[i + j];
    data.push(byte);
  }
  let padToggle = 0;
  while (data.length < totalData) {
    data.push(padToggle % 2 === 0 ? 0xec : 0x11);
    padToggle++;
  }

  // Version 1-5 have 1 block; Version 6 EC-L has 2 blocks of 68 data + 18 EC each
  if (version < 6) {
    const ec = rsComputeEc(data, EC_CODEWORDS_L[version]);
    return [...data, ...ec];
  }
  const b1 = data.slice(0, 68);
  const b2 = data.slice(68, 136);
  const ec1 = rsComputeEc(b1, 18);
  const ec2 = rsComputeEc(b2, 18);
  const out: number[] = [];
  for (let i = 0; i < 68; i++) out.push(b1[i], b2[i]);
  for (let i = 0; i < 18; i++) out.push(ec1[i], ec2[i]);
  return out;
}

export function generateQrMatrix(text: string): boolean[][] {
  const bytes = new TextEncoder().encode(text || "https://wedslash.com");
  const version = chooseVersion(bytes.length);
  const size = 17 + 4 * version;
  const grid: (boolean | null)[][] = Array.from({ length: size }, () => Array(size).fill(null));
  const reserved: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  const setModule = (r: number, c: number, val: boolean, lock = true) => {
    if (r >= 0 && r < size && c >= 0 && c < size) {
      grid[r][c] = val;
      if (lock) reserved[r][c] = true;
    }
  };

  const drawFinder = (tr: number, tc: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const rr = tr + r;
        const cc = tc + c;
        if (rr < 0 || rr >= size || cc < 0 || cc >= size) continue;
        const inOuter = r >= 0 && r <= 6 && c >= 0 && c <= 6;
        const onBorder = r === 0 || r === 6 || c === 0 || c === 6;
        const inCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        setModule(rr, cc, inOuter && (onBorder || inCenter), true);
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    setModule(6, i, i % 2 === 0, true);
    setModule(i, 6, i % 2 === 0, true);
  }

  // Alignment pattern for v2..v6
  const centers = ALIGNMENT_CENTERS[version];
  if (centers.length >= 2) {
    const ar = centers[1];
    const ac = centers[1];
    for (let dr = -2; dr <= 2; dr++) {
      for (let dc = -2; dc <= 2; dc++) {
        const dark = Math.abs(dr) === 2 || Math.abs(dc) === 2 || (dr === 0 && dc === 0);
        setModule(ar + dr, ac + dc, dark, true);
      }
    }
  }

  // Dark module + format reservation
  setModule(size - 8, 8, true, true);
  for (let i = 0; i < 9; i++) {
    if (i !== 6) {
      reserved[8][i] = true;
      reserved[i][8] = true;
    }
  }
  for (let i = size - 8; i < size; i++) {
    reserved[8][i] = true;
    reserved[i][8] = true;
  }

  // Place codewords (mask pattern 0: (r + c) % 2 === 0)
  const codewords = encodeCodewords(bytes, version);
  let bitIdx = 0;
  const totalBits = codewords.length * 8;
  let dir = -1;
  for (let col = size - 1; col > 0; col -= 2) {
    if (col === 6) col--;
    let row = dir === -1 ? size - 1 : 0;
    while (row >= 0 && row < size) {
      for (let dx = 0; dx < 2; dx++) {
        const c = col - dx;
        if (!reserved[row][c]) {
          let bit = false;
          if (bitIdx < totalBits) {
            const byte = codewords[bitIdx >> 3];
            bit = ((byte >> (7 - (bitIdx & 7))) & 1) === 1;
            bitIdx++;
          }
          const mask = (row + c) % 2 === 0;
          grid[row][c] = mask ? !bit : bit;
        }
      }
      row += dir;
    }
    dir = -dir;
  }

  // Format bits for EC-L (01) + Mask 0 (000) -> BCH = 111011111000100
  const formatBits = [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0];
  const fCoords1: [number, number][] = [
    [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 7], [8, 8],
    [7, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8],
  ];
  const fCoords2: [number, number][] = [
    [size - 1, 8], [size - 2, 8], [size - 3, 8], [size - 4, 8], [size - 5, 8], [size - 6, 8], [size - 7, 8],
    [8, size - 8], [8, size - 7], [8, size - 6], [8, size - 5], [8, size - 4], [8, size - 3], [8, size - 2], [8, size - 1],
  ];
  for (let i = 0; i < 15; i++) {
    const val = formatBits[i] === 1;
    grid[fCoords1[i][0]][fCoords1[i][1]] = val;
    grid[fCoords2[i][0]][fCoords2[i][1]] = val;
  }

  return grid.map((row) => row.map((cell) => Boolean(cell)));
}

export function qrToSvgMarkup(text: string, fg = "#161412", bg = "#FFFFFF"): string {
  const matrix = generateQrMatrix(text);
  const size = matrix.length;
  const pad = 2;
  const view = size + pad * 2;
  let paths = "";
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (matrix[r][c]) {
        paths += `M${c + pad},${r + pad}h1v1h-1z`;
      }
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${view} ${view}" shape-rendering="crispEdges"><rect width="${view}" height="${view}" fill="${bg}"/><path d="${paths}" fill="${fg}"/></svg>`;
}
