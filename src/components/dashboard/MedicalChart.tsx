
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
} from 'recharts';

interface DataPoint {
  name: string;
  value: number;
  range?: string;
}

interface ChartProps {
  title: string;
  data: DataPoint[];
  type?: 'bar' | 'line' | 'area';
  color?: string;
  unit?: string;
  range?: {
    min: number;
    max: number;
  };
}

const MedicalChart = ({ 
  title, 
  data, 
  type = 'bar', 
  color = '#00B8C8',
  unit = '',
  range
}: ChartProps) => {
  const [chartData, setChartData] = useState<DataPoint[]>([]);
  
  useEffect(() => {
    // Simulate data loading with animation
    const timer = setTimeout(() => {
      setChartData(data);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [data]);
  
  const renderChart = () => {
    switch(type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip 
                formatter={(value) => [`${value}${unit}`, '']}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar 
                dataKey="value" 
                fill={color} 
                radius={[4, 4, 0, 0]} 
                animationDuration={1000}
              />
              {range && (
                <svg>
                  <defs>
                    <line 
                      id="targetLine" 
                      x1="0%" 
                      y1={`${100 - (range.max * 100 / (range.max * 1.2))}`} 
                      x2="100%" 
                      y2={`${100 - (range.max * 100 / (range.max * 1.2))}`} 
                      stroke="red" 
                      strokeWidth="2" 
                      strokeDasharray="5,5" 
                    />
                  </defs>
                </svg>
              )}
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip 
                formatter={(value) => [`${value}${unit}`, '']}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={color} 
                strokeWidth={2} 
                dot={{ fill: color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip 
                formatter={(value) => [`${value}${unit}`, '']}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <defs>
                <linearGradient id={`color-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={color} 
                strokeWidth={2}
                fillOpacity={1} 
                fill={`url(#color-${title})`}
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>{title}</span>
          {data.length > 0 && (
            <Button 
              variant="ghost" 
              className="text-xs h-7 text-medisync-primary hover:text-medisync-secondary hover:bg-transparent"
            >
              See insights
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderChart()}
        {data.length > 0 && (
          <div className="mt-4 flex justify-between text-sm">
            {data[0]?.range && (
              <div className="text-gray-500">
                {data[0].range}
              </div>
            )}
            <div></div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicalChart;
