import React, { FunctionComponent } from 'react';
import 'reflect-metadata';
import JoinColumnFetch from '../model/DecoratorsReactFn/joinColumnFetch';
import JoinColumnMultipleFetch from '../model/DecoratorsReactFn/joinColumnMultipleFetch';

export const joinColumnMetadataKey = Symbol('JoinColumn');
export const joinColumnKey = 'render';

type Item = any | any[]

function JoinColum(
    resource: string,
    identification: string,
    fieldToShow: string,
    multiple?: boolean
) {
    const element = multiple ? JoinColumnMultipleFetch : JoinColumnFetch;
    const returnElement = (item: Item) => {
        const hasIdentificationProperty = !!item[identification];
        const isAnArrayOfIds = !!item.length;

        const id = isAnArrayOfIds && !hasIdentificationProperty ? item : item[identification];
        return React.createElement(element, {
            resource,
            id,
            fieldToShow,
        }) as unknown as FunctionComponent<any>;
    };

    return Reflect.metadata(joinColumnMetadataKey, returnElement);
}

export default JoinColum; //ManyToOne, OneToOne
