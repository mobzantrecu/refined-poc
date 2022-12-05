import {
  List,
  ShowButton,
  Table,
  TagField,
  useTable,
  FilterDropdown,
  Select,
  useSelect,
} from "@pankod/refine-antd";
import { ColumnType } from "antd/es/table/interface";
import { antdEntityGetColumns, antdEntityTableColumns, antdEntityTableColumnsFromObj } from "decorators/AntdEntity";
import { generatePropertyDecorators } from "decorators/AntdTableColumn";
import { ColumnsType } from "rc-table/lib/interface";
import { Post } from "../../model/Product/product-model";
//import getColumns from "../../utils";
import ts from 'typescript'

export const PostList: React.FC = () => {
  const { tableProps } = useTable<Post>();

  /* Pruebas out of context */

  const vals = ['option1'];
  const dec = generatePropertyDecorators(vals);

  const resultFile = ts.createSourceFile("someFileName.ts", "", ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  const result = printer.printNode(ts.EmitHint.Unspecified, dec[0], resultFile);
  console.log({result})

  /* End pruebas out of context */

  const cols = antdEntityGetColumns<Post>(Post);
  
  cols.actions = {
      title: "Actions",
      dataIndex: "actions",
      width: 125,
      render: (text, record, index) => {
        return <ShowButton hideText recordItemId={record.id} />;
      }
  }

  const { selectProps: postSelectProps } = useSelect<String>({
        resource: "posts",
        optionValue: "title"
    });
  
  cols["title"].filterDropdown = (props: any) => (
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
      <Table {...tableProps} rowKey="id" columns={antdEntityTableColumnsFromObj<Post>(cols)} />
    </List>
  );
};
