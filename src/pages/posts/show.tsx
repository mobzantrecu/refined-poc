import { useShow } from "@pankod/refine-core";
import { Show, Input, DateField, TextField } from "@pankod/refine-antd";
import { Post } from "../../model/Product/product-model";
import React from "react";
import {
  antdEntityGetShowFields,
  ShowFieldsType,
} from "../../decorators/AntdEntity";
import { ShowAllFields } from "../../ShowComp";

export const PostShow = () => {
  const { queryResult } = useShow<Post>();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  const fields: ShowFieldsType = antdEntityGetShowFields<Post>(Post, record);
  //si record es null, qué pasa acá?
  fields.createdAt.render = () => (
    <DateField format="LLL" value={fields.createdAt.value} />
  );

  // TODO: refactor names
  const testComponents = React.useMemo(
    () => <ShowAllFields fields={fields} />,
    [fields]
  );

  //edit
  // const testComponentsEdit = React.useMemo(() => {return (
  //     <div>
  //     {testComponentEdit(record, Form.Item)}
  //     </div>
  //     )}, [record])

  // return (
  //     <div>
  //         <Edit isLoading={isLoading}>
  //         <Form>
  //         {testComponentsEdit}
  //             </Form>
  //         </Edit>
  //     </div>
  // );

  //const Testcomponnnnnent = testComponent(record)

  // Make example using antdEntityGetShowFields return value automatically, another example changing some value or render and a third example managing data manually.
  return (
    <div>
      <Show isLoading={isLoading}>{testComponents}</Show>
    </div>
  );
};

//edit
function _testComponentEdit(record: any, Component: any) {
  if (record) {
    let components: React.ReactNode = Object.keys(record).map((attribute) => {
      return (
        <div>
          <TextField value={record[attribute].toString() ?? null} />
          <br />
          <Component>
            <Input value={record[attribute].toString()} />
          </Component>
        </div>
      );
    });
    return components;
  }
}
