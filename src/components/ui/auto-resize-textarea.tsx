import { useEffect, useRef, TextareaHTMLAttributes } from "react";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  onChangeValue: (val: string) => void;
}

export const AutoResizeTextarea = ({ 
  value, 
  onChangeValue, 
  className, 
  ...props 
}: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChangeValue(e.target.value)}
      className={`resize-none overflow-hidden bg-transparent w-full focus:outline-none focus:ring-1 focus:ring-amber-300 rounded px-1 -mx-1 ${className || ""}`}
      rows={1}
      {...props}
    />
  );
};
