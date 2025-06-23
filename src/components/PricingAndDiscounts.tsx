"use client";

import React, { useState } from "react";
import { useAppStore } from "@/store/app-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calculator, Check, X, Percent, Gift } from "lucide-react";
import { toast } from "sonner";

// Mock validation - in production these would be API calls
const validateDiscountCode = (code: string): { isValid: boolean; discount: number; description: string } => {
  const codes: Record<string, { discount: number; description: string }> = {
    'SAVE10': { discount: 0.10, description: '10% off your total order' },
    'WELCOME15': { discount: 0.15, description: '15% off for new customers' },
    'SPRING2024': { discount: 0.20, description: '20% spring special discount' },
    'LOYALTY': { discount: 0.12, description: '12% loyalty member discount' }
  };

  if (codes[code.toUpperCase()]) {
    return { isValid: true, ...codes[code.toUpperCase()] };
  }

  return { isValid: false, discount: 0, description: '' };
};

const validateReferralCode = (code: string): { isValid: boolean; discount: number; description: string } => {
  const codes: Record<string, { discount: number; description: string }> = {
    'REF2024': { discount: 0.05, description: '5% referral bonus' },
    'FRIEND': { discount: 0.07, description: '7% friend referral discount' },
    'FAMILY': { discount: 0.08, description: '8% family member discount' }
  };

  if (codes[code.toUpperCase()]) {
    return { isValid: true, ...codes[code.toUpperCase()] };
  }

  return { isValid: false, discount: 0, description: '' };
};

interface PricingAndDiscountsProps {
  onComplete: () => void;
}

export default function PricingAndDiscounts({ onComplete }: PricingAndDiscountsProps) {
  const {
    subtotal,
    discountCode,
    discountAmount,
    referralCode,
    referralDiscount,
    grandTotal,
    applyDiscountCode,
    applyReferralCode,
    calculateTotal
  } = useAppStore();

  const [tempDiscountCode, setTempDiscountCode] = useState(discountCode);
  const [tempReferralCode, setTempReferralCode] = useState(referralCode);
  const [discountStatus, setDiscountStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [referralStatus, setReferralStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');

  // Calculate total when component mounts or selections change
  React.useEffect(() => {
    calculateTotal();
  }, [calculateTotal]);

  const handleApplyDiscount = () => {
    const validation = validateDiscountCode(tempDiscountCode);

    if (validation.isValid) {
      applyDiscountCode(tempDiscountCode.toUpperCase());
      setDiscountStatus('valid');
      toast.success(`Discount applied: ${validation.description}`);
    } else {
      setDiscountStatus('invalid');
      toast.error('Invalid discount code. Please check and try again.');
    }
  };

  const handleApplyReferral = () => {
    const validation = validateReferralCode(tempReferralCode);

    if (validation.isValid) {
      applyReferralCode(tempReferralCode.toUpperCase());
      setReferralStatus('valid');
      toast.success(`Referral bonus applied: ${validation.description}`);
    } else {
      setReferralStatus('invalid');
      toast.error('Invalid referral code. Please check and try again.');
    }
  };

  const handleRemoveDiscount = () => {
    applyDiscountCode('');
    setTempDiscountCode('');
    setDiscountStatus('idle');
    toast.info('Discount code removed');
  };

  const handleRemoveReferral = () => {
    applyReferralCode('');
    setTempReferralCode('');
    setReferralStatus('idle');
    toast.info('Referral code removed');
  };

  const totalSavings = subtotal * (discountAmount + referralDiscount);
  const hasAnyDiscount = discountAmount > 0 || referralDiscount > 0;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">Pricing & Discounts</h2>
        <p className="text-muted-foreground mb-4">
          Review your pricing and apply any available codes
        </p>
      </div>

      {/* Project Summary */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-lg flex items-center justify-center gap-2">
            <Calculator className="h-5 w-5 text-zinc-700" />
            Project Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {subtotal > 0 ? (
            <>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Project Subtotal:</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({(discountAmount * 100).toFixed(0)}%):</span>
                    <span>-${(subtotal * discountAmount).toFixed(2)}</span>
                  </div>
                )}

                {referralDiscount > 0 && (
                  <div className="flex justify-between text-sm text-blue-600">
                    <span>Referral Bonus ({(referralDiscount * 100).toFixed(0)}%):</span>
                    <span>-${(subtotal * referralDiscount).toFixed(2)}</span>
                  </div>
                )}

                {hasAnyDiscount && (
                  <div className="flex justify-between text-sm font-medium text-green-700 pt-2 border-t">
                    <span>Total Savings:</span>
                    <span>${totalSavings.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="bg-zinc-900 text-white rounded-lg p-4 text-center">
                <div className="text-sm font-medium mb-1">Project Total</div>
                <div className="text-2xl font-bold">${grandTotal.toFixed(2)}</div>
              </div>
            </>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Calculator className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No items selected yet</p>
              <p className="text-sm">Go back to add cabinet selections</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Discount Code */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Percent className="h-5 w-5 text-zinc-700" />
            Discount Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {discountCode ? (
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">{discountCode}</span>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  {(discountAmount * 100).toFixed(0)}% off
                </Badge>
              </div>
              <Button
                onClick={handleRemoveDiscount}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="discountCode">Enter discount code</Label>
                <div className="flex gap-2">
                  <Input
                    id="discountCode"
                    placeholder="SAVE10, WELCOME15, etc."
                    value={tempDiscountCode}
                    onChange={(e) => {
                      setTempDiscountCode(e.target.value.toUpperCase());
                      setDiscountStatus('idle');
                    }}
                    className={`flex-1 ${
                      discountStatus === 'invalid' ? 'border-red-300' : ''
                    }`}
                  />
                  <Button
                    onClick={handleApplyDiscount}
                    disabled={!tempDiscountCode.trim()}
                    size="sm"
                    className="px-4"
                  >
                    Apply
                  </Button>
                </div>
                {discountStatus === 'invalid' && (
                  <p className="text-sm text-red-600">Invalid discount code</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Referral Code */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Gift className="h-5 w-5 text-zinc-700" />
            Referral Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {referralCode ? (
            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">{referralCode}</span>
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  {(referralDiscount * 100).toFixed(0)}% bonus
                </Badge>
              </div>
              <Button
                onClick={handleRemoveReferral}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="referralCode">Enter referral code</Label>
                <div className="flex gap-2">
                  <Input
                    id="referralCode"
                    placeholder="REF2024, FRIEND, etc."
                    value={tempReferralCode}
                    onChange={(e) => {
                      setTempReferralCode(e.target.value.toUpperCase());
                      setReferralStatus('idle');
                    }}
                    className={`flex-1 ${
                      referralStatus === 'invalid' ? 'border-red-300' : ''
                    }`}
                  />
                  <Button
                    onClick={handleApplyReferral}
                    disabled={!tempReferralCode.trim()}
                    size="sm"
                    className="px-4"
                  >
                    Apply
                  </Button>
                </div>
                {referralStatus === 'invalid' && (
                  <p className="text-sm text-red-600">Invalid referral code</p>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                Referral codes provide additional savings on top of discount codes
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sample Codes Info */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-amber-50 to-orange-50">
        <CardContent className="p-4">
          <h3 className="font-medium text-amber-800 mb-2">Sample Codes (Demo)</h3>
          <div className="space-y-1 text-sm text-amber-700">
            <div><span className="font-medium">Discount:</span> SAVE10, WELCOME15, SPRING2024, LOYALTY</div>
            <div><span className="font-medium">Referral:</span> REF2024, FRIEND, FAMILY</div>
          </div>
        </CardContent>
      </Card>

      {/* Continue Button */}
      <div className="pt-4">
        <Button
          onClick={onComplete}
          className="w-full h-12 text-base font-medium"
          size="lg"
        >
          Continue to Customer Information
        </Button>
      </div>
    </div>
  );
}
