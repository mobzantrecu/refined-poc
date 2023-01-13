import title from "../../decorators/title.decorator";
import JoinColumn from "../../decorators/joinColumn.decorator";
import render from "../../decorators/render.decorator";
import { Tag } from "antd";
import { Rule } from "antd/lib/form";

// TODO: write function and move to other file
function rules(...rulesToApply: Rule[]) {
  return Reflect.metadata('test', 'test');
}
import { User } from "./user-model";
import { AntdEntity } from "../../decorators/AntdEntity";


@AntdEntity()
export class Post {
  id: number | undefined;

  @title("Title test")
  @rules({required: true})
  title: string = "";

  @render(Tag)
  status: string = "";

  createdAt: Date | undefined;

  @JoinColumn("users", 'id', "firstName")
  @title("Usuario")
  user: User = new User();
}

