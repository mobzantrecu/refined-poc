import {
    List, Table, useTable
} from "@pankod/refine-antd";
import { antdEntityGetColumns, antdEntityTableColumnsFromObj } from "../../decorators/AntdEntity";
import React from "react";
import { Sample } from "../../model/Product/samples-model";

export const SampleList: React.FC = () => {
  const { tableProps } = useTable<Sample>();
  const cols = antdEntityGetColumns<Sample>(Sample);

  return (
    <List>
      <Table {...tableProps} rowKey="id" columns={antdEntityTableColumnsFromObj<Sample>(cols) as any} />
    </List>
  );
};
