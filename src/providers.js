"use client";
import {NextUIProvider} from "@nextui-org/react";
import {ThemeProvider as NextThemeProvider} from "next-themes";

import {useState, useEffect} from "react";

export default function RootProvider({ children }) {

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    return (
        <NextUIProvider>
            <NextThemeProvider attribute="class" defaultTheme="light">
                {children}
            </NextThemeProvider>
        </NextUIProvider>
    );
}