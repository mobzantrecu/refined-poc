import { List, ShowButton, Table, useTable } from '@pankod/refine-antd';
import {
    antdEntityGetColumns,
    antdEntityTableColumnsFromObj,
} from '../../decorators/AntdEntity';
import React from 'react';
import { Sample } from '../../model/Product/samples-model';

export const SampleList: React.FC = () => {
    const { tableProps } = useTable<Sample>();
    const cols = antdEntityGetColumns<Sample>(Sample);

    cols.actions = {
        title: 'Actions',
        dataIndex: 'actions',
        width: 125,
        render: (text, record, index) => {
            return <ShowButton hideText recordItemId={record.id} />;
        },
    };

    return (
        <List>
            <Table
                {...tableProps}
                rowKey="id"
                columns={antdEntityTableColumnsFromObj<Sample>(cols)}
            />
        </List>
    );
};
