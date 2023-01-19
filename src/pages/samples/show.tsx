import { useShow } from '@pankod/refine-core';
import { Show } from '@pankod/refine-antd';
import React from 'react';
import {
    antdEntityGetShowFields,
    ShowFieldsType,
} from '../../decorators/AntdEntity';
import { ShowAllFields } from '../../ShowComp';
import { Sample } from 'model/Product/samples-model';

export const SampleShow = () => {
    const { queryResult } = useShow<Sample>();
    const { data, isLoading } = queryResult;
    const record = data?.data;

    const fields: ShowFieldsType = antdEntityGetShowFields<Sample>(
        Sample,
        record
    );

    // TODO: refactor names
    const testComponents = React.useMemo(
        () => <ShowAllFields fields={fields} />,
        [fields]
    );

    // Make example using antdEntityGetShowFields return value automatically, another example changing some value or render and a third example managing data manually.
    return (
        <div>
            <Show isLoading={isLoading}>{testComponents}</Show>
        </div>
    );
};
