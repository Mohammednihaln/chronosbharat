"use client";

import { useEffect } from "react";
import { analytics } from "@/lib/firebase"; // Ensure this import path is correct

export default function FirebaseAnalytics() {
    useEffect(() => {
        // Analytics is initialized in lib/firebase.ts
        // This component ensures it runs on client mount if needed
        // You can add page view tracking logic here if specifically required by requirements
        // For standard GA4, automatic measurement handles page views.
    }, []);

    return null;
}
