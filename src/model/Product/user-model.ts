import { AntdEntity } from "../../decorators/AntdEntity";

@AntdEntity()
export class User {
  id: number | undefined;
  name: string = "";
  lastName: string = "";
}