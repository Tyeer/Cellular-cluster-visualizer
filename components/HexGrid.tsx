
import React, { useMemo } from 'react';
import type { Cell } from '../types';
import { COLORS } from '../constants';

interface HexGridProps {
    cells: Cell[];
    clusterSizeN: number;
    i: number;
    j: number;
    cochannelDistance: number;
}

const HexGrid: React.FC<HexGridProps> = ({ cells, clusterSizeN, i, j, cochannelDistance }) => {
    const viewBox = useMemo(() => {
        if (cells.length === 0) return "0 0 10 10";
        
        const allX = cells.flatMap(cell => cell.corners.map(c => c.x));
        const allY = cells.flatMap(cell => cell.corners.map(c => c.y));
        
        const minX = Math.min(...allX);
        const maxX = Math.max(...allX);
        const minY = Math.min(...allY);
        const maxY = Math.max(...allY);

        const width = maxX - minX;
        const height = maxY - minY;
        const padding = 1.5;

        return `${minX - padding} ${minY - padding} ${width + padding * 2} ${height + padding * 2}`;
    }, [cells]);

    const firstNCellIds = useMemo(() => {
        const ids = new Set<number>();
        if (cells.length > 0) {
            // A more robust way to find the first cluster by looking at unique groups
            const groupsFound = new Set<number>();
            for(const cell of cells) {
                if (!groupsFound.has(cell.group)) {
                    ids.add(cell.id);
                    groupsFound.add(cell.group);
                }
                if (groupsFound.size === clusterSizeN) break;
            }
        }
        return ids;
    }, [cells, clusterSizeN]);

    if (cells.length === 0) {
        return <div className="text-center p-8">Loading Grid...</div>;
    }

    return (
        <div className="w-full aspect-square relative">
             <h3 className="absolute top-2 left-1/2 -translate-x-1/2 text-center text-lg font-bold bg-gray-900/70 px-4 py-1 rounded-md text-white">
                 N = {clusterSizeN} | Pattern (i={i}, j={j}) | D = {cochannelDistance.toFixed(2)}R
             </h3>
            <svg viewBox={viewBox} className="w-full h-full">
                <defs>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="0.1" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                {cells.map(cell => {
                    const isCochannel = cell.group === 0;
                    const isFirstCluster = firstNCellIds.has(cell.id);
                    const points = cell.corners.map(p => `${p.x},${p.y}`).join(' ');
                    const groupChar = String.fromCharCode(65 + cell.group);
                    
                    return (
                        <g key={cell.id} className="transition-all duration-300">
                             <title>{`Cell ${cell.id}\nGroup: ${groupChar}\nCoords: (q=${cell.q}, r=${cell.r})`}</title>
                            <polygon
                                points={points}
                                fill={COLORS[cell.group % COLORS.length]}
                                stroke={isCochannel ? '#e74c3c' : '#1f2937'}
                                strokeWidth={isCochannel ? 0.15 : 0.05}
                                style={{ transition: 'fill 0.5s ease' }}
                                opacity={isCochannel ? 1 : 0.85}
                            />
                             {isFirstCluster && (
                                <polygon
                                    points={points}
                                    fill="none"
                                    stroke="yellow"
                                    strokeWidth="0.08"
                                    strokeDasharray="0.3 0.15"
                                    style={{ pointerEvents: 'none' }}
                                />
                            )}
                             <text
                                x={cell.x}
                                y={cell.y}
                                textAnchor="middle"
                                dy="0.06em"
                                fontSize="0.4"
                                fontWeight="bold"
                                fill={isCochannel ? '#ffffff' : '#1f2937'}
                                style={{ pointerEvents: 'none', transition: 'fill 0.5s ease' }}
                                filter={isCochannel ? "url(#glow)" : "none"}
                             >
                                {groupChar}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

export default HexGrid;
