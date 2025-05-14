"use client";

import { NavbarItem } from "@nextui-org/react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

export default function HeaderNavbarItem({url, name, icon}){
    const pathName = usePathname();
    return (
        <NavbarItem isActive={pathName === url}>
            <NextLink href={url}>
                <span className="text-lg text-foreground leading-none flex gap-2 px-3 items-center">{icon}{name}</span>
            </NextLink>
        </NavbarItem>
    );
}