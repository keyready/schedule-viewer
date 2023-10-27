import { memo } from 'react';
import { Skeleton } from 'shared/UI/Skeleton/Skeleton';
import classes from './Loader.module.scss';

interface LoaderProps {}

export const Loader = memo((props: LoaderProps) => (
    <div className={classes.groupsWrapper}>
        {new Array(5).fill(0).map((_, index) => (
            <Skeleton
                key={index}
                width="100%"
                height="150px"
                border="10px"
            />
        ))}
    </div>
));
