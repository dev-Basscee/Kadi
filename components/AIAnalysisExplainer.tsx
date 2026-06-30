'use client';

import { Match } from '@/lib/mockData';
import { Brain, TrendingUp, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AIAnalysisExplainerProps {
  match: Match;
  analysis?: any;
}

export function AIAnalysisExplainer({ match, analysis }: AIAnalysisExplainerProps) {
  const factors = [
    {
      category: 'Team Form',
      icon: TrendingUp,
      items: [
        { label: `${match.homeTeam} Form`, value: `${match.homeForm[4]}%`, positive: match.homeForm[4] > 70 },
        { label: `${match.awayTeam} Form`, value: `${match.awayForm[4]}%`, positive: match.awayForm[4] > 70 },
      ],
    },
    {
      category: 'Head-to-Head',
      icon: Shield,
      items: [
        { label: `${match.homeTeam} Wins`, value: match.h2hStats.homeWins, positive: match.h2hStats.homeWins > match.h2hStats.awayWins },
        { label: `${match.awayTeam} Wins`, value: match.h2hStats.awayWins, positive: match.h2hStats.awayWins > match.h2hStats.homeWins },
      ],
    },
    {
      category: 'Key Insights',
      icon: AlertCircle,
      items: [
        { label: 'Injury Impact', value: 'Low', positive: true },
        { label: 'Home Advantage', value: '+2.5%', positive: true },
      ],
    },
  ];

  // Map Gemini key_factors to confidenceReasons if available
  const confidenceReasons: { reason: string; weight: string; icon: any; color: string }[] = analysis && analysis.key_factors && analysis.key_factors.length > 0
    ? analysis.key_factors.map((factor: string, idx: number) => ({
        reason: factor,
        weight: idx === 0 ? 'High' : 'Medium',
        icon: CheckCircle2,
        color: 'text-primary',
      }))
    : [
        {
          reason: 'Strong recent form of home team',
          weight: 'High',
          icon: CheckCircle2,
          color: 'text-primary',
        },
        {
          reason: 'Favorable head-to-head history',
          weight: 'Medium',
          icon: CheckCircle2,
          color: 'text-primary',
        },
      ];

  return (
    <div className="space-y-6 mt-6">
      {/* AI Brain Header */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border border-primary/30 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Brain size={24} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">AI Analysis</h3>
            <p className="text-sm text-muted-foreground">
              {analysis?.model_used === 'gemini-3.1-pro-preview' 
                ? 'Gemini 3.1 Pro (Premium)' 
                : 'Powered by Gemini 1.5 Flash'}
            </p>
          </div>
        </div>
        {analysis?.summary && (
          <p className="text-sm text-foreground mt-3 italic">&ldquo;{analysis.summary}&rdquo;</p>
        )}
      </div>

      {/* Key Factors Grid */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">Analyzed Factors</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {factors.map((factor) => {
            const Icon = factor.icon;
            return (
              <div key={factor.category} className="bg-card/50 border border-secondary/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Icon size={18} className="text-secondary" />
                  <h5 className="text-sm font-semibold text-foreground">{factor.category}</h5>
                </div>
                <div className="space-y-2">
                  {factor.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{item.label}</span>
                      <span className={`text-xs font-bold ${item.positive ? 'text-primary' : 'text-accent'}`}>
                        {typeof item.value === 'number' ? `${item.value}` : item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confidence Breakdown */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">
          Prediction: <span className="text-primary">{analysis?.verdict || match.prediction.result}</span> ({analysis?.confidence || match.prediction.confidence}%)
        </h4>
        <div className="space-y-2">
          {confidenceReasons.map((reason, idx) => {
            const IconComponent = reason.icon;
            return (
              <div key={idx} className="flex items-center gap-3 bg-card/50 border border-primary/10 rounded-lg p-3">
                <IconComponent size={16} className={`${reason.color} flex-shrink-0`} />
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-sm text-foreground">{reason.reason}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${reason.weight === '35%' ? 'bg-primary/20 text-primary' : reason.weight === '25%' ? 'bg-secondary/20 text-secondary' : reason.weight === '20%' ? 'bg-accent/20 text-accent' : 'bg-muted/20 text-muted-foreground'}`}>
                    {reason.weight}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="bg-card/50 border border-accent/30 rounded-lg p-4">
        <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <AlertCircle size={16} className="text-accent" />
          Risk Assessment
        </h4>
        <div className="space-y-2 text-sm text-muted-foreground">
          {analysis && analysis.risks && analysis.risks.length > 0 ? (
            <ul className="list-disc pl-4 space-y-1">
              {analysis.risks.map((risk: string, i: number) => (
                <li key={i}>{risk}</li>
              ))}
            </ul>
          ) : (
            <p>This prediction is based on statistical analysis of team form, historical performance, and recent trends. Unforeseen factors may impact the outcome.</p>
          )}
          <p className="text-xs text-accent mt-2">Predicted Accuracy: {analysis?.confidence || 78}% (Based on model confidence)</p>
        </div>
      </div>
    </div>
  );
}
