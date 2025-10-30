
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { VALID_N } from '../constants';

interface PerformanceChartProps {
    totalBandwidth: number;
    channelBandwidth: number;
}

const calculateCochannelDistance = (N: number): number => Math.sqrt(3 * N);

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-700 p-3 border border-gray-600 rounded-lg shadow-lg">
                <p className="font-bold text-cyan-400">{`Cluster Size (N): ${label}`}</p>
                <p className="text-white">{`Capacity: ${payload[0].value.toFixed(0)} channels`}</p>
                <p className="text-yellow-400">{`Distance: ${payload[1].value.toFixed(2)} R`}</p>
            </div>
        );
    }
    return null;
};

const PerformanceChart: React.FC<PerformanceChartProps> = ({ totalBandwidth, channelBandwidth }) => {
    
    const chartData = useMemo(() => {
        const M = 100; // Fixed M for consistent charting
        return VALID_N.map(n => ({
            name: n,
            capacity: M * (totalBandwidth / channelBandwidth) / n,
            distance: calculateCochannelDistance(n),
        }));
    }, [totalBandwidth, channelBandwidth]);

    return (
        <div className="bg-gray-700/50 p-4 rounded-xl shadow-lg border border-gray-600 h-80">
            <h2 className="text-lg font-bold text-white mb-4 text-center">Capacity vs. Interference Trade-off</h2>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                    <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: '#d1d5db' }} label={{ value: 'Cluster Size (N)', position: 'insideBottom', offset: -10, fill: '#9ca3af' }} />
                    <YAxis yAxisId="left" stroke="#3498db" tick={{ fill: '#d1d5db' }} label={{ value: 'Capacity', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}/>
                    <YAxis yAxisId="right" orientation="right" stroke="#f1c40f" tick={{ fill: '#d1d5db' }} label={{ value: 'Distance', angle: 90, position: 'insideRight', fill: '#9ca3af' }}/>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ bottom: -5 }} />
                    <Line yAxisId="left" type="monotone" dataKey="capacity" name="Capacity" stroke="#3498db" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                    <Line yAxisId="right" type="monotone" dataKey="distance" name="Co-channel Distance" stroke="#f1c40f" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4 }} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PerformanceChart;
