import css from "./ErrorMessage.module.css";

interface ErrorMessageProps {
  message?: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <p className={css.text}>
      {message || "There was an error, please try again..."}
    </p>
  );
};

export default ErrorMessage;
