import { ColumnType } from "antd/es/table/interface";
import { Post } from "model/Product/product-model";
import ts from "typescript";
import { antdEntityGetColumns } from "./AntdEntity";

/* Pruebas out of context */

//type AntdTableColumnDecorator =  ColumnType<any>[Property in keyof ColumnType<any> as `${string & Property}`]: () => void;
type AntdTableColumnDecorator = {
  [Property in keyof ColumnType<any> as `${string &
    Property}`]: PropertyDecorator;
};

type test = ColumnType<any>["title"];

//type title = keyof Pick<ColumnType<any>, Property in keyof ColumnType<any>>

/*
const func = ts.factory.createFunctionDeclaration(undefined, undefined, name, paramsTypes, params, funcType, funcBody);
const statement = ts.factory.createVariableStatement(
    undefined,
    ts.factory.createVariableDeclarationList(
        [ts.factory.createVariableDeclaration(
            ts.factory.createIdentifier("testVar"),
            undefined,
            ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
            ts.factory.createStringLiteral("test")
        )],
        ts.NodeFlags.Const
    )
);
*/
declare type T = ts.TypeReference;
function generatePropertyDecoratorsFromInterface<T>(obj: T) {
  console.log(obj as ts.TypeReference);
  console.log("properties", (obj as ts.TypeReference).getProperties());
}

export function generatePropertyDecorators(
  columnPropertiesNames: string[]
): ts.FunctionExpression[] {
  generatePropertyDecoratorsFromInterface<ColumnType<any>>(
    antdEntityGetColumns<Post>(Post)
  );

  const callReflect = (columnProperty: string): ts.CallExpression => {
    const resultFile = ts.createSourceFile(
      "someFileName.ts",
      "",
      ts.ScriptTarget.Latest,
      false,
      ts.ScriptKind.TS
    );
    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
    const callExpression = ts.factory.createCallExpression(
      ts.factory.createIdentifier("Reflect.metadata"),
      undefined,
      [
        ts.factory.createStringLiteral(columnProperty),
        ts.factory.createIdentifier("decoratorParams"),
      ]
    );
    console.log({ callExpression });
    const result = printer.printNode(
      ts.EmitHint.Expression,
      callExpression,
      resultFile
    );
    console.log("callReflect", { result });

    return callExpression;
  };

  const returnCallReflect = (columnProperty: string) =>
    ts.factory.createReturnStatement(callReflect(columnProperty));

  const callReflectCall = (columnProperty: string) =>
    ts.factory.createBlock([returnCallReflect(columnProperty)]);

  return columnPropertiesNames.map((columnProperty) => {
    return ts.factory.createFunctionExpression(
      undefined,
      undefined,
      columnProperty,
      undefined,
      [
        ts.factory.createParameterDeclaration(
          undefined,
          undefined,
          "decoratrorParams"
        ),
      ],
      ts.factory.createTypeReferenceNode("PropertyDecorator", undefined),
      callReflectCall(columnProperty)
    );
  });
}
