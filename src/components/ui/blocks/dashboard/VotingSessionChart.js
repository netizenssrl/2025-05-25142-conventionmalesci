"use client";
import { useEffect, useState, useMemo } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { useTheme } from "next-themes";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function VotingSessionChart({ participantAnswers, question }) {
    const { theme } = useTheme();

    // Memorizza labels e colori per evitare di ricrearli a ogni render
    const { labels, answersBackgroundColors } = useMemo(() => {
        const labels = [];
        const answersBackgroundColors = [];
        for (const answer of question.answers) {
            const sLetter = answer.sLetter;
            const bCorrect = answer.bCorrect;
            if (bCorrect) {
                answersBackgroundColors.push('rgba(23, 201, 100, 1)');
                labels.push(`ANSWER ${sLetter} (CORRECT)`);
            } else {
                answersBackgroundColors.push('#e5e7eb');
                labels.push(`ANSWER ${sLetter}`);
            }
        }
        return { labels, answersBackgroundColors };
    }, [question.answers]);

    // Stato iniziale memorizzato
    const initialChartData = useMemo(() => ({
        labels,
        datasets: [{
            label: "Votes",
            data: [],
            backgroundColor: [],
        }]
    }), [labels]);

    const [chartData, setChartData] = useState(initialChartData);

    // Calcola i dati del grafico in base a `participantAnswers`
    useEffect(() => {
        if (participantAnswers) {
            const totalVotes = participantAnswers.length;
            const data = question.answers.map(answer => {
                const iAnswerVotes = participantAnswers.filter(participantAnswer => participantAnswer.answerId === answer.id).length;
                return (iAnswerVotes / totalVotes) * 100; // Percentuale
            });

            const tempChartData = {
                labels,
                datasets: [{
                    label: "Votes",
                    data,
                    backgroundColor: answersBackgroundColors,
                }]
            };

            // Aggiorna solo se i dati sono cambiati
            setChartData(prev => {
                const isEqual = JSON.stringify(prev) === JSON.stringify(tempChartData);
                return isEqual ? prev : tempChartData;
            });
        } else {
            setChartData(initialChartData);
        }
    }, [participantAnswers, question.answers, labels, answersBackgroundColors, initialChartData]);

    const options = useMemo(() => ({
        responsive: true,
        plugins: {
            title: {
                display: false
            },
            datalabels: {
                color: '#fff',
                anchor: 'center',
                offset: 20,
                font: {
                    size: 14,
                    weight: 'bold',
                },
            },
            legend: {
                display: false,
            }
        },
        scales: {
            x: {
                grid: {
                    color: theme === "light" ? "#e5e7eb" : "rgb(113, 113, 122)",
                },
                ticks: {
                    color: theme === "light" ? "#333" : "#fff",
                }
            },
            y: {
                min: 0,
                max: 100,
                grid: {
                    color: theme === "light" ? "#e5e7eb" : "rgb(113, 113, 122)",
                },
                ticks: {
                    color: theme === "light" ? "#333" : "#fff",
                }
            },
        }
    }), [theme]);

    return (
        <>
            <div className="pl-8 flex">
                {question.answers.map((answer, index) => {
                    const answerCount = participantAnswers
                        ? participantAnswers.filter(participantAnswer => participantAnswer.answerId === answer.id).length
                        : 0;
                    return (
                        <div className="flex-1" key={index}>
                            <p className="text-center text-sm">{answerCount}</p>
                        </div>
                    );
                })}
            </div>
            <Bar data={chartData} options={options} />
        </>
    );
}
