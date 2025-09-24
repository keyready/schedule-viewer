import { CardModal } from '@/shared/ui/CardModal';
import { Image } from '@heroui/image';

export default function TestingPage() {
    return (
        <div className="grid w-full grid-cols-4 gap-2">
            {new Array(10).fill(0).map((_, index) => (
                <CardModal
                    key={index}
                    id={index.toString()}
                    cardClassName="flex flex-col items-center justify-center w-full h-64 bg-red-100 rounded-md"
                    modalClassName="py-4 px-3 w-3/5 h-2/3 overflow-y-auto"
                    altContent={
                        <div className="flex w-full flex-col">
                            <h1 className="text-xl font-bold italic">Название статьи</h1>
                            <Image
                                alt="alternativeContent"
                                width={320}
                                height={240}
                                src="https://placeholder.pagebee.io/api/random/320/240"
                            />
                        </div>
                    }
                >
                    <h1>привет мир</h1>
                </CardModal>
            ))}
        </div>
    );
}
