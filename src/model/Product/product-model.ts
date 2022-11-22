import dataIndex from "../../decorators/dataIndex.decorator";
import title from "../../decorators/title.decorator";
import renderCell from "../../decorators/renderCell.decorator";
import titleRenderCell from "./renderCells";
import key from "../../decorators/key.decorators";

export class Post {

  @dataIndex("id")
  @title("id")
  @key("id")
  id: number | undefined;

  @dataIndex("title")
  @title("Title")
  @key("title")
  @renderCell(titleRenderCell)
  title: string = "";

  @dataIndex("status")
  @title("status")
  @key("status")
  status: string = "";

  @dataIndex("createdAt")
  @title("createdAt")
  @key("createdAt")
  createdAt: Date | undefined;
}
