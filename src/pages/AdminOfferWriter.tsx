import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Copy, ExternalLink, Sparkles } from "lucide-react";
import { Logo } from "../components/common/Logo";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { validateBookingInput } from "../lib/booking-rules";

type OfferTone = "friendly" | "professional" | "budget";

type OfferForm = {
  taskTitle: string;
  location: string;
  due: string;
  budget: string;
  gardenSizeMin: string;
  gardenSizeMax: string;
  greenWasteBin: "yes" | "no" | "";
  workSummary: string;
  offerPrice: string;
  availability: string;
  tone: OfferTone;
  name: string;
  phone: string;
};

const defaultOfferForm: OfferForm = {
  taskTitle: "Lawn mowing",
  location: "Clayton South, Victoria",
  due: "Flexible",
  budget: "80",
  gardenSizeMin: "50",
  gardenSizeMax: "150",
  greenWasteBin: "yes",
  workSummary: "Lawn mowing and weed clean up",
  offerPrice: "80",
  availability: "I can do this this week. What day/time suits you?",
  tone: "friendly",
  name: "Logic Lawns",
  phone: "",
};

function buildOfferMessage(input: OfferForm) {
  const priceLine = input.offerPrice.trim()
    ? `I can do this for $${input.offerPrice.trim()}.`
    : "I can quote this once I confirm a couple details.";

  const sizeLine =
    input.gardenSizeMin.trim() && input.gardenSizeMax.trim()
      ? `Garden size: around ${input.gardenSizeMin.trim()}–${input.gardenSizeMax.trim()}m².`
      : "";

  const binLine =
    input.greenWasteBin === "yes"
      ? "If you’ve got a green waste bin, I can use that."
      : input.greenWasteBin === "no"
        ? "I can remove green waste if needed."
        : "";

  const questions = [
    "Is it front only or front + back?",
    "Any steep slope, long grass, or access issues?",
    "Do you want edges done and paths blown as well?",
  ];

  const greeting =
    input.tone === "professional"
      ? "Hi there,"
      : input.tone === "budget"
        ? "Hi,"
        : "Hi! 👋";

  const intro =
    input.tone === "professional"
      ? `I can help with "${input.taskTitle}".`
      : input.tone === "budget"
        ? `Can help with your "${input.taskTitle}" quickly.`
        : `I can help with your "${input.taskTitle}".`;

  const close =
    input.tone === "professional"
      ? "If that works, reply with a preferred time and I’ll lock it in."
      : input.tone === "budget"
        ? "Message me and I’ll confirm a time."
        : "Message me and I’ll get it sorted for you 🙂";

  const signatureParts = [input.name.trim() || "Logic Lawns"];
  if (input.phone.trim()) signatureParts.push(input.phone.trim());

  return [
    greeting,
    "",
    intro,
    input.location.trim() ? `Location: ${input.location.trim()}.` : "",
    input.due.trim() ? `When: ${input.due.trim()}.` : "",
    input.workSummary.trim() ? `Scope: ${input.workSummary.trim()}.` : "",
    sizeLine,
    binLine,
    "",
    priceLine,
    "",
    "Quick questions so I quote/plan correctly:",
    ...questions.map((q) => `• ${q}`),
    "",
    input.availability.trim(),
    "",
    close,
    "",
    signatureParts.join(" · "),
  ]
    .filter(Boolean)
    .join("\n");
}

export function AdminOfferWriter() {
  const navigate = useNavigate();
  const [form, setForm] = useState<OfferForm>(defaultOfferForm);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const message = useMemo(() => buildOfferMessage(form), [form]);

  const validationErrors = useMemo(() => {
    const bookingLike = {
      name: form.taskTitle || "Task",
      phone: form.phone || "00000000",
      address: form.location || "Location",
      service: "other",
      notes: form.workSummary,
      status: "pending" as const,
    };

    return validateBookingInput(bookingLike);
  }, [form.location, form.phone, form.taskTitle, form.workSummary]);

  const handleCopy = async () => {
    setError("");
    setCopied(false);

    if (validationErrors.length > 0) {
      setError(validationErrors[0]);
      return;
    }

    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("Could not copy to clipboard. Please copy manually.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="container px-4 mx-auto h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo />
            <div className="h-6 w-px bg-slate-200 hidden md:block" />
            <span className="text-sm font-medium text-slate-500 hidden md:block">
              Offer Writer
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button variant="ghost" size="sm" onClick={() => window.open("https://www.airtasker.com", "_blank")}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Airtasker
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow container px-4 mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Auto Offer Generator</h1>
                  <p className="text-sm text-slate-500 mt-1">
                    Fill the task details, then copy/paste into Airtasker.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-brand-700 bg-brand-50 border border-brand-200 rounded-full px-3 py-1 text-xs">
                  <Sparkles className="w-4 h-4" />
                  Fast replies
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taskTitle">Task title</Label>
                  <Input
                    id="taskTitle"
                    value={form.taskTitle}
                    onChange={(e) => setForm((c) => ({ ...c, taskTitle: e.target.value }))}
                    placeholder="Lawn mowing"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={form.location}
                    onChange={(e) => setForm((c) => ({ ...c, location: e.target.value }))}
                    placeholder="Suburb, State"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Task budget ($)</Label>
                  <Input
                    id="budget"
                    inputMode="numeric"
                    value={form.budget}
                    onChange={(e) =>
                      setForm((c) => ({ ...c, budget: e.target.value, offerPrice: c.offerPrice || e.target.value }))
                    }
                    placeholder="80"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="offerPrice">Your offer ($)</Label>
                  <Input
                    id="offerPrice"
                    inputMode="numeric"
                    value={form.offerPrice}
                    onChange={(e) => setForm((c) => ({ ...c, offerPrice: e.target.value }))}
                    placeholder="80"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="due">When</Label>
                  <Input
                    id="due"
                    value={form.due}
                    onChange={(e) => setForm((c) => ({ ...c, due: e.target.value }))}
                    placeholder="Flexible"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gardenSizeMin">Garden size min (m²)</Label>
                  <Input
                    id="gardenSizeMin"
                    inputMode="numeric"
                    value={form.gardenSizeMin}
                    onChange={(e) => setForm((c) => ({ ...c, gardenSizeMin: e.target.value }))}
                    placeholder="50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gardenSizeMax">Garden size max (m²)</Label>
                  <Input
                    id="gardenSizeMax"
                    inputMode="numeric"
                    value={form.gardenSizeMax}
                    onChange={(e) => setForm((c) => ({ ...c, gardenSizeMax: e.target.value }))}
                    placeholder="150"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bin">Green waste bin</Label>
                  <Select
                    value={form.greenWasteBin}
                    onValueChange={(value) => setForm((c) => ({ ...c, greenWasteBin: value as OfferForm["greenWasteBin"] }))}
                  >
                    <SelectTrigger id="bin">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="workSummary">Work summary</Label>
                <Textarea
                  id="workSummary"
                  value={form.workSummary}
                  onChange={(e) => setForm((c) => ({ ...c, workSummary: e.target.value }))}
                  placeholder="Lawn mowing and weed clean up"
                  className="resize-none"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tone">Tone</Label>
                  <Select
                    value={form.tone}
                    onValueChange={(value) => setForm((c) => ({ ...c, tone: value as OfferTone }))}
                  >
                    <SelectTrigger id="tone">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="budget">Budget-focused</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Signature name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))}
                    placeholder="Logic Lawns"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="availability">Availability line</Label>
                <Input
                  id="availability"
                  value={form.availability}
                  onChange={(e) => setForm((c) => ({ ...c, availability: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Optional phone (shown in signature)</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm((c) => ({ ...c, phone: e.target.value }))}
                  placeholder="0400 000 000"
                />
              </div>

              {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <div className="flex items-center gap-3">
                <Button className="bg-brand-600 hover:bg-brand-700 text-white" onClick={handleCopy} type="button">
                  <Copy className="w-4 h-4 mr-2" />
                  {copied ? "Copied" : "Copy Offer"}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    setForm(defaultOfferForm);
                    setError("");
                    setCopied(false);
                  }}
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Preview</h2>
                <p className="text-sm text-slate-500 mt-1">
                  This is what you’ll paste into Airtasker.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 whitespace-pre-wrap text-sm text-slate-900">
                {message}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

