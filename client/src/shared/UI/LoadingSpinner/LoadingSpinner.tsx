import { Spinner } from '@heroui/spinner';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    label?: string;
}

export const LoadingSpinner = ({ size = 'md', label = 'Загрузка...' }: LoadingSpinnerProps) => (
    <div className="flex flex-col items-center justify-center p-4">
        <Spinner size={size} />
        <p className="mt-2 text-sm text-gray-600">{label}</p>
    </div>
);

