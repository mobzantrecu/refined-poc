import {
    List,
    ShowButton,
    Table,
    TagField,
    useTable,
    FilterDropdown,
    Select,
    useSelect,
} from '@pankod/refine-antd';
import {
    antdEntityGetColumns,
    antdEntityTableColumnsFromObj,
} from '../../decorators/AntdEntity';
import { Post } from '../../model/Product/product-model';
export const PostList: React.FC = () => {
    const { tableProps } = useTable<Post>();

    const cols = antdEntityGetColumns<Post>(Post);

    cols.actions = {
        title: 'Actions',
        dataIndex: 'actions',
        width: 125,
        render: (text, record, index) => {
            return <ShowButton hideText recordItemId={record.id} />;
        },
    };

    const { selectProps: postSelectProps } = useSelect<String>({
        resource: 'posts',
        optionValue: 'title',
    });

    cols['title'].filterDropdown = (props: any) => (
        <FilterDropdown {...props}>
            <Select
                style={{ minWidth: 200 }}
                mode="multiple"
                placeholder="Select posts"
                {...postSelectProps}
            />
        </FilterDropdown>
    );

    //le sobreescribo el atributo render a la columna para decir que en esta pantalla se renderice como un TagField
    cols.status.render = (value: any) => <TagField value={value} />;

    return (
        <List>
            <Table
                {...tableProps}
                rowKey="id"
                columns={antdEntityTableColumnsFromObj<Post>(cols)}
            />
        </List>
    );
};
