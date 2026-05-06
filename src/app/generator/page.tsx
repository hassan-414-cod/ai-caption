"use client";
import { useState, useRef } from 'react';
import { useAuth } from '../../lib/auth';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';
import { Loader2, ImagePlus, Copy, Save, RefreshCw, X, Sparkles } from 'lucide-react';
import { generateAndSaveCaptionAction } from '../actions';
import { GeneratedResult } from '../../lib/gemini';

import { ImageHoverZoom } from '../../components/animations';

export default function Generator() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [description, setDescription] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [tone, setTone] = useState('Casual and Friendly');
  const [hashtagCount, setHashtagCount] = useState('15');
  const [language, setLanguage] = useState('English');
  const [brandVoice, setBrandVoice] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isFree = profile?.plan === 'free';
  const maxHashtags = isFree ? 10 : 30;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // Limits are now handled within the Server Action
  const checkLimits = async () => {
    return true;
  };

  const handleGenerate = async () => {
    if (!description && !imageFile) {
      toast.error('Please provide a description or upload an image.');
      return;
    }
    if (!user) {
      toast.error('Please log in to generate captions.');
      return;
    }

    const canProceed = await checkLimits();
    if (!canProceed) return;

    setIsGenerating(true);
    try {
      const idToken = await user.getIdToken();
      let base64Image = undefined;
      if (imageFile) {
        toast.info('Uploading image for analysis...');
        base64Image = await fileToBase64(imageFile);
      }

      toast.info('Crafting your perfect caption...');
      const resultData = await generateAndSaveCaptionAction(
        idToken,
        {
          description,
          platform,
          tone,
          hashtagCount: isFree ? Math.min(parseInt(hashtagCount), 10) : parseInt(hashtagCount),
          language,
          brandVoice: isFree ? undefined : brandVoice,
        },
        base64Image,
        imageFile?.type
      );

      if (resultData.error) {
        toast.error(resultData.error);
        setIsGenerating(false);
        return;
      }

      const genResult: GeneratedResult = {
        variants: {
          direct: resultData.variants[0],
          story: resultData.variants[1],
          cta: resultData.variants[2]
        },
        hashtags: resultData.hashtags
      };

      setResult(genResult);
      toast.success('Generated successfully!');
      
    } catch (error: any) {
      console.error("Generation error:", error);
      toast.error(error.message || "Generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const copyAllHashtags = () => {
    if (!result) return;
    const text = result.hashtags.map(t => `#${t}`).join(' ');
    copyToClipboard(text);
  };

  return (
    <div className="w-[96%] mx-auto min-h-[90vh] flex flex-col items-center animate-bg-gradient relative overflow-hidden rounded-[2.5rem] mt-4 mb-4 border border-white/20 shadow-2xl">
      <div className="absolute inset-0 bg-texture pointer-events-none opacity-[0.05]"></div>
      <div className="w-[80%] mx-auto p-4 pt-32 pb-16 relative z-10 flex-1">
      <div className="relative group overflow-hidden rounded-[2.5rem] border border-white/20 shadow-2xl">
        {/* Unified Background Reflection */}
        <div className="absolute inset-0 animate-bg-gradient opacity-[0.05] group-hover:opacity-[0.08] transition-opacity pointer-events-none"></div>
        <div className="absolute inset-0 bg-white/70 backdrop-blur-xl pointer-events-none"></div>

        <div className="relative z-10 p-8 lg:p-12 flex flex-col gap-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight">AI Content Generator</h1>
              <p className="text-slate-500">Craft perfect copy and hashtags in seconds.</p>
            </div>
            {result && (
              <div className="flex gap-2">
                <button onClick={handleGenerate} disabled={isGenerating} className="px-4 py-2 text-xs font-bold bg-white/80 border border-slate-200 rounded-full text-slate-600 hover:bg-white transition-colors flex items-center shadow-sm">
                  <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isGenerating ? 'animate-spin' : ''}`} /> Regenerate
                </button>
                <button onClick={copyAllHashtags} className="px-4 py-2 text-xs font-bold bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 flex items-center">
                  <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy All
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Side: Inputs */}
            <div className="space-y-8">
              <div>
                <Label htmlFor="desc" className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">What are you posting about? <span className="text-red-500">*</span></Label>
                <Textarea 
                  id="desc" 
                  placeholder="E.g. A flat lay of my new skincare routine with warm morning light coming through the window." 
                  className="w-full p-4 bg-white/50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none h-40 shadow-inner"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Platform</Label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger className="w-full p-3 bg-white/50 border border-slate-200 rounded-xl text-sm outline-none"><SelectValue/></SelectTrigger>
                    <SelectContent>
                      {['Instagram', 'TikTok', 'LinkedIn', 'Facebook', 'Twitter/X'].map(p => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger className="w-full p-3 bg-white/50 border border-slate-200 rounded-xl text-sm outline-none"><SelectValue/></SelectTrigger>
                    <SelectContent>
                      {['Casual and Friendly', 'Professional', 'Funny and Witty', 'Inspirational and Motivational', 'Bold and Edgy', 'Luxury and Refined'].map(p => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-full p-3 bg-white/50 border border-slate-200 rounded-xl text-sm outline-none"><SelectValue/></SelectTrigger>
                    <SelectContent>
                      {['English', 'Urdu', 'Arabic', 'Hinglish'].map(p => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Hashtag Count</Label>
                  <div className="flex gap-2">
                    {[10, 20, 30].map(count => (
                      <button 
                        key={count}
                        disabled={isFree && count > 10}
                        onClick={() => setHashtagCount(count.toString())}
                        className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${hashtagCount === count.toString() ? 'bg-indigo-600 text-white shadow-md' : 'bg-white/50 text-slate-600 border border-slate-200 hover:bg-white'} ${isFree && count > 10 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {!isFree && (
                <div className="space-y-6">
                  <div>
                    <Label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Image Analysis</Label>
                    {imagePreview ? (
                      <div className="relative w-32 h-32">
                        <ImageHoverZoom src={imagePreview} alt="Preview" className="w-full h-full rounded-2xl border border-slate-200 shadow-md">
                          <button onClick={removeImage} className="absolute -top-2 -right-2 bg-white text-slate-800 p-1.5 rounded-full shadow-lg hover:text-red-500 transition-colors z-10">
                            <X className="w-4 h-4" />
                          </button>
                        </ImageHoverZoom>
                      </div>
                    ) : (
                      <div onClick={() => fileInputRef.current?.click()} className="w-full border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center hover:bg-white/60 hover:border-indigo-300 transition-all cursor-pointer">
                        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                        <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-3">
                          <ImagePlus className="w-6 h-6 text-indigo-500" />
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Drop photo to auto-caption</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Brand Voice</Label>
                    <Textarea 
                      placeholder="Paste your past best-performing captions..." 
                      className="w-full p-4 bg-white/50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none h-24 shadow-inner"
                      value={brandVoice}
                      onChange={(e) => setBrandVoice(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <Button 
                  className="w-full py-6 bg-indigo-600 text-white rounded-2xl font-bold text-base shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all h-16" 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                >
                  {isGenerating ? <><Loader2 className="w-6 h-6 mr-3 animate-spin"/> Crafting Magic...</> : <><Sparkles className="w-6 h-6 mr-3"/> Generate Now</>}
                </Button>
                
                <div className="pt-8 border-t border-slate-100 mt-8">
                  <p className="text-xs text-center text-slate-500 mb-6">
                    Free plan limited to 5 generations/day. <span className="text-indigo-600 cursor-pointer hover:underline font-bold" onClick={() => router.push('/settings')}>Upgrade for Unlimited & Premium features.</span>
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center text-center group">
                      <div className="w-full aspect-video rounded-2xl overflow-hidden mb-3 border border-slate-100 shadow-sm relative">
                        <img src="/marketing/marketing1.png" alt="Marketing 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Instant Captions</h4>
                      <p className="text-[10px] text-slate-400 leading-tight">AI-powered copy tailored to your brand voice in seconds.</p>
                    </div>

                    <div className="flex flex-col items-center text-center group">
                      <div className="w-full aspect-video rounded-2xl overflow-hidden mb-3 border border-slate-100 shadow-sm relative">
                        <img src="/marketing/marketing2.png" alt="Marketing 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Smart Analysis</h4>
                      <p className="text-[10px] text-slate-400 leading-tight">Upload images and let our vision AI describe the perfect scene.</p>
                    </div>

                    <div className="flex flex-col items-center text-center group">
                      <div className="w-full aspect-video rounded-2xl overflow-hidden mb-3 border border-slate-100 shadow-sm relative">
                        <img src="/marketing/marketing3.png" alt="Marketing 3" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Viral Hashtags</h4>
                      <p className="text-[10px] text-slate-400 leading-tight">Get trending tags that actually reach your target audience.</p>
                    </div>
                  </div>

                  <div className="mt-8 bg-slate-50/50 rounded-2xl p-4 flex items-center gap-4 border border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-700">How to go Unlimited?</h5>
                      <p className="text-[10px] text-slate-500">Upgrade to the Pro plan for just $9/mo to unlock full power.</p>
                    </div>
                    <Button size="sm" variant="outline" className="ml-auto text-[10px] font-bold h-8 rounded-lg border-indigo-200 text-indigo-600 hover:bg-indigo-50" onClick={() => router.push('/settings')}>View Pricing</Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Results */}
            <div className="flex flex-col h-full">
              {result ? (
                <div className="flex flex-col h-full gap-8">
                  <div className="bg-white/80 rounded-3xl border border-slate-100 overflow-hidden shadow-sm flex flex-col flex-1">
                    <Tabs defaultValue="direct" className="w-full flex flex-col h-full">
                      <TabsList className="w-full grid grid-cols-3 bg-slate-50/50 p-1 h-auto rounded-none">
                        <TabsTrigger value="direct" className="py-3 text-xs font-bold uppercase tracking-wider rounded-xl data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">Direct</TabsTrigger>
                        <TabsTrigger value="story" className="py-3 text-xs font-bold uppercase tracking-wider rounded-xl data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">Story</TabsTrigger>
                        <TabsTrigger value="cta" className="py-3 text-xs font-bold uppercase tracking-wider rounded-xl data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">CTA</TabsTrigger>
                      </TabsList>
                      
                      {['direct', 'story', 'cta'].map((type) => (
                        <TabsContent key={type} value={type} className="flex-1 mt-0">
                          <div className="p-8 flex flex-col h-full justify-between gap-6">
                            <p className="text-slate-700 leading-relaxed text-lg whitespace-pre-wrap">
                              {(result.variants as any)[type]}
                            </p>
                            <button className="flex items-center justify-center gap-2 py-3 w-full bg-slate-50 text-indigo-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-50 transition-colors border border-indigo-100" onClick={() => copyToClipboard((result.variants as any)[type])}>
                              <Copy className="w-4 h-4" /> Copy This Variant
                            </button>
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </div>

                  <div className="bg-white/80 rounded-3xl border border-slate-100 p-8 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Generated Hashtags</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.hashtags.map((tag, idx) => (
                        <span 
                          key={idx} 
                          className="px-4 py-2 bg-indigo-50/50 border border-indigo-100 text-indigo-600 rounded-full text-xs font-bold cursor-pointer hover:bg-indigo-100 transition-all"
                          onClick={() => copyToClipboard(`#${tag}`)}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 p-12 text-center bg-white/30 rounded-[2rem] border border-dashed border-slate-200">
                  <div className="w-20 h-20 rounded-3xl bg-white border border-slate-100 flex items-center justify-center shadow-md mb-6">
                    <Sparkles className="w-10 h-10 text-indigo-200" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-600 mb-2">Ready to shine?</h3>
                  <p className="text-sm max-w-[240px]">Enter your post details on the left and I'll handle the rest.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
