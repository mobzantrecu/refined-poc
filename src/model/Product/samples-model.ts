import title from "../../decorators/title.decorator";
import JoinColumn from "../../decorators/joinColumn.decorator";
import { AntdEntity } from "decorators/AntdEntity";

@AntdEntity()
export class Sample {
  id: number | undefined;

  title: string = "";

  status: string = "";

  createdAt: Date | undefined;

  @JoinColumn("tags", "tags", "title", true)
  @title("Etiquetas")
  tags: any;
}
