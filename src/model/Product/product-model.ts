import title from "../../decorators/title.decorator";
import { AntdEntity } from "decorators/AntdEntity";

@AntdEntity()
export class Post {

  id: number | undefined;

  @title("Title test")
  title: string = "";

  status: string = "";

  createdAt: Date | undefined;
}
