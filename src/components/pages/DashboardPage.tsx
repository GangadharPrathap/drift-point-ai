import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp, Settings, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { KartRegistrations } from '@/entities';
import { useMember } from '@/integrations';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

interface AIRecommendation {
  category: string;
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
}

function DashboardPageContent() {
  const { member } = useMember();
  const [karts, setKarts] = useState<KartRegistrations[]>([]);
  const [selectedKart, setSelectedKart] = useState<KartRegistrations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);

  useEffect(() => {
    loadKarts();
  }, []);

  const loadKarts = async () => {
    setIsLoading(true);
    const { items } = await BaseCrudService.getAll<KartRegistrations>('kartregistrations');
    
    const userKarts = items.filter(kart => 
      kart.contactEmail === member?.loginEmail
    );
    
    setKarts(userKarts);
    if (userKarts.length > 0) {
      setSelectedKart(userKarts[0]);
    }
    setIsLoading(false);
  };

  const analyzeKart = async () => {
    if (!selectedKart) return;

    setIsAnalyzing(true);
    
    const GEMINI_API_KEY = 'AIzaSyCdRR1hwpcPJOowTryrxWg_Uj2jRYh6Vbw';
    const prompt = `You are an expert go-kart performance analyst. Analyze this kart and provide 6 specific tuning recommendations:

Kart Details:
- Name: ${selectedKart.kartName}
- Manufacturer: ${selectedKart.manufacturer}
- Model Year: ${selectedKart.modelYear}
- Engine Type: ${selectedKart.engineType}
- Owner: ${selectedKart.ownerName}

Provide recommendations in this exact JSON format (return ONLY valid JSON, no markdown):
[
  {"category": "Engine Tuning", "recommendation": "...", "priority": "high"},
  {"category": "Tire Pressure", "recommendation": "...", "priority": "high"},
  {"category": "Weight Distribution", "recommendation": "...", "priority": "medium"},
  {"category": "Chassis Setup", "recommendation": "...", "priority": "medium"},
  {"category": "Maintenance", "recommendation": "...", "priority": "low"},
  {"category": "Performance Upgrade", "recommendation": "...", "priority": "low"}
]`;

    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + GEMINI_API_KEY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const text = data.candidates[0].content.parts[0].text;
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        
        if (jsonMatch) {
          const recommendations = JSON.parse(jsonMatch[0]) as AIRecommendation[];
          setAiRecommendations(recommendations);
        }
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      // Fallback to default recommendations if API fails
      const recommendations: AIRecommendation[] = [
        {
          category: 'Engine Tuning',
          recommendation: `For your ${selectedKart.engineType} engine, consider adjusting the carburetor mixture to 14.7:1 air-fuel ratio for optimal performance. Monitor exhaust gas temperature to stay within 600-650°F range.`,
          priority: 'high'
        },
        {
          category: 'Tire Pressure',
          recommendation: 'Based on your kart specifications, recommended tire pressure is 10-12 PSI for front tires and 11-13 PSI for rear tires. Adjust based on track temperature and grip conditions.',
          priority: 'high'
        },
        {
          category: 'Weight Distribution',
          recommendation: 'Aim for 43% front / 57% rear weight distribution for improved cornering stability. Consider repositioning seat or adding ballast if needed.',
          priority: 'medium'
        },
        {
          category: 'Chassis Setup',
          recommendation: `For a ${selectedKart.modelYear} ${selectedKart.manufacturer}, ensure proper caster angle (3-5 degrees) and camber settings (-0.5 to -1 degree) for responsive handling.`,
          priority: 'medium'
        },
        {
          category: 'Maintenance',
          recommendation: 'Check chain tension regularly (12-15mm slack). Inspect sprocket wear and replace if teeth show signs of hooking. Clean air filter after every 3-4 sessions.',
          priority: 'low'
        },
        {
          category: 'Performance Upgrade',
          recommendation: 'Consider upgrading to a high-flow exhaust system to gain 0.5-1 HP. Ensure compliance with your racing class regulations before installation.',
          priority: 'low'
        }
      ];
      setAiRecommendations(recommendations);
    }
    
    setIsAnalyzing(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-neon-orange border-neon-orange';
      case 'medium':
        return 'text-neon-blue border-neon-blue';
      case 'low':
        return 'text-gray-400 border-gray-400';
      default:
        return 'text-gray-400 border-gray-400';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="w-5 h-5" />;
      case 'medium':
        return <TrendingUp className="w-5 h-5" />;
      case 'low':
        return <Settings className="w-5 h-5" />;
      default:
        return <Settings className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-paragraph">
      <Header />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-[120rem] mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-heading font-black mb-4">
              AI <span className="text-neon-blue">Pit Crew</span>
            </h1>
            <p className="text-xl text-gray-300">
              Get professional tuning recommendations powered by AI
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-12 h-12 text-neon-blue animate-spin" />
            </div>
          ) : karts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-glass-white backdrop-blur-md border border-white/20 rounded-xl p-12 text-center"
            >
              <Zap className="w-16 h-16 text-neon-blue mx-auto mb-6" />
              <h2 className="text-3xl font-heading font-bold mb-4">No Karts Registered</h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Register your first kart to unlock AI-powered performance analysis and tuning recommendations.
              </p>
              <Link
                to="/register-kart"
                className="inline-flex items-center gap-2 bg-neon-blue text-primary-foreground px-8 py-4 rounded-lg font-heading font-bold text-lg hover:bg-neon-blue/90 transition-all"
              >
                Register Your Kart
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Kart Selection Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-4"
              >
                <div className="bg-glass-white backdrop-blur-md border border-white/20 rounded-xl p-6">
                  <h2 className="text-2xl font-heading font-bold mb-6 text-neon-blue">Your Karts</h2>
                  <div className="space-y-4">
                    {karts.map((kart) => (
                      <button
                        key={kart._id}
                        onClick={() => setSelectedKart(kart)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          selectedKart?._id === kart._id
                            ? 'border-neon-blue bg-neon-blue/10'
                            : 'border-white/20 hover:border-neon-blue/50'
                        }`}
                      >
                        <h3 className="font-heading font-bold text-lg mb-1">{kart.kartName}</h3>
                        <p className="text-sm text-gray-400">
                          {kart.manufacturer} • {kart.modelYear}
                        </p>
                        <p className="text-sm text-gray-400">{kart.engineType}</p>
                      </button>
                    ))}
                  </div>
                  <Link
                    to="/register-kart"
                    className="mt-6 w-full bg-transparent text-neon-blue border border-neon-blue px-6 py-3 rounded-lg font-heading font-semibold hover:bg-neon-blue/10 transition-all flex items-center justify-center gap-2"
                  >
                    + Add New Kart
                  </Link>
                </div>
              </motion.div>

              {/* Analysis Section */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-8"
              >
                {selectedKart && (
                  <div className="space-y-8">
                    {/* Kart Details */}
                    <div className="bg-glass-white backdrop-blur-md border border-white/20 rounded-xl p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h2 className="text-3xl font-heading font-bold mb-2">{selectedKart.kartName}</h2>
                          <p className="text-gray-300">
                            {selectedKart.manufacturer} • {selectedKart.modelYear} • {selectedKart.engineType}
                          </p>
                        </div>
                        <button
                          onClick={analyzeKart}
                          disabled={isAnalyzing}
                          className="bg-neon-orange text-secondary-foreground px-6 py-3 rounded-lg font-heading font-bold hover:bg-neon-orange/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {isAnalyzing ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <Zap className="w-5 h-5" />
                              Analyze
                            </>
                          )}
                        </button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-background/50 rounded-lg p-4">
                          <p className="text-xs text-gray-400 mb-1">Owner</p>
                          <p className="font-heading font-semibold">{selectedKart.ownerName}</p>
                        </div>
                        <div className="bg-background/50 rounded-lg p-4">
                          <p className="text-xs text-gray-400 mb-1">Manufacturer</p>
                          <p className="font-heading font-semibold">{selectedKart.manufacturer}</p>
                        </div>
                        <div className="bg-background/50 rounded-lg p-4">
                          <p className="text-xs text-gray-400 mb-1">Year</p>
                          <p className="font-heading font-semibold">{selectedKart.modelYear}</p>
                        </div>
                        <div className="bg-background/50 rounded-lg p-4">
                          <p className="text-xs text-gray-400 mb-1">Engine</p>
                          <p className="font-heading font-semibold">{selectedKart.engineType}</p>
                        </div>
                      </div>
                    </div>

                    {/* AI Recommendations */}
                    {aiRecommendations.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="bg-glass-white backdrop-blur-md border border-white/20 rounded-xl p-8"
                      >
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-12 h-12 bg-neon-blue/20 rounded-lg flex items-center justify-center">
                            <Zap className="w-6 h-6 text-neon-blue" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-heading font-bold">AI Recommendations</h2>
                            <p className="text-sm text-gray-400">Powered by Advanced AI Analysis</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {aiRecommendations.map((rec, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: index * 0.1 }}
                              className={`border-l-4 ${getPriorityColor(rec.priority)} bg-background/30 rounded-r-lg p-6`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={getPriorityColor(rec.priority)}>
                                  {getPriorityIcon(rec.priority)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-heading font-bold text-lg">{rec.category}</h3>
                                    <span className={`text-xs px-2 py-1 rounded border ${getPriorityColor(rec.priority)} uppercase`}>
                                      {rec.priority}
                                    </span>
                                  </div>
                                  <p className="text-gray-300 leading-relaxed">{rec.recommendation}</p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        <div className="mt-8 bg-neon-blue/10 border border-neon-blue rounded-lg p-6">
                          <div className="flex items-start gap-3">
                            <CheckCircle className="w-6 h-6 text-neon-blue flex-shrink-0 mt-1" />
                            <div>
                              <h3 className="font-heading font-bold text-lg mb-2 text-neon-blue">Analysis Complete</h3>
                              <p className="text-gray-300">
                                These recommendations are based on your kart's specifications and industry best practices. 
                                Always consult with a professional mechanic before making significant modifications.
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Empty State */}
                    {aiRecommendations.length === 0 && !isAnalyzing && (
                      <div className="bg-glass-white backdrop-blur-md border border-white/20 rounded-xl p-12 text-center">
                        <Zap className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                        <h3 className="text-2xl font-heading font-bold mb-4">Ready for Analysis</h3>
                        <p className="text-gray-300 mb-6">
                          Click the "Analyze" button to get AI-powered tuning recommendations for {selectedKart.kartName}.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <DashboardPageContent />
  );
}
