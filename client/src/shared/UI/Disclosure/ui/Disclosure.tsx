import { classNames } from 'shared/lib/classNames/classNames';
import { memo, ReactNode } from 'react';
import { Disclosure as HDisclosure } from '@headlessui/react';

import classes from './Disclosure.module.scss';

interface DisclosureProps {
    className?: string;
    title: ReactNode;
    content: ReactNode;
}

export const Disclosure = memo((props: DisclosureProps) => {
    const { className, content, title } = props;

    return (
        <HDisclosure>
            {({ open }) => (
                <>
                    <HDisclosure.Button
                        className={classNames(classes.button, {
                            [classes.open]: open,
                        })}
                    >
                        {title}
                    </HDisclosure.Button>
                    <HDisclosure.Panel className={classes.panel}>
                        {content}
                    </HDisclosure.Panel>
                </>
            )}
        </HDisclosure>
    );
});
