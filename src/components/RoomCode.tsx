import copyImg from '../assets/images/copy.svg';
import { useTheme } from '../hooks/useTheme';
import '../styles/roomCode.scss';

type RoomCodeProps = {
    code: string;
}

export function RoomCode(props: RoomCodeProps) {
    const { theme } = useTheme();

    function copyRoomCodeToClipBoard() {
        navigator.clipboard.writeText(props.code);
    }

    return (
        <button className={`room-code ${theme}`} onClick={copyRoomCodeToClipBoard}>
            <div>
                <img src={copyImg} alt="Copiar código da sala" />
            </div>
            <span>Sala #{props.code}</span>
        </button>
    );
}