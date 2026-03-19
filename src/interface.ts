export interface ICustomTextEditorProps {
    initialContent?: string | Record<string, any>;
    onChange?: (content: { html: string; json: Record<string, any> }) => void;
    className?: string;
}