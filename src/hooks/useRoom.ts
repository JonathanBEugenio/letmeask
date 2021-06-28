import { useEffect, useState } from "react";
import { database } from '../services/firebase';
import { useAuth } from "./useAuth";

type Question = {
    id: string;
    author: {
        name: string;
        avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likeCount: number;
    likeId: string | undefined;
}

type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record<string, {
        authorId: string
    }>;
}>;


export function useRoom(roomId: string) {
    const { user } = useAuth();
    const [title, settitle] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.on('value', room => {
            const firebaseQuestions: FirebaseQuestions = room.val().questions ?? {};
            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isAnswered: value.isAnswered,
                    isHighlighted: value.isHighlighted,
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find(([key, value]) => value.authorId === user?.id)?.[0],
                }
            });

            settitle(room.val().title);
            setQuestions(parsedQuestions);
        });

        return () => {
            roomRef.off('value');
        };

    }, [roomId, user?.id]);

    return {
        title,
        questions,
    };
}