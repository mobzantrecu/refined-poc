import { keyMetadataKey } from "./decorators/key.decorators";
import "reflect-metadata";
import { dataIndexMetadataKey } from "./decorators/dataIndex.decorator";
import { titleMetadataKey } from "./decorators/title.decorator";
import { renderCellMetadataKey } from "./decorators/renderCell.decorator";

interface Columns {
  renderCell?: (params: any) => JSX.Element;
  headerName?: any;
  fieldName?: any;
}

const listOfSymbols = [
  dataIndexMetadataKey,
  keyMetadataKey,
  titleMetadataKey,
  renderCellMetadataKey,
];

const getColumns = (arg: any) => {
  const object = new arg();
  const keys = Reflect.ownKeys(object);
  const columns: Columns[] = [] as any;

  keys.forEach((key) => {
    let columnDefinition: Columns = {};
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
