import { Badge, Button } from "antd";
import { CommentOutlined } from '@ant-design/icons';
import React, { useState } from "react";
import { Link } from "react-router-dom";

const decisionTree = {
    'Bonjour, comment puis-je vous aider ?': {
        'Je cherche une page': {
            response: 'Bien sûr, quelle page recherchez-vous ?',
            choices: {
                'Mes réglages de profil': { response : 'Cliquez pour être redigiré(e)', link: '/Réglage' },
                'Les associations que je suis': { response: 'Cliquez pour être redigiré(e)', link: '/myAssociation' },
                'Les votes': { response: 'Cliquez pour être redigiré(e)', link: '/votes' },
                'Les assemblées générales': { response: 'Cliquez pour être redigiré(e)', link: '/ag'}
            }
        },
        'Quel est le but de ce site ?': {
            response: "Cette application web vise à fournir une solution complète et flexible pour la gestion des associations, quelle qu’en soit la taille ou le domaine d'activité. Cette application a été conçue pour répondre aux besoins variés des associations en leur offrant un outil performant pour gérer leurs opérations quotidiennes et leurs interactions avec leurs membres et le public.",
            choices: {
                "Qu'est-ce qu'une association ?": {response: "Une association est un groupement de personnes réunies autour d'un projet ou d'une activité commune, à but non lucratif. Elle est régie par la loi et doit généralement être déclarée pour obtenir la personnalité juridique. Les membres s'engagent volontairement pour réaliser des objectifs partagés sans rechercher de profits."},
                "Qu'est-ce qu'une assemblée générale ?": {response: "Une assemblée générale dans le cadre d'une association est une réunion de l'ensemble des membres de l'association. Elle a pour but de prendre des décisions importantes, telles que l'approbation des comptes, l'élection des dirigeants, la modification des statuts ou la dissolution de l'association. C'est un organe délibératif essentiel pour la démocratie interne de l'association."}
            }
        }
    }
};

type Message = {
    type: 'bot' | 'user'
    text: string
    link?: string
};

const Chatbot = () => {
    const initialMessage: Message = { type: 'bot', text: 'Bonjour, comment puis-je vous aider ?' };
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([initialMessage]);
    const [currentNode, setCurrentNode] = useState(decisionTree['Bonjour, comment puis-je vous aider ?']);

    const toggleChat = () => setIsOpen(!isOpen);

    const handleChoice = (choice) => {
        setMessages(prevMsgs => [...prevMsgs, { type: 'user', text: choice }]);
        
        if (currentNode[choice]) {
            const newNode = currentNode[choice];
            setTimeout(() => {
                setMessages(prevMsgs => [
                    ...prevMsgs,
                    { type: 'bot', text: newNode.response, link: newNode.link ?? null },
                ]);
                setCurrentNode(newNode.choices);
            }, 500);
        }
    }

    const resetChatbot = () => {
        setMessages([initialMessage]);
        setCurrentNode(decisionTree['Bonjour, comment puis-je vous aider ?']);
    }

    return (
        <div className="fixed bottom-0 right-0 m-5 flex items-end">
            <div className={`w-80 h-96 mr-2 bg-white shadow rounded-lg ${isOpen ? "" : "hidden"}`}>
                <div className="bg-electric shadow text-white p-3 font-bold text-center rounded-t-lg">Chatbot</div>
                <div className="flex flex-col h-5/6 overflow-y-auto p-3">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.type === 'bot' ? 'justify-start' : 'justify-end'} mb-2`}>
                            {msg.link ? (
                                <Link to={msg.link} className="px-3 py-1 rounded-full bg-gray">
                                    {msg.text}
                                </Link>
                            ) : (
                                <p className="px-3 py-1 rounded-xl bg-gray">
                                    {msg.text}
                                </p>
                            )}
                        </div>
                    ))}
                    {currentNode && Object.keys(currentNode).length > 0 ? (
                        <div className="flex justify-end flex-col">
                            {Object.keys(currentNode).map((choice, index) => (
                                <button
                                    key={index}
                                    className="px-3 py-1 mt-2 rounded-full border border-electric hover:bg-electric hover:text-white"
                                    onClick={() => handleChoice(choice)}>
                                    {choice}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex justify-center mt-4">
                            <button
                                className="px-3 py-1 rounded-full border border-electric hover:bg-electric hover:text-white"
                                onClick={resetChatbot}>
                                Recommencer
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <Badge dot={!isOpen} offset={[-6, 6]}>
                <Button
                    shape="circle"
                    icon={<CommentOutlined style={{ fontSize: '26px' }} />}
                    style={{ width: "46px", height: "46px" }}
                    onClick={toggleChat}
                />
            </Badge>
        </div>
    )
}

export default Chatbot;
