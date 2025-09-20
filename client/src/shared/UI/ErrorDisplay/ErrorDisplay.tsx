import { Button } from '../Button';

interface ErrorDisplayProps {
    error: Error;
    onRetry?: () => void;
    retryLabel?: string;
}

export const ErrorDisplay = ({ error, onRetry, retryLabel = 'Повторить' }: ErrorDisplayProps) => (
    <div className="flex flex-col items-center justify-center p-4 text-center">
        <div className="text-red-600 mb-4">
            <h3 className="text-lg font-semibold mb-2">Произошла ошибка</h3>
            <p className="text-sm">{error.message}</p>
        </div>
        {onRetry && (
            <Button color="warning" onPress={onRetry}>
                {retryLabel}
            </Button>
        )}
    </div>
);

