"use client";

import { useState } from "react";
import { useAppStore } from "@/store/app-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Check, Palette } from "lucide-react";

// Mock data - in production this would come from a backend API
const doorStyles = [
  {
    id: "shaker",
    name: "Shaker",
    description: "Classic American style with clean lines",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop",
    price: "Base Price"
  },
  {
    id: "raised-panel",
    name: "Raised Panel",
    description: "Traditional style with decorative raised center",
    image: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=300&h=300&fit=crop",
    price: "+$15 per door"
  },
  {
    id: "flat-panel",
    name: "Flat Panel",
    description: "Modern minimalist design",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop",
    price: "Base Price"
  },
  {
    id: "beadboard",
    name: "Beadboard",
    description: "Cottage style with vertical grooves",
    image: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=300&h=300&fit=crop",
    price: "+$25 per door"
  }
];

const finishOptions = [
  {
    id: "white",
    name: "Classic White",
    description: "Timeless and versatile",
    color: "#FFFFFF",
    border: "#E5E5E5"
  },
  {
    id: "espresso",
    name: "Espresso",
    description: "Rich dark brown",
    color: "#3C2415",
    border: "#3C2415"
  },
  {
    id: "gray",
    name: "Storm Gray",
    description: "Modern neutral",
    color: "#6B7280",
    border: "#6B7280"
  },
  {
    id: "navy",
    name: "Navy Blue",
    description: "Bold and sophisticated",
    color: "#1E3A8A",
    border: "#1E3A8A"
  },
  {
    id: "sage",
    name: "Sage Green",
    description: "Natural and calming",
    color: "#84A98C",
    border: "#84A98C"
  },
  {
    id: "natural",
    name: "Natural Oak",
    description: "Wood grain finish",
    color: "#DEB887",
    border: "#DEB887"
  }
];

interface DoorStyleSelectionProps {
  onComplete: () => void;
}

export default function DoorStyleSelection({ onComplete }: DoorStyleSelectionProps) {
  const { doorStyle, setDoorStyle, finish, setFinish } = useAppStore();
  const [selectedStyle, setSelectedStyle] = useState(doorStyle);
  const [selectedFinish, setSelectedFinish] = useState(finish);

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyle(styleId);
    setDoorStyle(styleId);
  };

  const handleFinishSelect = (finishId: string) => {
    setSelectedFinish(finishId);
    setFinish(finishId);
  };

  const handleContinue = () => {
    if (selectedStyle && selectedFinish) {
      onComplete();
    }
  };

  const canContinue = selectedStyle && selectedFinish;

  return (
    <div className="space-y-4">
      {/* Door Style Selection */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-xl flex items-center justify-center gap-2">
            <Palette className="h-5 w-5 text-zinc-700" />
            Select Door Style
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Choose the cabinet door design that matches your vision
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {doorStyles.map((style) => (
              <div
                key={style.id}
                className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedStyle === style.id
                    ? "border-zinc-900 bg-zinc-50"
                    : "border-zinc-200 hover:border-zinc-300"
                }`}
                onClick={() => handleStyleSelect(style.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-zinc-100 flex-shrink-0">
                    <img
                      src={style.image}
                      alt={style.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-zinc-900">{style.name}</h3>
                      {selectedStyle === style.id && (
                        <Check className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <p className="text-sm text-zinc-600 mb-2">{style.description}</p>
                    <Badge variant="outline" className="text-xs">
                      {style.price}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Finish Selection */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-xl">Select Finish</CardTitle>
          <p className="text-sm text-muted-foreground">
            Choose the color and texture for your cabinet doors
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {finishOptions.map((finishOption) => (
              <div
                key={finishOption.id}
                className={`relative border rounded-lg p-3 cursor-pointer transition-all ${
                  selectedFinish === finishOption.id
                    ? "border-zinc-900 bg-zinc-50"
                    : "border-zinc-200 hover:border-zinc-300"
                }`}
                onClick={() => handleFinishSelect(finishOption.id)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full border-2 flex-shrink-0"
                    style={{
                      backgroundColor: finishOption.color,
                      borderColor: finishOption.border
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-1">
                      <h4 className="font-medium text-sm text-zinc-900 truncate">
                        {finishOption.name}
                      </h4>
                      {selectedFinish === finishOption.id && (
                        <Check className="h-3 w-3 text-green-600 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-zinc-600">{finishOption.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Combination Preview */}
      {selectedStyle && selectedFinish && (
        <Card className="border-0 shadow-sm bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="font-medium text-green-800 mb-2">Your Selection</h3>
              <div className="flex items-center justify-center gap-4">
                <div className="text-sm">
                  <span className="font-medium">Style:</span> {doorStyles.find(s => s.id === selectedStyle)?.name}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Finish:</span> {finishOptions.find(f => f.id === selectedFinish)?.name}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Continue Button */}
      <div className="pt-4">
        <Button
          onClick={handleContinue}
          disabled={!canContinue}
          className="w-full h-12 text-base font-medium"
          size="lg"
        >
          Continue to Cabinet Selection
        </Button>

        {!canContinue && (
          <p className="text-center text-sm text-muted-foreground mt-2">
            Please select both door style and finish to continue
          </p>
        )}
      </div>
    </div>
  );
}
