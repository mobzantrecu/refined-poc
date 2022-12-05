import { ColumnTitle, ColumnType } from "antd/es/table/interface";
import "reflect-metadata";
import { dataIndexKey, dataIndexMetadataKey } from "./dataIndex.decorator";
import { keyMetadataKey, keyKey } from "./key.decorators";
import { titleMetadataKey, titleKey } from "./title.decorator";

import { DataIndex, Key } from 'rc-table/lib/interface';

type AntdTableColumns<T> = Record<string | symbol, ColumnType<T>>;

interface AntdEntityOptions{};

/**
 * Marks the class as usable for Antd's components: Table's {@link '@antd/es/table/ColumnsType' | ColumnsType}, etc.
 * @decorators key, dataIndex, title, sorter
 **/
export function AntdEntity(options?: AntdEntityOptions): ClassDecorator;

export function AntdEntity(options?: AntdEntityOptions): ClassDecorator {
	return function(target: any) {
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
				metadataValue = Reflect.getMetadata(dataIndexMetadataKey, decoratedClass, property);
			} else {
				Reflect.defineMetadata(dataIndexMetadataKey, property, decoratedClass, property);
				metadataValue = property.toString();
			}

			const columnDefinition: ColumnType<TargetClassType> = columns[property];

			columnDefinition[dataIndexKey] = metadataValue;
		}

		for (const property of properties) {
			let metadataValue: Key | undefined = undefined;

			if (Reflect.hasMetadata(keyMetadataKey, decoratedClass, property)) {
				metadataValue = Reflect.getMetadata(keyMetadataKey, decoratedClass, property);
			} else {
				Reflect.defineMetadata(keyMetadataKey, property, decoratedClass, property);
				metadataValue = property.toString();
			}

			const columnDefinition: ColumnType<TargetClassType> = columns[property];

			columnDefinition[keyKey] = metadataValue;
		}

		for (const property of properties) {
			let metadataValue: ColumnTitle<TargetClassType> | undefined = undefined;

			if (Reflect.hasMetadata(titleMetadataKey, decoratedClass, property)) {
				metadataValue = Reflect.getMetadata(titleMetadataKey, decoratedClass, property);
			} else {
				Reflect.defineMetadata(titleMetadataKey, property, decoratedClass, property);
				metadataValue = property.toString();
			}

			const columnDefinition: ColumnType<TargetClassType> = columns[property];

			columnDefinition[titleKey] = metadataValue;
		}

		Reflect.defineMetadata('AntdTable:columns', columns, target);

		console.log(Reflect.getMetadata('AntdTable:columns', target));
		return target;
	}
}

export function antdEntityTableColumns<T>(clazz: Function): ColumnType<T>[] {
	return Object.values(Reflect.getMetadata('AntdTable:columns', clazz as Object));
}

export function antdEntityGetColumns<T>(clazz: Function): AntdTableColumns<T> {
	/** trick to clone object without referencing it @see {@link https://stackoverflow.com/a/38122523/11865068} **/
	return Object.assign({}, Reflect.getMetadata('AntdTable:columns', clazz)) as AntdTableColumns<T>;
}

export function antdEntityTableColumnsFromObj<T>(obj: AntdTableColumns<T>): ColumnType<T>[] {
	return Object.values(obj);
}