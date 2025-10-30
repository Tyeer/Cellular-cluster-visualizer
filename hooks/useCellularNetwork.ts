import { useMemo } from 'react';
import type { Cell, Point } from '../types';

const { sqrt, cos, sin, PI } = Math;

// --- Helper Functions (ported from Python) ---

const hexagonCorners = (center: Point, size: number): Point[] => {
    const corners: Point[] = [];
    for (let i = 0; i < 6; i++) {
        const angle_rad = PI / 180 * (60 * i);
        corners.push({
            x: center.x + size * cos(angle_rad),
            y: center.y + size * sin(angle_rad),
        });
    }
    corners.push(corners[0]); // Close the hexagon
    return corners;
};

const axialToPixel = (q: number, r: number, size: number): Point => {
    const x = size * (3 / 2 * q);
    const y = size * (sqrt(3) / 2 * q + sqrt(3) * r);
    return { x, y };
};

const getHexagonRing = (center_q: number, center_r: number, radius: number): {q: number, r: number}[] => {
    if (radius === 0) return [{ q: center_q, r: center_r }];
    
    const results: {q: number, r: number}[] = [];
    let q = center_q - radius;
    let r = center_r + radius;
    
    const directions = [
        { q: 1, r: 0 }, { q: 1, r: -1 }, { q: 0, r: -1 },
        { q: -1, r: 0 }, { q: -1, r: 1 }, { q: 0, r: 1 }
    ];
    
    for (const direction of directions) {
        for (let step = 0; step < radius; step++) {
            results.push({ q, r });
            q += direction.q;
            r += direction.r;
        }
    }
    return results;
};

const getHexagonSpiral = (center_q: number, center_r: number, radius: number): {q: number, r: number}[] => {
    let results = [{ q: center_q, r: center_r }];
    for (let k = 1; k <= radius; k++) {
        results = results.concat(getHexagonRing(center_q, center_r, k));
    }
    return results;
};

const findIjForN = (N: number): { i: number, j: number } => {
    // Loop with i >= j to find the most "compact" i,j pair first.
    for (let i = 0; i <= Math.ceil(sqrt(N)); i++) {
        for (let j = 0; j <= i; j++) {
            if (i * i + i * j + j * j === N) {
                return { i, j };
            }
        }
    }
    return { i: 1, j: 0 }; // fallback for N=1
};

const calculateCochannelDistance = (N: number): number => {
    return sqrt(3 * N);
};


// --- The Custom Hook ---

export const useCellularNetwork = (N: number, radius: number) => {
    return useMemo(() => {
        const { i, j } = findIjForN(N);

        // --- Robust Frequency Group Assignment ---
        // The simple formula (i*r - j*q) % N fails when gcd(i,j,N) > 1.
        // This robust method works by defining a canonical base cluster and
        // mapping every cell in the grid to its equivalent cell in that cluster.
        
        // 1. Pre-compute the canonical cluster map.
        const canonicalClusterMap = new Map<string, number>();
        const searchRadius = Math.ceil(sqrt(N)) + 2; // Heuristic to ensure all N cells are found
        const spiral = getHexagonSpiral(0, 0, searchRadius);

        for (const coord of spiral) {
            if (canonicalClusterMap.size === N) break;

            const { q, r } = coord;
            
            // Transform (q,r) to the cluster lattice basis (non-orthogonal)
            const a_float = ((i + j) * q + j * r) / N;
            const b_float = (-j * q + i * r) / N;
            
            // Find the nearest lattice point (a_int, b_int)
            const a_int = Math.round(a_float);
            const b_int = Math.round(b_float);

            // Find the coordinate within the base cluster by subtracting the lattice vector
            const q_reduced = q - (a_int * i - b_int * j);
            const r_reduced = r - (a_int * j + b_int * (i + j));

            const key = `${q_reduced},${r_reduced}`;
            if (!canonicalClusterMap.has(key)) {
                // Assign a unique, contiguous group ID
                canonicalClusterMap.set(key, canonicalClusterMap.size);
            }
        }

        // 2. Create an assignment function that uses the map.
        const assignFrequencyGroup = (q: number, r: number): number => {
            const a_float = ((i + j) * q + j * r) / N;
            const b_float = (-j * q + i * r) / N;

            const a_int = Math.round(a_float);
            const b_int = Math.round(b_float);

            const q_reduced = q - (a_int * i - b_int * j);
            const r_reduced = r - (a_int * j + b_int * (i + j));
            
            const key = `${q_reduced},${r_reduced}`;
            return canonicalClusterMap.get(key) ?? 0; // Fallback to 0 if not found
        };
        
        // --- Generate Grid using the new assignment function ---
        const hexCoords = getHexagonSpiral(0, 0, radius);
        const size = 1.0;

        const cells: Cell[] = hexCoords.map((coord, idx) => {
            const { q, r } = coord;
            const pixelPos = axialToPixel(q, r, size);
            const group = assignFrequencyGroup(q, r);
            const corners = hexagonCorners(pixelPos, size * 0.95); // Slight gap

            return {
                id: idx,
                q,
                r,
                x: pixelPos.x,
                y: pixelPos.y,
                group,
                corners,
            };
        });

        const cochannelDistance = calculateCochannelDistance(N);

        return { cells, i, j, cochannelDistance };

    }, [N, radius]);
};
