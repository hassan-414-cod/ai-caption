"use client";
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Check, Sparkles, Zap, LayoutTemplate, Image, Hash } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { signInWithGoogle } from '../lib/firebase';
import { useRouter } from 'next/navigation';
import { ParticleBackground, TextReveal, Parallax, RevealOnScroll, HoverScale } from '../components/animations';

export default function Landing() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="w-[96%] mx-auto min-h-[90vh] flex flex-col items-center animate-bg-gradient relative overflow-hidden rounded-[2.5rem] mt-4 mb-4 border border-white/20 shadow-2xl">
      <div className="absolute inset-0 bg-texture pointer-events-none opacity-[0.05]"></div>
      <div className="w-full flex-1 flex flex-col pt-32 relative">
        <ParticleBackground />
        
        {/* Hero Section */}
        <section className="w-full px-4 text-center max-w-4xl mx-auto mb-20 lg:mb-32 relative z-10">
          <Parallax offset={30}>
            <div className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-sm bg-white/50 backdrop-blur-sm mb-8 shadow-sm">
              <Sparkles className="w-4 h-4 mr-2 text-indigo-600" />
              <span className="font-bold text-slate-700">The AI Copywriter for Social Media</span>
            </div>
            <TextReveal delay={0.1}>
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
                Write perfect captions <br /> in <span className="text-transparent text-stroke">5 seconds.</span>
              </h1>
            </TextReveal>
            <TextReveal delay={0.2}>
              <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                Upload a photo or describe your post. CaptionAI instantly generates platform-optimized copy and hashtag sets tailored to your voice.
              </p>
            </TextReveal>
            <RevealOnScroll delay={0.3} yOffset={20}>
              <div className="flex flex-col items-center justify-center gap-8">
                <Button size="lg" className="h-14 px-8 text-lg bg-indigo-600 text-white rounded-full hover:bg-indigo-700 shadow-lg shadow-indigo-200 active:scale-95 transition-all" onClick={signInWithGoogle}>
                  Start Generating for Free
                </Button>
                
                {/* Moving Strip Banner */}
                <div className="w-[80%] mx-auto overflow-hidden relative py-4 border-y border-black/5 mt-16">
                  <div className="flex animate-marquee gap-12 items-center text-black font-black uppercase tracking-[0.3em] text-[12px]">
                    {[...Array(15)].map((_, i) => (
                      <span key={i} className="flex items-center gap-12 whitespace-nowrap">
                        <span>Captions in 5 seconds</span>
                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </Parallax>
        </section>



        {/* Visual Features Section with Marketing Images Wrapped in a Card */}
        <section id="features" className="w-full py-24 px-6 relative z-10">
          <div className="w-[80%] mx-auto bg-white/70 backdrop-blur-xl rounded-[3rem] border border-white/20 shadow-xl overflow-hidden p-12 lg:p-20">
            <div className="text-center mb-16">
              <Badge className="bg-indigo-50 text-indigo-600 border-indigo-100 mb-4 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">Premium Insights</Badge>
              <h2 className="text-4xl font-black text-slate-800 tracking-tight mb-4">Everything you need to go viral</h2>
              <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
                Stop wasting hours on captions. Let our AI do the heavy lifting while you focus on creating content.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col group">
                <div className="w-full aspect-video rounded-3xl overflow-hidden mb-6 border border-slate-200 shadow-sm relative">
                  <img src="/marketing/marketing1.png" alt="Instant Captions" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <p className="text-white text-sm font-medium">Turbocharged Creativity</p>
                  </div>
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-2">Instant Generations</h4>
                <p className="text-slate-500 text-sm leading-relaxed">High-converting captions for any platform in under 3 seconds.</p>
              </div>

              <div className="flex flex-col group">
                <div className="w-full aspect-video rounded-3xl overflow-hidden mb-6 border border-slate-200 shadow-sm relative">
                  <img src="/marketing/marketing2.png" alt="Smart Analysis" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <p className="text-white text-sm font-medium">Visual Intelligence</p>
                  </div>
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-2">Image to Caption</h4>
                <p className="text-slate-500 text-sm leading-relaxed">Vision AI that describes the perfect scene from your media.</p>
              </div>

              <div className="flex flex-col group">
                <div className="w-full aspect-video rounded-3xl overflow-hidden mb-6 border border-slate-200 shadow-sm relative">
                  <img src="/marketing/marketing3.png" alt="Viral Hashtags" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <p className="text-white text-sm font-medium">Reach Optimization</p>
                  </div>
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-2">Smart Hashtags</h4>
                <p className="text-slate-500 text-sm leading-relaxed">Trending and niche hashtags that actually boost your reach.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Second Moving Strip Banner */}
        <div className="w-[80%] mx-auto overflow-hidden relative py-4 border-y border-black/5 mt-16">
          <div className="flex animate-marquee gap-12 items-center text-black font-black uppercase tracking-[0.3em] text-[12px]">
            {[...Array(15)].map((_, i) => (
              <span key={i} className="flex items-center gap-12 whitespace-nowrap">
                <span>Captions in 5 seconds</span>
                <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
              </span>
            ))}
          </div>
        </div>

        {/* Pricing Section */}
        <section className="w-full py-20 lg:py-32 bg-transparent relative z-10" id="pricing">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-16">
              <TextReveal>
                <h2 className="text-4xl font-bold tracking-tight text-slate-800 mb-4">Simple, transparent pricing</h2>
              </TextReveal>
              <TextReveal delay={0.1}>
                <p className="text-lg text-slate-600">Choose the plan that fits your growth.</p>
              </TextReveal>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <RevealOnScroll delay={0.1}>
                <PricingTier 
                  name="Free"
                  price="$0"
                  description="For casual creators."
                  features={[
                    '5 generations per day',
                    'Up to 10 hashtags',
                    'All platform formats',
                    'Basic tones'
                  ]}
                  onClick={signInWithGoogle}
                  buttonText="Get Started"
                />
              </RevealOnScroll>
              <RevealOnScroll delay={0.2}>
                <PricingTier 
                  name="Pro"
                  price="$5"
                  period="/mo"
                  description="For serious creators & small business."
                  features={[
                    'Unlimited generations',
                    'Up to 30 hashtags',
                    'Image-to-Caption upload',
                    'Train your Brand Voice',
                    'CSV Export'
                  ]}
                  highlighted
                  onClick={signInWithGoogle}
                  buttonText="Start 7-Day Free Trial"
                />
              </RevealOnScroll>
              <RevealOnScroll delay={0.3}>
                <PricingTier 
                  name="Agency"
                  price="$20"
                  period="/mo"
                  description="For marketing teams handling clients."
                  features={[
                    'Everything in Pro',
                    'Team member seats',
                    'Bulk generation mode',
                    'White-label exports',
                    'Analytics Dashboard'
                  ]}
                  onClick={signInWithGoogle}
                  buttonText="Go Agency"
                />
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <footer className="w-full py-12 px-6 border-t border-slate-200 bg-white/50 backdrop-blur-md relative z-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight text-slate-800">CaptionAI</span>
              </div>
              <p className="text-slate-500 max-w-sm mb-6 leading-relaxed">
                Empowering creators and brands with AI-driven social media copy that actually converts. Join 5,000+ creators today.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-800 mb-4 uppercase text-xs tracking-widest">Product</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">API Access</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 mb-4 uppercase text-xs tracking-widest">Company</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-medium uppercase tracking-widest">
            <p>© 2026 CaptionAI. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-indigo-600 transition-colors">Twitter</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Instagram</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">LinkedIn</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <HoverScale>
      <Card className="border-none shadow-sm bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl h-full transition-shadow hover:shadow-md">
        <CardHeader>
          <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center mb-4 text-indigo-600 shadow-sm">
            {icon}
          </div>
          <CardTitle className="text-slate-800 font-bold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 leading-relaxed text-sm">{description}</p>
        </CardContent>
      </Card>
    </HoverScale>
  );
}

function PricingTier({ name, price, period = "", description, features, highlighted = false, onClick, buttonText }: any) {
  return (
    <HoverScale className="h-full">
      <Card className={`relative flex flex-col rounded-3xl h-full ${highlighted ? 'border-indigo-600 shadow-xl shadow-indigo-100 ring-1 ring-indigo-600 bg-white/90 backdrop-blur-sm' : 'border-slate-200/80 shadow-sm bg-white/60 backdrop-blur-sm'}`}>
        {highlighted && (
          <div className="absolute -top-4 w-full flex justify-center">
            <span className="bg-indigo-600 text-white text-[10px] font-bold py-1.5 px-4 rounded-full uppercase tracking-widest shadow-sm">
              Most Popular
            </span>
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-xl text-slate-800 font-bold">{name}</CardTitle>
          <CardDescription className="text-slate-500 font-medium">{description}</CardDescription>
          <div className="mt-4 flex items-baseline text-4xl font-bold text-slate-800">
            {price}
            <span className="text-lg font-medium text-slate-500 ml-1">{period}</span>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <ul className="space-y-4 mb-8 flex-1">
            {features.map((f: string, i: number) => (
              <li key={i} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-indigo-600" />
                </div>
                {f}
              </li>
            ))}
          </ul>
          <Button 
            className={`w-full h-12 rounded-xl font-bold ${highlighted ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-none'}`}
            onClick={onClick}
          >
            {buttonText}
          </Button>
        </CardContent>
      </Card>
    </HoverScale>
  );
}
