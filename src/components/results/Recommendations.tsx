'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Recommendation } from '@/types';

interface RecommendationsProps {
  recommendations: Recommendation[];
}

export function Recommendations({ recommendations }: RecommendationsProps) {
  const getIcon = (type: Recommendation['type']) => {
    switch (type) {
      case 'highlight':
        return '🌟';
      case 'warning':
        return '⚠️';
      case 'opportunity':
        return '💡';
    }
  };

  const getStyle = (type: Recommendation['type']) => {
    switch (type) {
      case 'highlight':
        return 'border-l-green-500 bg-green-500/5';
      case 'warning':
        return 'border-l-orange-500 bg-orange-500/5';
      case 'opportunity':
        return 'border-l-blue-500 bg-blue-500/5';
    }
  };

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommendations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className={`border-l-4 p-4 rounded-r-lg ${getStyle(rec.type)}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl">{getIcon(rec.type)}</span>
              <div>
                <p className="font-semibold">{rec.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
