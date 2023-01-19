import axios from "axios";

//axios.defaults.adapter = require('axios/lib/adapters/http');

import JHipsterServer from "../../src/index";
import "./index.mock";

describe("getOne", () => {
  it("correct response", async () => {
    const response = JHipsterServer("https://api.jhipster.dev", axios).getOne({
      resource: "posts",
      id: "1",
    });

    const { data } = await response;

    expect(data.id).toBe(1);
    expect(data.title).toBe("Singapore Extremadura");
  });
});
