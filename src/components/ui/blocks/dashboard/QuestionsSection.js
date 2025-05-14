"use client";

// import hooks
import { useEffect, useState } from "react";

// import store
import { useStatusStore } from "@/stores/status";
import { useQuestionStore } from "@/stores/question";

// import nextui components
import { Accordion, AccordionItem, Card, CardBody } from "@nextui-org/react";

// import custom ui components
import SingleQuestion from "./SingleQuestion";

export default function QuestionsSection({selectedTargets}) {
    const status = useStatusStore((state) => state.status);
    const questions = useQuestionStore((state) => state.questions);
    return (
        <Card shadow="sm">
            <CardBody>
                {
                    questions.length === 0 ? (
                        <div className="text-center">No questions found</div>
                    ) : (
                        <Accordion defaultExpandedKeys={status.currentQuestionId && [status.currentQuestionId.toString()]}>
                            {
                                questions.map((question) => 
                                    <AccordionItem 
                                        key={question.id} 
                                        title={
                                            <div className="flex flex-row gap-2 items-center">
                                                <p className="font-semibold text-2xl text-primary">{`Question ${question.iFrontEndOrder}`}</p>
                                                <p className="text-primary">-</p>
                                                <p className="text-md font-semibold text-primary">{`${question.sSessionNotes}`}</p>
                                            </div>
                                        } 
                                        textValue={`Question ${question.id}`}
                                        s
                                        
                                    >
                                        <SingleQuestion question={question} selectedTargets={selectedTargets} />
                                    </AccordionItem>
                                )
                            }
                        </Accordion>
                    )
                }                
            </CardBody>
        </Card>
    );
}