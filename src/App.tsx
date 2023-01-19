import { Refine } from "@pankod/refine-core";
import {
  Layout,
  ReadyPage,
  notificationProvider,
  ErrorComponent,
} from "@pankod/refine-antd";
import routerProvider from "@pankod/refine-react-router-v6";
import dataProvider from "@pankod/refine-simple-rest";
//import jhipsterDataProvider from "./packages/core/dataprovider/jhipster";

import "@pankod/refine-antd/dist/styles.min.css";
import { PostList, PostShow } from "./pages/posts";
import { SampleList } from "./pages/samples/list";
import React from "react";

const App: React.FC = () => {
  return (
    <Refine
      routerProvider={routerProvider}
      dataProvider={dataProvider("https://api.fake-rest.refine.dev")}
      //dataProvider={jhipsterDataProvider("http://localhost:8081/api")}
      Layout={Layout}
      ReadyPage={ReadyPage}
      notificationProvider={notificationProvider}
      catchAll={<ErrorComponent />}
      resources={[
        { name: "posts", list: PostList, show: PostShow },
        { name: "samples", list: SampleList },
      ]}
    />
  );
};

export default App;
