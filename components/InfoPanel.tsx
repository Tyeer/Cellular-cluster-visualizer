
import React from 'react';

const InfoCard: React.FC<{ title: string, isGood: boolean, items: string[], children?: React.ReactNode }> = ({ title, isGood, items }) => (
    <div className={`rounded-xl p-6 border ${isGood ? 'bg-emerald-900/30 border-emerald-600' : 'bg-rose-900/30 border-rose-600'}`}>
        <h4 className={`text-lg font-bold mb-3 ${isGood ? 'text-emerald-400' : 'text-rose-400'}`}>{title}</h4>
        <ul className="space-y-2">
            {items.map((item, index) => {
                const isPositive = item.startsWith('✅');
                return (
                    <li key={index} className={`flex items-start ${isPositive ? 'text-gray-300' : 'text-gray-400'}`}>
                        <span className="mr-2 mt-1">{isPositive ? '✅' : '❌'}</span>
                        <span>{item.substring(2)}</span>
                    </li>
                );
            })}
        </ul>
    </div>
);

const InfoPanel: React.FC = () => {
    return (
        <div className="mt-12">
            <h2 className="text-3xl font-bold text-center text-white mb-6 border-b-2 border-gray-600 pb-3">📚 Understanding Frequency Reuse</h2>
            <div className="grid md:grid-cols-3 gap-8 text-gray-300">
                <div className="md:col-span-1 bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                    <h3 className="text-xl font-semibold text-cyan-400 mb-3">Key Concepts</h3>
                    <ul className="space-y-4">
                        <li><strong>Hexagonal Tessellation:</strong> Cells are modeled as hexagons for efficient area coverage with no gaps. We use axial coordinates (q, r) for grid calculations.</li>
                        <li><strong>Frequency Groups:</strong> The total available frequency spectrum is divided into N groups (A, B, C...). Each cell is assigned one group.</li>
                        <li><strong>Cluster:</strong> A group of N adjacent cells where each frequency group is used exactly once. The yellow-dotted outline highlights one cluster.</li>
                        <li><strong>Co-channel Cells:</strong> Cells that use the same frequency group (e.g., all 'A' cells). They are the primary source of interference.</li>
                    </ul>
                </div>
                <div className="md:col-span-2 grid sm:grid-cols-2 gap-8">
                    <InfoCard 
                        title="Smaller Cluster Size (e.g., N=3, 4)" 
                        isGood={false}
                        items={[
                            "✅ Higher system capacity",
                            "✅ More channels per cell",
                            "❌ Closer co-channel cells",
                            "❌ Higher interference",
                        ]}
                    />
                    <InfoCard 
                        title="Larger Cluster Size (e.g., N=12, 13)" 
                        isGood={true}
                        items={[
                            "✅ Lower interference",
                            "✅ Better call quality (C/I ratio)",
                            "❌ Lower system capacity",
                            "❌ Fewer channels per cell",
                        ]}
                    />
                </div>
            </div>
             <div className="mt-8 bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-cyan-400 mb-3">Common Patterns</h3>
                 <p className="text-gray-400 mb-4">The choice of N is a fundamental trade-off between capacity and quality.</p>
                <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    <li className="bg-gray-800 p-3 rounded-lg text-center"><strong>N=3:</strong> Aggressive, for dense urban areas.</li>
                    <li className="bg-gray-800 p-3 rounded-lg text-center"><strong>N=4:</strong> Balanced, common choice.</li>
                    <li className="bg-cyan-900/50 p-3 rounded-lg text-center ring-2 ring-cyan-500"><strong>N=7:</strong> ⭐ Industry standard, optimal trade-off.</li>
                    <li className="bg-gray-800 p-3 rounded-lg text-center"><strong>N=12:</strong> Conservative, for high quality needs.</li>
                     <li className="bg-gray-800 p-3 rounded-lg text-center"><strong>N=13:</strong> Maximum quality, minimum interference.</li>
                </ul>
            </div>
        </div>
    );
};

export default InfoPanel;
