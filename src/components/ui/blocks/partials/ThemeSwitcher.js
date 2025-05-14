"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { Moon02Icon as Moon } from "hugeicons-react";
import { Sun01Icon as Sun } from "hugeicons-react";

export default function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Funzione per cambiare il tema
    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme); // Cambia il tema
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <Button
            isIconOnly
            onPress={toggleTheme} // Cambia tema al click
            aria-label="Toggle theme"
            color="transparent"
            size="lg"
        >
            {theme === "light" ? <Moon /> : <Sun />}
        </Button>
    );
}
