
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { VALID_N } from './constants';
import { useCellularNetwork } from './hooks/useCellularNetwork';
import type { Cell } from './types';
import Controls from './components/Controls';
import PerformanceChart from './components/PerformanceChart';
import HexGrid from './components/HexGrid';
import MetricsPanel from './components/MetricsPanel';
import InfoPanel from './components/InfoPanel';

const App: React.FC = () => {
    const [totalBandwidth, setTotalBandwidth] = useState<number>(25);
    const [channelBandwidth, setChannelBandwidth] = useState<number>(0.2);
    const [clusterSizeN, setClusterSizeN] = useState<number>(7);
    const [gridRadius, setGridRadius] = useState<number>(3);
    const [animate, setAnimate] = useState<boolean>(false);
    const [animationSpeed, setAnimationSpeed] = useState<number>(2);

    const animationFrame = useRef<number>(0);
    const animationTimeout = useRef<number | null>(null);

    const { cells, i, j, cochannelDistance } = useCellularNetwork(clusterSizeN, gridRadius);
    const totalCells = useMemo(() => cells.length, [cells]);
    const cochannelCells = useMemo(() => cells.filter(c => c.group === 0).length, [cells]);

    const systemCapacity = useMemo(() => {
        const channelsPerCell = Math.floor((totalBandwidth / channelBandwidth) / clusterSizeN);
        return channelsPerCell * totalCells;
    }, [totalBandwidth, channelBandwidth, clusterSizeN, totalCells]);

    useEffect(() => {
        if (animate) {
            const animateStep = () => {
                animationFrame.current = (animationFrame.current + 1) % VALID_N.length;
                setClusterSizeN(VALID_N[animationFrame.current]);
                animationTimeout.current = window.setTimeout(animateStep, 2000 / animationSpeed);
            };
            animationTimeout.current = window.setTimeout(animateStep, 2000 / animationSpeed);
        } else if (animationTimeout.current) {
            clearTimeout(animationTimeout.current);
            animationTimeout.current = null;
        }

        return () => {
            if (animationTimeout.current) {
                clearTimeout(animationTimeout.current);
            }
        };
    }, [animate, animationSpeed]);


    return (
        <div className="min-h-screen bg-gray-800 text-gray-200 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold text-cyan-400">
                        📡 Cellular Frequency Reuse Visualizer
                    </h1>
                    <p className="mt-2 text-lg text-gray-400">
                        An interactive simulation of hexagonal cell tessellation and frequency planning.
                    </p>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-8">
                        <Controls
                            totalBandwidth={totalBandwidth}
                            setTotalBandwidth={setTotalBandwidth}
                            channelBandwidth={channelBandwidth}
                            setChannelBandwidth={setChannelBandwidth}
                            clusterSizeN={clusterSizeN}
                            setClusterSizeN={setClusterSizeN}
                            gridRadius={gridRadius}
                            setGridRadius={setGridRadius}
                            animate={animate}
                            setAnimate={setAnimate}
                            animationSpeed={animationSpeed}
                            setAnimationSpeed={setAnimationSpeed}
                        />
                        <PerformanceChart
                            totalBandwidth={totalBandwidth}
                            channelBandwidth={channelBandwidth}
                            totalCells={totalCells}
                        />
                    </div>
                    <div className="lg:col-span-2 bg-gray-900/50 p-4 rounded-xl shadow-2xl border border-gray-700">
                        <HexGrid
                           cells={cells}
                           clusterSizeN={clusterSizeN}
                           i={i}
                           j={j}
                           cochannelDistance={cochannelDistance}
                        />
                         <MetricsPanel
                           totalCells={totalCells}
                           clusterSizeN={clusterSizeN}
                           cochannelCells={cochannelCells}
                           systemCapacity={systemCapacity}
                         />
                    </div>
                </main>
                <InfoPanel />
            </div>
        </div>
    );
};

export default App;