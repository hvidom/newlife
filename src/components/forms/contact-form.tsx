"use client";

import { AlertCircle, CheckCircle, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [subject, setSubject] = useState("");
	const [message, setMessage] = useState("");
	const [consent, setConsent] = useState(false);

	const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
	const [errorMessage, setErrorMessage] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!fullName || !email || !subject || !message || !consent) {
			setStatus("error");
			setErrorMessage("Please fill out all required fields and accept the terms.");
			return;
		}

		setStatus("submitting");

		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					fullName,
					email,
					phone,
					subject,
					message,
				}),
			});

			const data = await res.json();

			if (res.ok && data.success) {
				setStatus("success");
				setFullName("");
				setEmail("");
				setPhone("");
				setSubject("");
				setMessage("");
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
						<h4 class="font-bold text-sm">Inquiry Submitted!</h4>
						<p className="text-xs mt-0.5 leading-relaxed">
							Thank you for reaching out! We have received your message and will get back to you
							within 2–3 business days.
						</p>
					</div>
				</div>
			)}

			{status === "error" && (
				<div className="mb-6 flex items-start gap-3 rounded-2xl bg-destructive/10 p-4 border border-destructive/20 text-destructive animate-in fade-in zoom-in-95 duration-200">
					<AlertCircle className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
					<div>
						<h4 class="font-bold text-sm">Submission Error</h4>
						<p className="text-xs mt-0.5 leading-relaxed">{errorMessage}</p>
					</div>
				</div>
			)}

			<form
				onSubmit={handleSubmit}
				className="space-y-5 bg-card p-6 sm:p-8 rounded-3xl border border-border/40 shadow-xl relative overflow-hidden"
			>
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
							Phone Number
						</Label>
						<Input
							id="phone"
							type="tel"
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
							placeholder="+353 XX XXX XXXX"
							className="rounded-2xl"
						/>
					</div>
					<div className="space-y-1.5 flex flex-col justify-end">
						<Label htmlFor="subject" className="text-xs font-bold text-foreground/80 mb-1.5">
							Subject *
						</Label>
						<Select value={subject} onValueChange={setSubject}>
							<SelectTrigger className="w-full rounded-2xl text-left bg-input/50 border-transparent focus:border-ring">
								<SelectValue placeholder="Select a subject" />
							</SelectTrigger>
							<SelectContent
								position="popper"
								className="bg-popover border border-border/40 rounded-2xl"
							>
								<SelectGroup>
									<SelectItem value="General Inquiry">General Inquiry</SelectItem>
									<SelectItem value="Branch Information">Branch Information</SelectItem>
									<SelectItem value="Event Registration">Event Registration</SelectItem>
									<SelectItem value="Leadership Program">Leadership Program</SelectItem>
									<SelectItem value="Grant Services">Grant Services</SelectItem>
									<SelectItem value="Wiz at Life">Wiz at Life</SelectItem>
									<SelectItem value="Partnership">Partnership</SelectItem>
									<SelectItem value="Other">Other</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="space-y-1.5">
					<Label htmlFor="message" className="text-xs font-bold text-foreground/80">
						Message *
					</Label>
					<Textarea
						id="message"
						required
						rows={5}
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						placeholder="How can we help you on your integration journey?"
						className="rounded-2xl resize-none"
					/>
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
						By submitting this form, you consent to New Life Integration & Wellbeing Network CLG
						processing your data to respond to your inquiry. We will not use your information for
						other purposes. See our{" "}
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
					{status === "submitting" ? (
						"Sending message..."
					) : (
						<>
							<Send className="mr-2 h-4 w-4" /> Send Message
						</>
					)}
				</Button>
			</form>
		</div>
	);
}
