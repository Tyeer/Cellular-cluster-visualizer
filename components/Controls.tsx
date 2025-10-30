
import React from 'react';
import { VALID_N } from '../constants';

interface ControlsProps {
    totalBandwidth: number;
    setTotalBandwidth: (value: number) => void;
    channelBandwidth: number;
    setChannelBandwidth: (value: number) => void;
    clusterSizeN: number;
    setClusterSizeN: (value: number) => void;
    gridRadius: number;
    setGridRadius: (value: number) => void;
    animate: boolean;
    setAnimate: (value: boolean) => void;
    animationSpeed: number;
    setAnimationSpeed: (value: number) => void;
}

const Slider: React.FC<{label: string, value: number, min: number, max: number, step: number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}> = ({ label, value, min, max, step, onChange }) => (
    <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-300">{label}</label>
            <span className="text-sm font-semibold text-cyan-400">{value}</span>
        </div>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
        />
    </div>
);


const Controls: React.FC<ControlsProps> = ({
    totalBandwidth, setTotalBandwidth,
    channelBandwidth, setChannelBandwidth,
    clusterSizeN, setClusterSizeN,
    gridRadius, setGridRadius,
    animate, setAnimate,
    animationSpeed, setAnimationSpeed,
}) => {
    return (
        <div className="bg-gray-700/50 p-6 rounded-xl shadow-lg border border-gray-600 space-y-6">
            <h2 className="text-xl font-bold text-white border-b-2 border-cyan-400 pb-2">Simulation Controls</h2>
            
            <Slider label="Total Bandwidth (MHz)" value={totalBandwidth} min={5} max={50} step={0.5} onChange={e => setTotalBandwidth(Number(e.target.value))} />
            <Slider label="Channel Bandwidth (MHz)" value={channelBandwidth} min={0.05} max={1.0} step={0.05} onChange={e => setChannelBandwidth(Number(e.target.value))} />
            
            <div className="flex flex-col space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-300">Cluster Size (N)</label>
                    <span className="text-sm font-semibold text-cyan-400">{clusterSizeN}</span>
                </div>
                <select
                    value={clusterSizeN}
                    onChange={(e) => setClusterSizeN(Number(e.target.value))}
                    className="w-full bg-gray-600 border border-gray-500 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 p-2.5"
                >
                    {VALID_N.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
            </div>
            
            <Slider label="Grid Size (Rings)" value={gridRadius} min={2} max={6} step={1} onChange={e => setGridRadius(Number(e.target.value))} />

            <div className="border-t border-gray-600 pt-4 space-y-4">
                 <div className="flex items-center justify-between">
                    <label htmlFor="animate-toggle" className="text-sm font-medium text-gray-300">
                        Animate Cluster Sizes
                    </label>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="animate-toggle" className="sr-only peer" checked={animate} onChange={e => setAnimate(e.target.checked)} />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                    </label>
                </div>
                {animate && (
                     <Slider label="Animation Speed" value={animationSpeed} min={1} max={10} step={1} onChange={e => setAnimationSpeed(Number(e.target.value))} />
                )}
            </div>
        </div>
    );
};

export default Controls;
