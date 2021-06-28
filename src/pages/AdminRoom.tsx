import { Fragment } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import answerImg from '../assets/images/answer.svg';
import checkImg from '../assets/images/check.svg';
import deleteImg from '../assets/images/delete.svg';
import emptyQuestionsImg from '../assets/images/empty-questions.svg';
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { useRoom } from '../hooks/useRoom';
import { useTheme } from '../hooks/useTheme';
import { database } from '../services/firebase';
import '../styles/room.scss';

type RoomParams = {
    roomId: string;
}

export function AdminRoom() {
    const history = useHistory();
    const { theme, toggleTheme } = useTheme();
    const { roomId } = useParams<RoomParams>();
    const { title, questions } = useRoom(roomId);

    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date()
        });

        history.push('/');
    }

    async function handleCheckQuestionAsAnswered(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true

        });
    }

    async function handleHighlightQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true
        });
    }

    async function handleDeleteQuestion(questionId: string) {
        if (window.confirm('Tem certeza que você deseja encerrar esta sala?')) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }

    return (
        <div className={theme} id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="letmeask" />
                    <div>
                        <RoomCode code={roomId} />
                        <Button
                            isOutlined
                            onClick={handleEndRoom}
                        >Encerrar sala</Button>
                        <div className="toggle" onClick={toggleTheme}></div>
                    </div>
                </div>
            </header>
            <main>
                <div className="room-title">
                    <h1>Sala - {title}</h1>
                    {questions.length > 0 && <span>{questions.length} perguntas</span>}
                </div>
                {questions.length > 0 ? (
                    <div className="question-list">
                        {questions.map(question => {
                            return (
                                <Question
                                    key={question.id}
                                    content={question.content}
                                    author={question.author}
                                    isAnswered={question.isAnswered}
                                    isHighlighted={question.isHighlighted}
                                >
                                    {!question.isAnswered && (
                                        <Fragment>
                                            <button
                                                type="button"
                                                onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                            >
                                                <img src={checkImg} alt="Marcar pergunta como respondida" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleHighlightQuestion(question.id)}
                                            >
                                                <img src={answerImg} alt="Destacar pergunta" />
                                            </button>
                                        </Fragment>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteQuestion(question.id)}
                                    >
                                        <img src={deleteImg} alt="Remover pergunta" />
                                    </button>
                                </Question>
                            );
                        })}
                    </div>
                ) : (
                    <div className="empty-question">
                        <img src={emptyQuestionsImg} alt="Nenhuma pergunta por aqui" />
                        <span>Nenhuma pergunta por aqui...</span>
                        <p>Envie o código desta sala para seus amigos e comece a responder perguntas!</p>
                    </div>
                )}
            </main>
        </div>
    );
}