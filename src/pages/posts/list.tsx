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
import { Post } from "../../model/Product/product-model";
import getColumns from "../../utils";

export const PostList: React.FC = () => {
  const { tableProps } = useTable<Post>();

  const columns = getColumns<Post>(Post);
  const { selectProps: postSelectProps } = useSelect<String>({
        resource: "posts",
        optionValue: "title"
    });
  //columns.find((column) => columns.key === Post.prototype.status.toString()) <-buscar forma de obtener nombre del atributo directamente
  

  const colTitle = columns.find((column: any) => column.key === "title")
  const colIndexTitle = columns.findIndex((column: any) => column.key === "title")
  colTitle.filterDropdown = (props: any) => (
          <FilterDropdown {...props}>
              <Select
                  style={{ minWidth: 200 }}
                  mode="multiple"
                  placeholder="Select posts"
                  {...postSelectProps}
              />
          </FilterDropdown>
        );

  columns[colIndexTitle] = colTitle


  //obtengo la columna y su indice
  const col = columns.find((column: any) => column.key === "status")
  const colIndex = columns.findIndex((column: any) => column.key === "status")
  
  //le sobreescribo el atributo render a la columna para decir que en esta pantalla se renderice como un TagField
  col.render = (value: any) => <TagField value={value} />;
  columns[colIndex] = col

  columns.push({
      title: "Actions",
      dataIndex: "actions",
      minWidth: 250,
      renderCell: function render(params: any) {
          return <ShowButton hideText recordItemId={params.row.id} />;
      },
  })

  return (
    <List>
      <Table {...tableProps} rowKey="id" columns={columns as any} />
    </List>
  );
};
