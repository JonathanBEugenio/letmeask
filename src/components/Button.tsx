import { ButtonHTMLAttributes } from "react";
import { useTheme } from "../hooks/useTheme";
import '../styles/button.scss';

type buttonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isOutlined?: boolean;
};

// Named export
export function Button({ isOutlined = false, ...props }: buttonProps) {
    const { theme } = useTheme();

    return (
        <button
            className={`button ${theme} ${isOutlined ? 'outlined' : ''}`}
            {...props}
        />
    )
}