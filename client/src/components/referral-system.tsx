import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { copyToClipboard } from "@/lib/wallet-utils";
import { useToast } from "@/hooks/use-toast";

interface ReferralSystemProps {
  userId: number;
}

export default function ReferralSystem({ userId }: ReferralSystemProps) {
  const { toast } = useToast();
  
  const { data: referralData } = useQuery({
    queryKey: ['/api/referral/stats', userId],
    enabled: !!userId,
  });

  const handleCopyReferralLink = async () => {
    if (referralData?.referralLink) {
      const success = await copyToClipboard(referralData.referralLink);
      if (success) {
        toast({
          title: "Copied!",
          description: "Referral link copied to clipboard",
        });
      }
    }
  };

  return (
    <Card className="glass-card border-purple-500/30">
      <CardHeader>
        <CardTitle className="text-lg font-orbitron font-bold">Referral Program</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <p className="text-2xl font-bold text-yellow-400">
            {referralData?.totalEarnings || 0}
          </p>
          <p className="text-sm text-gray-400">$SLERF Earned from Referrals</p>
        </div>
        
        <div className="glass-card p-3 border border-gray-700 mb-4">
          <div className="flex items-center justify-between">
            <Input
              value={referralData?.referralLink || ""}
              readOnly
              className="bg-transparent border-none text-xs text-gray-400 flex-1"
            />
            <Button
              size="sm"
              className="btn-primary text-xs ml-2"
              onClick={handleCopyReferralLink}
            >
              <Copy className="w-3 h-3 mr-1" />
              Copy
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Active Referrals</span>
            <span className="font-medium">{referralData?.totalReferrals || 0}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Conversion Rate</span>
            <span className="font-medium">{referralData?.conversionRate || 0}%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Bonus per Referral</span>
            <span className="font-medium text-yellow-400">30 $SLERF</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-700">
          <Button className="w-full btn-primary" size="sm">
            <ExternalLink className="w-4 h-4 mr-2" />
            Share Referral Link
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
