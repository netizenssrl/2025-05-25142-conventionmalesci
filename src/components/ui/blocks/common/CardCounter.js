"use client";

// import nextui components
import { Card, CardHeader, CardBody, Divider } from "@nextui-org/react";

export default function CardCounter({label, count, color}) {
    return (
        <Card className={`flex-1 w-44 h-32 bg-${color} text-white`}>
            <CardHeader className="text-md justify-center font-semibold">{label}</CardHeader>
            <Divider />
            <CardBody className="justify-center items-center text-4xl font-semibold">
                {count}
            </CardBody>
        </Card>
    )
}