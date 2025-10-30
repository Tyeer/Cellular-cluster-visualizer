
import React from 'react';

interface MetricProps {
    label: string;
    value: string | number;
    helpText?: string;
    className?: string;
}

const Metric: React.FC<MetricProps> = ({ label, value, helpText, className = '' }) => (
    <div className={`bg-gray-700/60 p-4 rounded-lg text-center ${className}`}>
        <p className="text-sm text-gray-400" title={helpText}>{label}</p>
        <p className="text-2xl font-bold text-cyan-400">{value}</p>
    </div>
);

interface MetricsPanelProps {
    totalCells: number;
    clusterSizeN: number;
    cochannelCells: number;
    systemCapacity: number;
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({
    totalCells,
    clusterSizeN,
    cochannelCells,
    systemCapacity,
}) => {
    return (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Metric label="Total Cells" value={totalCells} helpText="Total number of cells in the rendered grid." />
            <Metric label="Reuse Factor" value={`1 / ${clusterSizeN}`} helpText="The fraction of total channels available in a single cell." />
            <Metric label="Co-channel Cells" value={cochannelCells} helpText="Cells using the same frequency (Group A)." />
            <Metric label="System Capacity" value={systemCapacity.toFixed(0)} helpText="Total simultaneous users the visible network can support." />
        </div>
    );
};

export default MetricsPanel;
