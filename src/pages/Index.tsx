import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, TrendingUp, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [tickers, setTickers] = useState<string[]>([""]);
  const [report, setReport] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const addTicker = () => {
    if (tickers.length < 3) {
      setTickers([...tickers, ""]);
    }
  };

  const removeTicker = (index: number) => {
    if (tickers.length > 1) {
      setTickers(tickers.filter((_, i) => i !== index));
    }
  };

  const updateTicker = (index: number, value: string) => {
    const newTickers = [...tickers];
    newTickers[index] = value.toUpperCase();
    setTickers(newTickers);
  };

  const generateReport = async () => {
    const validTickers = tickers.filter(t => t.trim() !== "");
    
    if (validTickers.length === 0) {
      toast({
        title: "No tickers entered",
        description: "Please enter at least one stock ticker.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setReport("");

    try {
      const formatDate = (date: Date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      };

      const getDateNDaysAgo = (n: number) => {
        const now = new Date();
        now.setDate(now.getDate() - n);
        return formatDate(now);
      };

      const dates = {
        startDate: getDateNDaysAgo(3),
        endDate: getDateNDaysAgo(1)
      };

      const stockData = await Promise.all(validTickers.map(async (ticker) => {
        const polygonUrl = import.meta.env.VITE_CLOUDFLARE_POLYGON_WORKER_URL;
        const params = new URLSearchParams({
          startDate: dates.startDate,
          endDate: dates.endDate,
          ticker: ticker
        });
        const polygonUrlWParams = `${polygonUrl}?${params.toString()}`;

        const response = await fetch(polygonUrlWParams);
        const data = await response.json();

        if(!response.ok) throw new Error(`Worker error: ${data.error}`);
        
        delete data.request_id;
        return JSON.stringify(data);
      }));
      
      const combinedStockData = stockData.join('\n\n');

      const messages = [
        {
          role: 'system',
          content: 'You are a trading guru. Given data on share prices over the past 3 days, write a report of no more than 150 words describing the stocks performance and recommending whether to buy, hold or sell. Use the examples provided between ### to set the style your response.'
        },
        {
          role: 'user',
          content: `${combinedStockData}
          ###
          OK baby, hold on tight! You are going to haate this! Over the past three days, Tesla (TSLA) shares have plummetted. The stock opened at $223.98 and closed at $202.11 on the third day, with some jumping around in the meantime. This is a great time to buy, baby! But not a great time to sell! But I'm not done! Apple (AAPL) stocks have gone stratospheric! This is a seriously hot stock right now. They opened at $166.38 and closed at $182.89 on day three. So all in all, I would hold on to Tesla shares tight if you already have them - they might bounce right back up and head to the stars! They are volatile stock, so expect the unexpected. For APPL stock, how much do you need the money? Sell now and take the profits or hang on and wait for more! If it were me, I would hang on because this stock is on fire right now!!! Apple are throwing a Wall Street party and y'all invited!
          ###
          Apple (AAPL) is the supernova in the stock sky – it shot up from $150.22 to a jaw-dropping $175.36 by the close of day three. We're talking about a stock that's hotter than a pepper sprout in a chilli cook-off, and it's showing no signs of cooling down! If you're sitting on AAPL stock, you might as well be sitting on the throne of Midas. Hold on to it, ride that rocket, and watch the fireworks, because this baby is just getting warmed up! Then there's Meta (META), the heartthrob with a penchant for drama. It winked at us with an opening of $142.50, but by the end of the thrill ride, it was at $135.90, leaving us a little lovesick. It's the wild horse of the stock corral, bucking and kicking, ready for a comeback. META is not for the weak-kneed So, sugar, what's it going to be? For AAPL, my advice is to stay on that gravy train. As for META, keep your spurs on and be ready for the rally.
          ###
          `
        }
      ]

      const openaiUrl = import.meta.env.VITE_CLOUDFLARE_OPENAI_WORKER_URL;
      const openaiResponse = await fetch(openaiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messages)
      });

      const aiAnalysis = await openaiResponse.json();

      if(!openaiResponse.ok) {
        const errorText = aiAnalysis.error;
        throw new Error(`Failed to get AI analysis: ${errorText}`);
      }
      
      setReport(aiAnalysis.content);
      
      toast({
        title: "Report generated",
        description: "Your AI-powered stock analysis is ready.",
      });
    } catch (error) {
      toast({
        title: "Error fetching stock data",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/20 via-primary/5 to-transparent" />
        
        {/* Floating shapes */}
        <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl animate-pulse" />
        <div className="absolute right-10 top-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-pulse delay-700" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />
        
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
          <div className="text-center">
            {/* Icon decoration */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-accent/20 blur-2xl" />
                <div className="relative rounded-2xl bg-gradient-to-br from-accent/10 to-primary/10 p-6 backdrop-blur-sm border border-accent/20">
                  <TrendingUp className="h-16 w-16 text-accent" strokeWidth={1.5} />
                </div>
              </div>
            </div>
            
            <h1 className="mb-6 bg-gradient-to-br from-foreground via-foreground to-accent bg-clip-text text-transparent text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Stock Market Analyzer
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed">
              Get AI-powered insights on up to 3 stock tickers. Professional analysis in seconds.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8 -mt-8">
        {/* Main card with enhanced styling */}
        <Card className="overflow-hidden shadow-2xl border-border/50 backdrop-blur-sm bg-card/95">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 pointer-events-none" />
          
          <div className="relative p-8 sm:p-10">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <TrendingUp className="h-6 w-6 text-accent" strokeWidth={2} />
                </div>
                <h2 className="text-2xl font-bold text-card-foreground">
                  Enter Stock Tickers
                </h2>
              </div>
              <p className="text-muted-foreground">
                Add 1-3 stock symbols (e.g., AAPL, GOOGL, MSFT)
              </p>
            </div>

            <div className="space-y-4">
              {tickers.map((ticker, index) => (
                <div key={index} className="flex gap-3 group">
                  <div className="relative flex-1">
                    <Input
                      placeholder={`Ticker ${index + 1} (e.g., AAPL)`}
                      value={ticker}
                      onChange={(e) => updateTicker(index, e.target.value)}
                      className="h-14 font-mono text-lg uppercase bg-background/50 border-2 border-border focus:border-accent focus:ring-accent/20 transition-all duration-200"
                      maxLength={5}
                    />
                  </div>
                  {tickers.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeTicker(index)}
                      className="shrink-0 h-14 w-14 border-2 hover:border-destructive hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              ))}

              <div className="flex gap-3 pt-4">
                {tickers.length < 3 && (
                  <Button
                    variant="outline"
                    onClick={addTicker}
                    className="flex-1 h-14 border-2 border-dashed hover:border-accent hover:bg-accent/5 hover:text-accent transition-all duration-200"
                  >
                    Add Another Ticker
                  </Button>
                )}
                <Button
                  onClick={generateReport}
                  disabled={isLoading}
                  className="flex-1 h-14 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground font-semibold shadow-lg hover:shadow-xl hover:shadow-accent/20 transition-all duration-200 transform hover:scale-[1.02]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="mr-2 h-5 w-5" />
                      Generate Report
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Report Display */}
        {report && (
          <Card className="mt-8 overflow-hidden shadow-2xl border-border/50 backdrop-blur-sm bg-card/95 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Accent bar */}
            <div className="h-1.5 bg-gradient-to-r from-accent via-accent/50 to-transparent" />
            
            <div className="relative p-8 sm:p-10">
              {/* Decorative element */}
              <div className="absolute top-8 right-8 h-24 w-24 rounded-full bg-accent/5 blur-2xl" />
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <TrendingUp className="h-6 w-6 text-accent" strokeWidth={2} />
                  </div>
                  <h2 className="text-2xl font-bold text-card-foreground">
                    Analysis Report
                  </h2>
                </div>
                
                <div className="prose prose-sm max-w-none text-card-foreground/90">
                  {report.split("\n").map((line, i) => (
                    <p key={i} className="mb-3 leading-relaxed">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
