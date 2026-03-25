'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DropZone } from '@/components/upload/DropZone';
import { ImageGrid } from '@/components/upload/ImageGrid';
import { Button } from '@/components/ui/button';
import { useSimulation } from '@/context/SimulationContext';
import { ClothingItem } from '@/types';

export default function UploadPage() {
  const router = useRouter();
  const { items, addItems, removeItem, updateItem, setStep, isAnalyzing, setAnalyzing } =
    useSimulation();
  const [isUploading, setIsUploading] = useState(false);

  const handleFilesSelected = async (files: File[]) => {
    if (items.length + files.length > 20) {
      alert('Maximum 20 images allowed');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const { items: uploadedItems } = await res.json();
      addItems(uploadedItems as ClothingItem[]);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };

  const analyzeItems = async () => {
    const unanalyzed = items.filter((i) => !i.analysis);
    if (unanalyzed.length === 0) return;

    setAnalyzing(true);
    try {
      for (const item of unanalyzed) {
        try {
          const res = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imagePath: item.url }),
          });

          if (res.ok) {
            const { analysis } = await res.json();
            updateItem(item.id, { analysis });
          }
        } catch (e) {
          console.error(`Failed to analyze ${item.id}:`, e);
        }
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const handleContinue = async () => {
    const unanalyzed = items.filter((i) => !i.analysis);
    if (unanalyzed.length > 0) {
      await analyzeItems();
    }
    setStep('configure');
    router.push('/simulation');
  };

  return (
    <div className="min-h-[100dvh] px-4 md:px-8 py-6 md:py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header - Left aligned for premium feel */}
        <div className="mb-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 text-zinc-100 text-[11px] uppercase tracking-[0.15em] font-medium mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Fashion Intelligence
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 mb-4">
            Upload your
            <br />
            <span className="text-zinc-400">collection</span>
          </h1>
          <p className="text-base text-zinc-500 leading-relaxed max-w-lg">
            Add clothing images to simulate demand across different customer personas. Our AI analyzes style, fit, and market appeal.
          </p>
        </div>

        {/* Drop zone with premium shell */}
        <div className="premium-card-shell mb-12">
          <div className="premium-card-inner">
            <DropZone onFilesSelected={handleFilesSelected} isUploading={isUploading} />
          </div>
        </div>

        {/* Image grid */}
        {items.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-zinc-900">
                  Your Collection
                </h2>
                <p className="text-sm text-zinc-500 mt-1">
                  {items.length} item{items.length > 1 ? 's' : ''} uploaded
                </p>
              </div>
              {items.some((i) => !i.analysis) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={analyzeItems}
                  disabled={isAnalyzing}
                  className="rounded-full px-4 hover-lift press-effect"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Items'}
                </Button>
              )}
            </div>
            <ImageGrid items={items} onRemove={removeItem} isAnalyzing={isAnalyzing} />
          </div>
        )}

        {/* Continue button */}
        {items.length > 0 && (
          <div className="flex justify-start">
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={isUploading || isAnalyzing}
              className="rounded-full px-8 py-6 text-base font-medium hover-lift press-effect bg-zinc-900 hover:bg-zinc-800 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group"
            >
              {isAnalyzing ? (
                'Analyzing Items...'
              ) : (
                <span className="flex items-center gap-3">
                  Continue with {items.length} item{items.length > 1 ? 's' : ''}
                  <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-px transition-transform duration-300">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </span>
              )}
            </Button>
          </div>
        )}

        {/* Empty state hint */}
        {items.length === 0 && (
          <p className="text-sm text-zinc-400 mt-6">
            Upload at least 1 image to continue
          </p>
        )}

        {/* How it works - show when no items */}
        {items.length === 0 && (
          <div className="mt-16 pt-16 border-t border-zinc-200">
            <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-8">
              How it works
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-zinc-900 text-white text-sm font-medium flex items-center justify-center">1</span>
                  <h3 className="font-semibold text-zinc-900">Upload Collection</h3>
                </div>
                <p className="text-sm text-zinc-500 pl-11">
                  Add images of your clothing items. Our AI automatically identifies style, color, and category.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-zinc-900 text-white text-sm font-medium flex items-center justify-center">2</span>
                  <h3 className="font-semibold text-zinc-900">Select Personas</h3>
                </div>
                <p className="text-sm text-zinc-500 pl-11">
                  Choose target customer segments - Gen Z trendsetters, millennials, or a balanced mix.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-zinc-900 text-white text-sm font-medium flex items-center justify-center">3</span>
                  <h3 className="font-semibold text-zinc-900">Get Forecasts</h3>
                </div>
                <p className="text-sm text-zinc-500 pl-11">
                  Receive detailed predictions for each SKU including scores, buy intent, and pricing insights.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-emerald-500 text-white text-sm font-medium flex items-center justify-center">4</span>
                  <h3 className="font-semibold text-zinc-900">Optimize Production</h3>
                </div>
                <p className="text-sm text-zinc-500 pl-11">
                  Make data-driven decisions. Reduce waste, maximize sell-through, and increase margins.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
