import { FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import googleIconImg from '../assets/images/google-icon.svg';
import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import '../styles/auth.scss';

export function Home() {
    const history = useHistory();
    const [roomId, setRoomId] = useState('');
    const { user, signInWithGoogle } = useAuth();

    async function handleCreateRoom() {
        if (!user) {
            await signInWithGoogle();
        }

        history.push('/rooms/new');
    }

    async function HandleJoinRoom(event: FormEvent) {
        event.preventDefault();

        if (roomId.trim() === '') {
            return;
        }

        const roomRef = await database.ref(`rooms/${roomId}`).get();

        if (!roomRef.exists()) {
            alert('Room does not exists');
            return;
        }

        if (roomRef.val().endedAt) {
            alert('Room already closed');
            return;
        }

        history.push(`/rooms/${roomRef.key}`);
    }

    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Toda pergunta tem uma resposta.</strong>
                <p>Aprenda e compartilhe conhecimento
                    com outras pessoas</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="letmeask" />
                    <button className="create-room" onClick={handleCreateRoom}>
                        <img src={googleIconImg} alt="Logo do google" />
                        Crie sua sala com o Google
                    </button>

                    <div className="separator">
                        ou entre em uma sala
                    </div>

                    <form onSubmit={HandleJoinRoom}>
                        <input
                            type="text"
                            placeholder="Digite o código da sala"
                            onChange={event => { setRoomId(event.target.value) }}
                            value={roomId}
                        />
                        <Button type="submit">Entrar na sala</Button>
                    </form>
                </div>
            </main>
        </div>
    );
}