"use client";

import { AlertCircle, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

export function BranchForm() {
	const [city, setCity] = useState("");
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [background, setBackground] = useState("");
	const [events, setEvents] = useState("");
	const [team, setTeam] = useState("no");
	const [languages, setLanguages] = useState("");
	const [consent, setConsent] = useState(false);

	const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
	const [errorMessage, setErrorMessage] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!city || !fullName || !email || !phone || !background || !consent) {
			setStatus("error");
			setErrorMessage("Please fill out all required fields and accept the terms.");
			return;
		}

		setStatus("submitting");

		try {
			const res = await fetch("/api/open-branch", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					city,
					fullName,
					email,
					phone,
					background,
					events,
					team,
					languages,
				}),
			});

			const data = await res.json();

			if (res.ok && data.success) {
				setStatus("success");
				setCity("");
				setFullName("");
				setEmail("");
				setPhone("");
				setBackground("");
				setEvents("");
				setTeam("no");
				setLanguages("");
				setConsent(false);
			} else {
				setStatus("error");
				setErrorMessage(data.error || "Something went wrong. Please try again.");
			}
		} catch {
			setStatus("error");
			setErrorMessage("Network error. Please check your connection.");
		}
	};

	return (
		<div className="w-full">
			{status === "success" && (
				<div className="mb-6 flex items-start gap-3 rounded-2xl bg-green-50 p-4 border border-green-200 text-green-800 animate-in fade-in zoom-in-95 duration-200">
					<CheckCircle className="h-5 w-5 shrink-0 text-green-600 mt-0.5" />
					<div>
						<h4 className="font-bold text-sm">Application Submitted!</h4>
						<p className="text-xs mt-0.5 leading-relaxed">
							Thank you for your interest! We have received your expression of interest to start a
							branch in <strong>{city}</strong> and will get back to you within 2–3 business days.
						</p>
					</div>
				</div>
			)}

			{status === "error" && (
				<div className="mb-6 flex items-start gap-3 rounded-2xl bg-destructive/10 p-4 border border-destructive/20 text-destructive animate-in fade-in zoom-in-95 duration-200">
					<AlertCircle className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
					<div>
						<h4 className="font-bold text-sm">Submission Error</h4>
						<p className="text-xs mt-0.5 leading-relaxed">{errorMessage}</p>
					</div>
				</div>
			)}

			<form
				onSubmit={handleSubmit}
				className="space-y-5 bg-card p-6 sm:p-8 rounded-3xl border border-border/40 shadow-xl relative overflow-hidden"
			>
				<div className="space-y-1.5">
					<Label htmlFor="city" className="text-xs font-bold text-foreground/80">
						Proposed City / Town *
					</Label>
					<Input
						id="city"
						type="text"
						required
						value={city}
						onChange={(e) => setCity(e.target.value)}
						placeholder="e.g. Waterford"
						className="rounded-2xl"
					/>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="space-y-1.5">
						<Label htmlFor="fullName" className="text-xs font-bold text-foreground/80">
							Full Name *
						</Label>
						<Input
							id="fullName"
							type="text"
							required
							value={fullName}
							onChange={(e) => setFullName(e.target.value)}
							placeholder="Your full name"
							className="rounded-2xl"
						/>
					</div>
					<div className="space-y-1.5">
						<Label htmlFor="email" className="text-xs font-bold text-foreground/80">
							Email *
						</Label>
						<Input
							id="email"
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="you@email.com"
							className="rounded-2xl"
						/>
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="space-y-1.5">
						<Label htmlFor="phone" className="text-xs font-bold text-foreground/80">
							Phone Number *
						</Label>
						<Input
							id="phone"
							type="tel"
							required
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
							placeholder="+353 XX XXX XXXX"
							className="rounded-2xl"
						/>
					</div>
					<div className="space-y-1.5">
						<Label htmlFor="languages" className="text-xs font-bold text-foreground/80">
							Languages Spoken
						</Label>
						<Input
							id="languages"
							type="text"
							value={languages}
							onChange={(e) => setLanguages(e.target.value)}
							placeholder="e.g. English, Portuguese, Ukrainian"
							className="rounded-2xl"
						/>
					</div>
				</div>

				<div className="space-y-1.5">
					<Label htmlFor="background" className="text-xs font-bold text-foreground/80">
						Tell us about your background *
					</Label>
					<Textarea
						id="background"
						required
						rows={3}
						value={background}
						onChange={(e) => setBackground(e.target.value)}
						placeholder="Describe your experience with integration, community work, or relevant leadership roles..."
						className="rounded-2xl resize-none"
					/>
				</div>

				<div className="space-y-1.5">
					<Label htmlFor="events" className="text-xs font-bold text-foreground/80">
						What types of events would you like to organize?
					</Label>
					<Textarea
						id="events"
						rows={2}
						value={events}
						onChange={(e) => setEvents(e.target.value)}
						placeholder="e.g. workshops, networking evenings, integration courses, wellbeing circles..."
						className="rounded-2xl resize-none"
					/>
				</div>

				<div className="space-y-2">
					<Label className="text-xs font-bold text-foreground/80">
						Do you have a team to help? *
					</Label>
					<RadioGroup value={team} onValueChange={setTeam} className="flex flex-col gap-2 pt-1">
						<div className="flex items-center gap-2">
							<RadioGroupItem value="yes" id="team-yes" />
							<Label htmlFor="team-yes" className="text-xs font-medium cursor-pointer">
								Yes, we have a core launching group
							</Label>
						</div>
						<div className="flex items-center gap-2">
							<RadioGroupItem value="partial" id="team-partial" />
							<Label htmlFor="team-partial" className="text-xs font-medium cursor-pointer">
								Partially, I have 1 or 2 helpers
							</Label>
						</div>
						<div className="flex items-center gap-2">
							<RadioGroupItem value="no" id="team-no" />
							<Label htmlFor="team-no" className="text-xs font-medium cursor-pointer">
								No, I need help building a launching group
							</Label>
						</div>
					</RadioGroup>
				</div>

				<div className="flex items-start gap-2.5 pt-2">
					<Checkbox
						id="consent"
						checked={consent}
						onCheckedChange={(checked) => setConsent(!!checked)}
						required
						className="mt-1"
					/>
					<Label
						htmlFor="consent"
						className="text-xs leading-normal font-medium text-muted-foreground cursor-pointer select-none"
					>
						I consent to New Life Integration & Wellbeing Network CLG processing my personal data
						for the purpose of evaluating my branch application and future communications. I
						understand I can withdraw this consent at any time. For more information, see our{" "}
						<a href="/privacy" className="text-primary hover:underline font-bold">
							Privacy Policy
						</a>
						. *
					</Label>
				</div>

				<Button
					type="submit"
					disabled={status === "submitting"}
					className="w-full rounded-full py-6 mt-2 font-bold shadow-lg transition-transform hover:scale-[1.01]"
				>
					{status === "submitting" ? "Submitting application..." : "Submit Expression of Interest"}
				</Button>
			</form>
		</div>
	);
}
