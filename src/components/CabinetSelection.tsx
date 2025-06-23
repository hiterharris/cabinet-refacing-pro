"use client";

import { useState } from "react";
import { useAppStore, type CabinetSelection as CabinetSelectionType } from "@/store/app-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Package, Plus, Minus } from "lucide-react";

// Cabinet category definitions with all required height and width options
const cabinetCategories = {
  wallCabinets: {
    title: "Wall Cabinets",
    icon: Package,
    heights: ["Up to 18\"", "19\"-30\"", "31\"-42\"", "42\"-48\"", "48\"+"],
    widths: ["Up to 14\"", "15\"-21\"", "22\"-27\""],
    basePrice: 150
  },
  tallCabinets: {
    title: "Tall Cabinet Doors",
    icon: Package,
    heights: ["60\""],
    widths: ["Up to 14\"", "15\"-21\"", "22\"-27\""],
    basePrice: 200
  },
  baseCabinets: {
    title: "Base Cabinet Doors",
    icon: Package,
    heights: ["30\""],
    widths: ["Up to 14\"", "15\"-21\"", "22\"-27\""],
    basePrice: 175
  },
  drawers: {
    title: "Drawers",
    icon: Package,
    heights: ["6\"", "12\""],
    widths: ["Up to 14\"", "15\"-21\"", "22\"-27\"", "28\"-36\""],
    basePrice: 100
  },
  plainPanels: {
    title: "Plain Panels",
    icon: Package,
    heights: ["Up to 36\"", "37\"-48\""],
    widths: ["Up to 14\"", "15\"-21\"", "22\"-27\"", "28\"-36\"", "Over 36\""],
    basePrice: 80
  },
  appliedPanels: {
    title: "Applied Door Panels",
    icon: Package,
    heights: ["Up to 36\"", "37\"-48\""],
    widths: ["Up to 14\"", "15\"-21\"", "22\"-27\""],
    basePrice: 120
  }
};

interface CabinetCategoryProps {
  categoryKey: keyof typeof cabinetCategories;
  category: typeof cabinetCategories[keyof typeof cabinetCategories];
  selections: CabinetSelectionType[];
  onUpdate: (selections: CabinetSelectionType[]) => void;
}

function CabinetCategoryCard({ categoryKey, category, selections, onUpdate }: CabinetCategoryProps) {
  const [currentHeight, setCurrentHeight] = useState("");

  const addSelection = () => {
    if (!currentHeight) return;

    const newSelection: CabinetSelectionType = {
      height: currentHeight,
      widthQuantities: category.widths.reduce((acc, width) => {
        acc[width] = 0;
        return acc;
      }, {} as Record<string, number>)
    };

    onUpdate([...selections, newSelection]);
    setCurrentHeight("");
  };

  const removeSelection = (index: number) => {
    const newSelections = selections.filter((_, i) => i !== index);
    onUpdate(newSelections);
  };

  const updateQuantity = (selectionIndex: number, width: string, quantity: number) => {
    const newSelections = [...selections];
    newSelections[selectionIndex].widthQuantities[width] = Math.max(0, quantity);
    onUpdate(newSelections);
  };

  const getTotalCount = () => {
    return selections.reduce((total, selection) => {
      return total + Object.values(selection.widthQuantities).reduce((sum, qty) => sum + qty, 0);
    }, 0);
  };

  const totalCount = getTotalCount();

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <category.icon className="h-5 w-5 text-zinc-700" />
            {category.title}
          </div>
          {totalCount > 0 && (
            <Badge variant="default" className="bg-green-600">
              {totalCount} {categoryKey === 'drawers' ? 'drawers' : 'doors'}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Selection */}
        <div className="border rounded-lg p-4 bg-zinc-50">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Label className="text-sm font-medium">Height</Label>
              <Select value={currentHeight} onValueChange={setCurrentHeight}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select height..." />
                </SelectTrigger>
                <SelectContent>
                  {category.heights.map((height) => (
                    <SelectItem key={height} value={height}>
                      {height}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={addSelection}
              disabled={!currentHeight}
              size="sm"
              className="h-10"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Current Selections */}
        {selections.map((selection, selectionIndex) => (
          <div key={`${selection.height}-${selectionIndex}`} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-zinc-900">Height: {selection.height}</h4>
              <Button
                onClick={() => removeSelection(selectionIndex)}
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Width Quantities</Label>
              {category.widths.map((width) => (
                <div key={width} className="flex items-center justify-between">
                  <span className="text-sm text-zinc-600">{width}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => updateQuantity(selectionIndex, width,
                        (selection.widthQuantities[width] || 0) - 1)}
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      disabled={(selection.widthQuantities[width] || 0) <= 0}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Input
                      type="number"
                      value={selection.widthQuantities[width] || 0}
                      onChange={(e) => updateQuantity(selectionIndex, width,
                        Math.max(0, Number.parseInt(e.target.value) || 0))}
                      className="w-16 h-8 text-center"
                      min="0"
                    />
                    <Button
                      onClick={() => updateQuantity(selectionIndex, width,
                        (selection.widthQuantities[width] || 0) + 1)}
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}

              <div className="pt-2 border-t">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Subtotal for this height:</span>
                  <span>{Object.values(selection.widthQuantities).reduce((sum, qty) => sum + qty, 0)} items</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {selections.length === 0 && (
          <div className="text-center py-4 text-sm text-muted-foreground">
            No selections yet. Add a height option above to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface CabinetSelectionProps {
  onComplete: () => void;
}

export default function CabinetSelection({ onComplete }: CabinetSelectionProps) {
  const {
    wallCabinets,
    tallCabinets,
    baseCabinets,
    drawers,
    plainPanels,
    appliedPanels,
    updateWallCabinets,
    updateTallCabinets,
    updateBaseCabinets,
    updateDrawers,
    updatePlainPanels,
    updateAppliedPanels,
    calculateTotal
  } = useAppStore();

  const handleContinue = () => {
    calculateTotal();
    onComplete();
  };

  const getTotalItems = () => {
    const counts = [
      wallCabinets,
      tallCabinets,
      baseCabinets,
      drawers,
      plainPanels,
      appliedPanels
    ].map(selections =>
      selections.reduce((total, selection) => {
        return total + Object.values(selection.widthQuantities).reduce((sum, qty) => sum + qty, 0);
      }, 0)
    );

    return counts.reduce((sum, count) => sum + count, 0);
  };

  const totalItems = getTotalItems();

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">Cabinet Selection</h2>
        <p className="text-muted-foreground mb-4">
          Select the cabinets you want to reface
        </p>
        {totalItems > 0 && (
          <Badge variant="default" className="bg-blue-600">
            {totalItems} total items selected
          </Badge>
        )}
      </div>

      <CabinetCategoryCard
        categoryKey="wallCabinets"
        category={cabinetCategories.wallCabinets}
        selections={wallCabinets}
        onUpdate={updateWallCabinets}
      />

      <CabinetCategoryCard
        categoryKey="tallCabinets"
        category={cabinetCategories.tallCabinets}
        selections={tallCabinets}
        onUpdate={updateTallCabinets}
      />

      <CabinetCategoryCard
        categoryKey="baseCabinets"
        category={cabinetCategories.baseCabinets}
        selections={baseCabinets}
        onUpdate={updateBaseCabinets}
      />

      <CabinetCategoryCard
        categoryKey="drawers"
        category={cabinetCategories.drawers}
        selections={drawers}
        onUpdate={updateDrawers}
      />

      <CabinetCategoryCard
        categoryKey="plainPanels"
        category={cabinetCategories.plainPanels}
        selections={plainPanels}
        onUpdate={updatePlainPanels}
      />

      <CabinetCategoryCard
        categoryKey="appliedPanels"
        category={cabinetCategories.appliedPanels}
        selections={appliedPanels}
        onUpdate={updateAppliedPanels}
      />

      {/* Continue Button */}
      <div className="pt-4">
        <Button
          onClick={handleContinue}
          className="w-full h-12 text-base font-medium"
          size="lg"
        >
          Continue to Pricing
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-2">
          You can always come back to adjust your selections
        </p>
      </div>
    </div>
  );
}
