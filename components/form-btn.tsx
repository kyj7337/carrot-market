interface FormButtonProps {
  text: string;
  isLoading: boolean;
}

export default function FormButton(props: FormButtonProps) {
  const { text, isLoading } = props;
  const loadingText = '로딩중...';
  return (
    <button
      disabled={isLoading}
      className={`primary-btn h-10 disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed`}
    >
      {isLoading ? loadingText : text}
    </button>
  );
}
