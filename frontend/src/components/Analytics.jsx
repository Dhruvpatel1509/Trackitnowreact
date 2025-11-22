import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../lib/supabase';

export function Analytics() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const { data: tasks } = await supabase
                .from('tasks')
                .select('date, points')
                .eq('is_completed', true)
                .eq('is_recurring', false)
                .eq('is_visible', true)
                .order('date');

            if (tasks) {
                // Group by date
                const grouped = tasks.reduce((acc, task) => {
                    const date = task.date;
                    acc[date] = (acc[date] || 0) + task.points;
                    return acc;
                }, {});

                const chartData = Object.entries(grouped).map(([date, points]) => ({
                    date,
                    points
                }));

                setData(chartData);
            }
        };

        fetchData();
    }, []);

    const totalPoints = data.reduce((acc, d) => acc + d.points, 0);
    const bestDay = data.length > 0 ? data.reduce((a, b) => a.points > b.points ? a : b) : { date: '-', points: 0 };

    return (
        <div className="w-full max-w-full mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-8">Analytics</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-xl">
                    <h3 className="text-gray-400 text-sm mb-2">Total Points Earned</h3>
                    <p className="text-4xl font-bold text-white">{totalPoints}</p>
                </div>
                <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-xl">
                    <h3 className="text-gray-400 text-sm mb-2">Best Day</h3>
                    <p className="text-4xl font-bold text-white">{bestDay.points} <span className="text-lg text-gray-500 font-normal">pts</span></p>
                    <p className="text-sm text-gray-500 mt-1">{bestDay.date}</p>
                </div>
            </div>

            <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 h-[400px]">
                <h3 className="text-lg font-semibold text-white mb-6">Performance History</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', color: '#fff' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="points"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            dot={{ fill: '#3B82F6', strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
