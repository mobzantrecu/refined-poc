import { ColumnTitle, ColumnType } from "antd/es/table/interface";
import "reflect-metadata";
import { dataIndexKey, dataIndexMetadataKey } from "./dataIndex.decorator";
import { keyMetadataKey, keyKey } from "./key.decorators";
import { titleMetadataKey, titleKey } from "./title.decorator";

import { DataIndex, Key } from "rc-table/lib/interface";
import { Typography } from "antd";
import { ShowComp } from "../ShowComp";
import { renderMetadataKey, renderKey } from "./render.decorator";

interface AntdColumn<T> extends ColumnType<T> {
	renderTag?: React.Component
}

type AntdTableColumns<T> = Record<string | symbol, AntdColumn<T>>;

interface AntdEntityOptions {}

/**
 * Marks the class as usable for Antd's components: Table's {@link '@antd/es/table/ColumnsType' | ColumnsType}, etc.
 * @decorators key, dataIndex, title, sorter
 **/
export function AntdEntity(options?: AntdEntityOptions): ClassDecorator;

/**
 * TODO: type columnDefinition with a specific type which includes ColumnType and the properties used in the other views such as Show, which e.g. includes a component property
 * TODO: make it dynamic in base of available decorators and it's according @{link '@antd/es/table/ColumnsType' | column} property
 **/
export function AntdEntity(options?: AntdEntityOptions): ClassDecorator {
  /**
   * @param target - The class to which apply the decorator
   * TODO: specify target's type -- possibly it could be something like FunctionConstructor, but it doesn't work straightforward, because a Class is indeed a Function under the hood
   **/
  return function (target: any) {
    type TargetClassType = InstanceType<typeof target>;
    const decoratedClass = new target();
    const properties = Reflect.ownKeys(decoratedClass);
    const columns: AntdTableColumns<TargetClassType> = {};

    for (const property of properties) {
      columns[property] = {}; // type columns[property] = ColumnType<TargetClassType>;
    }

    for (const property of properties) {
      let metadataValue: DataIndex | undefined = undefined;

      if (Reflect.hasMetadata(dataIndexMetadataKey, decoratedClass, property)) {
        metadataValue = Reflect.getMetadata(
          dataIndexMetadataKey,
          decoratedClass,
          property
        );
      } else {
        Reflect.defineMetadata(
          dataIndexMetadataKey,
          property,
          decoratedClass,
          property
        );
        metadataValue = property.toString();
      }

      const columnDefinition = columns[property] as ColumnType<TargetClassType>;

      columnDefinition[dataIndexKey] = metadataValue;
    }

    for (const property of properties) {
      let metadataValue: Key | undefined = undefined;

      if (Reflect.hasMetadata(keyMetadataKey, decoratedClass, property)) {
        metadataValue = Reflect.getMetadata(
          keyMetadataKey,
          decoratedClass,
          property
        );
      } else {
        Reflect.defineMetadata(
          keyMetadataKey,
          property,
          decoratedClass,
          property
        );
        metadataValue = property.toString();
      }

      const columnDefinition = columns[property] as ColumnType<TargetClassType>;

      columnDefinition[keyKey] = metadataValue;
    }

    for (const property of properties) {
      let metadataValue = getFieldTitle(decoratedClass, property);
      const columnDefinition = columns[property] as ColumnType<TargetClassType>;

      columnDefinition[titleKey] = metadataValue;
    }

    for (const property of properties) {
      let metadataValue: React.ComponentType | undefined = undefined;

      if (Reflect.hasMetadata(renderMetadataKey, decoratedClass, property)) {
        metadataValue = Reflect.getMetadata(
          renderMetadataKey,
          decoratedClass,
          property
        );
      } else {
        Reflect.defineMetadata(
          renderMetadataKey,
          Typography.Paragraph,
          decoratedClass,
          property
        );
        metadataValue = Typography.Paragraph
      }

      const columnDefinition = columns[property] as {renderTag: any};

      columnDefinition[renderKey] = metadataValue;
    }

    Reflect.defineMetadata("AntdTable:columns", columns, target);

    console.log(Reflect.getMetadata("AntdTable:columns", target));
    return target;
  };
}

// TODO: explain what this 3 functions get as parameters, what returns and why. Whenever it's needed type the params, returns and expected arguments in calls.
export function antdEntityTableColumns<T>(clazz: Function): ColumnType<T>[] {
  return Object.values(
    Reflect.getMetadata("AntdTable:columns", clazz as Object)
  );
}

export function antdEntityGetColumns<T>(clazz: Function): AntdTableColumns<T> {
  /** trick to clone object without referencing it @see {@link https://stackoverflow.com/a/38122523/11865068} **/
  return Object.assign(
    {},
    Reflect.getMetadata("AntdTable:columns", clazz)
  ) as AntdTableColumns<T>;
}

export function antdEntityTableColumnsFromObj<T>(
  obj: AntdColumn<T>
): ColumnType<T>[] {
  return Object.values(obj);
}

/**
 * TODO: idem AntdEntity's internal function with target param but for clazz (specify target's type -- possibly it could be something like FunctionConstructor, but it doesn't work straightforward, because a Class is indeed a Function under the hood)
 * TODO: objectClass param should be something related to clazz's type given that it's an instance of JavaScript's Object that it yet needs to be converted to a clazz-type instance.
 **/
export function antdEntityGetShowFields<T>(
  clazz: any,
  objectClass: T | undefined
): ShowFieldsType {
  const showFields: ShowFieldsType = {};

  let metadata = Object.assign(
    {},
    Reflect.getMetadata("AntdTable:columns", clazz)
  );

  // TODO: refactor variables names
  //This converts objectClass to an instance of clazz-type to be able to get it's metadata and properties
  const objectInstance = new clazz();
  const obj = Object.assign(objectInstance, objectClass);

  /**
   *  TODO: check if should iterate over objectClass properties or over objectInstance properties? When loading the ShowComp without data, it only shows the fields that has some metadata defined and not all the expected/available fields?
   * 		Possible answer: We should iterate over objectInstance properties because it has only the properties defined in the class with which we want to operate, and not all the data that may come from the DataProvider.
   **/
  const properties = Reflect.ownKeys(obj);

  // TODO: {nice to have} This might be pre-computed and memoized instead of calling the function everytime the Show Fields need to be rendered.
  for (const property of properties) {
  	// TODO: complete default options or force them thorugh decorators initialization
  	const defaultOpts = {}
    // TODO: type objFields and refactor
    const objFields = {
      value: obj[property],
      /**
       * TODO: Take component from metadata and if it's null use Paragraph as default (done). This behaviour must be in some other method that handles metadata for an object, including this component property as getFieldTitle().
       * 		 If property it's marked as NotDisplay component must be null.
       * 		 If property it's marked as NotDisplay the render method must be no-op.
       * 		 If property it's marked as NotDisplay the render method _probably_ should be sealed/freezed (impossible to change). Gather info about this, it may be possible for some cases that you wouldn't like to show a field in certain default cases but one would like to manage edge-cases manually, or show all fields nonetheless based on some flag (like debug).
       * 		 If property it's marked as NotDisplay, the objFields for the property must be complete nonetheless.
       **/
      metadata: Object.assign(
        {},
        { renderTag: Typography.Paragraph },
        property in metadata ? metadata[property] : defaultOpts,
      ),
    };
    console.log({objFields})

    // TODO: pass index
    const render = () => ShowComp(obj[property], objFields);

    // TODO: refactor
    const propertyObject: ShowFields<typeof clazz> = Object.assign(
      {},
      objFields,
      { render }
    );
    showFields[property] = propertyObject;
  }

  return showFields;
}

export interface ShowFields<RecordType> {
  value: any;
  render: (
    value?: any,
    record?: RecordType,
    index?: number
  ) => React.ReactNode | React.ReactNode;
  // TODO: type metadata
  metadata?: Record<any, any>;
}
export type ShowFieldsType<RecordType extends object = any> = Record<
  string | symbol,
  ShowFields<RecordType>
>;

/**
 * @internal
 * Used to the information of a certain property of an object marked with the @{link title | title decorator}
 **/
function getFieldTitle(objectClass: any, property: string | symbol) {
  type TargetClassType = InstanceType<typeof objectClass>;
  let metadataValue: ColumnTitle<TargetClassType> | undefined = undefined;

  if (Reflect.hasMetadata(titleMetadataKey, objectClass, property)) {
    metadataValue = Reflect.getMetadata(
      titleMetadataKey,
      objectClass,
      property
    );
  } else {
    Reflect.defineMetadata(titleMetadataKey, property, objectClass, property);
    metadataValue = property.toString();
  }

  return metadataValue;
}
