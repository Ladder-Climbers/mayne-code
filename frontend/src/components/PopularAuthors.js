import ShowList from "./ShowList";
import { shuffle } from "../utils/utils";

export default function PopularAuthors(props) {
  const authors = ["[清] 曹雪芹 ", "余华", "[哥伦比亚] 加西亚·马尔克斯", "[英] 乔治·奥威尔", "[美国] 玛格丽特·米切尔", "刘慈欣", "[明] 罗贯中", "林奕含", "[英] 乔治·奥威尔", "[日] 东野圭吾", "[英] 阿·柯南道尔", "[法] 圣埃克苏佩里", "金庸", "三毛", "（丹麦）安徒生", "[美] 乔治·R. R. 马丁", "王小波", "[美] 哈珀·李", "路遥", "[法] 阿尔贝·加缪", "当年明月", "钱锺书", "J.K.罗琳 (J.K.Rowling)", "[哥伦比亚] 加西亚·马尔克斯", "[以色列] 尤瓦尔·赫拉利"];
  const list = (shuffle(authors)).map(k => {
    return { text: k }
  });
  return <ShowList subHeader="热门作家" list={list}></ShowList>
}