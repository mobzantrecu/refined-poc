import React, { FunctionComponent } from 'react';
import 'reflect-metadata';
import JoinColumnFetch from '../model/DecoratorsReactFn/joinColumnFetch';
import JoinColumnMultipleFetch from '../model/DecoratorsReactFn/joinColumnMultipleFetch';

export const joinColumnMetadataKey = Symbol('JoinColumn');
export const joinColumnKey = 'render';

function JoinColum(
    resource: string,
    identification: string,
    fieldToShow: string,
    multiple?: boolean
) {
    const element = multiple ? JoinColumnMultipleFetch : JoinColumnFetch;
    const returnElement = (item: any) => {
        const id = item[identification];
        return React.createElement(element, {
            resource,
            id,
            fieldToShow,
        }) as unknown as FunctionComponent<any>;
    };

    return Reflect.metadata(joinColumnMetadataKey, returnElement);
}

export default JoinColum; //ManyToOne, OneToOne
