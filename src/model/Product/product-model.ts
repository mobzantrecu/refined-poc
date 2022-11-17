import dataIndex from "../../decorators/dataIndex.decorator";
import title from "../../decorators/title.decorator";
import renderCell from "../../decorators/renderCell.decorator";
import titleRenderCell from "./renderCells";
import key from "../../decorators/key.decorators";

export interface IPost {
  id: number;
  key: number;
  title: string;
  status: "published" | "draft" | "rejected";
  createdAt: string;
}

class Post {
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
  createdAt: string | undefined;
}

export default Post;
