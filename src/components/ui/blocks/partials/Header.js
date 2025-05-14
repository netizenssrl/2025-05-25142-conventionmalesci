"use client";

import { usePathname, useRouter } from "next/navigation";
// import NextUI Elements
import {Avatar, Navbar, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, NavbarBrand, NavbarContent, Select, SelectItem } from "@nextui-org/react";
import NextLink from "next/link";

// import custom UI Elements
import HeaderNavbarItem from "@/components/ui/blocks/partials/HeaderNavbarItem";
import ThemeSwitcher from "@/components/ui/blocks/partials/ThemeSwitcher";

import { useEffect, useState } from "react";

import { useSocketStore } from "@/stores/socket";
import { useRoomStore } from "@/stores/room";

import {Home09Icon, Quiz04Icon, Message01Icon, UserGroupIcon, UserListIcon} from "hugeicons-react";

function replaceRoomInUrl(url, room) {
    return url.replace(/\/dashboard\/([^/]+)/, `/dashboard/${room}`);
}

export default function Header({room}) {
    const menuRoutes = [
        { url: `/dashboard/${room}`, name: "Home", icon: <Home09Icon className="size-6" /> },
        { url: `/dashboard/${room}/questions`, name: "Questions", icon: <Quiz04Icon className="size-6" /> },
        { url: `/dashboard/${room}/tweets`, name: "Tweets", icon: <Message01Icon className="size-6" /> },
        { url: `/dashboard/${room}/participants`, name: "Participants", icon: <UserListIcon className="size-6" /> },
        /* { url: `/dashboard/${room}/teams`, name: "Teams", icon: <UserGroupIcon className="size-6" /> } */,
    ];
    
    const currrentPath = usePathname();
    const router = useRouter();
    const roomStore = useRoomStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const bConnected = useSocketStore((state) => state.getConnectionStatus());

    const [selectedRoomKeys, setSelectedRoomKeys] = useState(new Set([]));

    useEffect(() => {
        if(roomStore.rooms.length > 0) {
            const validRoom = roomStore.rooms.find((singleRoom) => singleRoom.id === parseInt(room)) || room === "all";
            if(validRoom){
                setSelectedRoomKeys(new Set([room]));
            }
        }
    }, [roomStore.rooms, room]);
    const handleItemPress = (newRoom) => {
        return () => {
            router.push(replaceRoomInUrl(currrentPath, newRoom));
        };
    }
    
    return (
        <Navbar onMenuOpenChange={setIsMenuOpen} isBordered maxWidth="2xl" height="" className="site-navbar" classNames={{ wrapper: "px-3 2xl:px-0" }}>
            <NavbarMenuToggle className="lg:hidden" aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
            <NavbarBrand>
                <p className="font-bold text-primary text-lg lg:text-xl 2xl:text-3xl">NTZ DASHBOARD</p>
            </NavbarBrand>
            <NavbarContent justify="center" className="hidden lg:flex lg:gap-3 2xl:gap-6">
                {
                    menuRoutes.map((route) => {
                        return <HeaderNavbarItem key={route.url} url={route.url} name={route.name} icon={route.icon} />;
                    })
                }
            </NavbarContent>
            <NavbarMenu>
                {
                    menuRoutes.map((route) => {
                        return (
                            <NavbarMenuItem key={route.url}>
                                <HeaderNavbarItem url={route.url} name={route.name} icon={route.icon} />
                            </NavbarMenuItem>
                        );
                    })
                }
            </NavbarMenu>
            <NavbarContent justify="end">
                <Select
                    label="Connected to:"
                    size="sm"
                    className="max-w-48"
                    color={bConnected ? "success" : "danger"}
                    selectedKeys={selectedRoomKeys}
                    selectionMode="single"
                    onSelectionChange={setSelectedRoomKeys}
                >
                    <SelectItem key="all" onPress={handleItemPress("all")}>
                        All Rooms
                    </SelectItem>
                    {
                        roomStore.rooms.map((singleRoom) => {
                            return (
                                <SelectItem key={singleRoom.id} onPress={handleItemPress(singleRoom.id)}>
                                    {singleRoom.sName}
                                </SelectItem>
                            );
                        })
                    }
                </Select>
                <ThemeSwitcher />
                <div className="flex items-center">
                    <Avatar name="NTZ" className="w-12 h-12" />
                </div>
            </NavbarContent>
        </Navbar>
    );
}