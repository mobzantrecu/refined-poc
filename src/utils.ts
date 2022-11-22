import { keyMetadataKey } from "./decorators/key.decorators";
import "reflect-metadata";
import { dataIndexMetadataKey } from "./decorators/dataIndex.decorator";
import { titleMetadataKey } from "./decorators/title.decorator";
import { renderCellMetadataKey } from "./decorators/renderCell.decorator";
import { TableRowSelection } from 'antd/es/table/interface';

interface Columns<T> extends TableRowSelection<T> {
  [label: string]: any
}

const listOfSymbols = [
  dataIndexMetadataKey,
  keyMetadataKey,
  titleMetadataKey,
  renderCellMetadataKey,
];

function getColumns<T>(arg: any): Columns<T> {
  const object = new arg();
  const keys = Reflect.ownKeys(object);
  const columns: Columns<T> = [];

  keys.forEach((key) => {
    let columnDefinition: Columns<T> = {};
    listOfSymbols.forEach((symbol) => {
      const metadataValue = Reflect.getMetadata(symbol, object, key);
      if (metadataValue) {
        columnDefinition = {
          ...columnDefinition,
          ...metadataValue,
        };
      }
    });
    columns.push(columnDefinition);
  });

  return columns;
};

export default getColumns;
