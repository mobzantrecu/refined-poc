import {
  DateField,
  List,
  Table,
  TagField,
  useTable,
} from "@pankod/refine-antd";
import Post, { IPost } from "../../model/Product/product-model";
import getColumns from "../../utils";

export const PostList: React.FC = () => {
  const { tableProps } = useTable<IPost>();

  const columns = getColumns(Post);

  return (
    <List>
      <Table {...tableProps} rowKey="id" columns={columns as any} />
    </List>
  );
};
