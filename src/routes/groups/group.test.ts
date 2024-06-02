import { expect, test, describe } from "bun:test";
import app from "../..";
import { createUserFunction } from "../../utils/testUtils";

describe("Group Testings", async () => {
  const userRequest = await createUserFunction();
  let addGroupId: number;
  const auth = userRequest.headers.get("Authorization");

  test("Testing Create Group", async () => {
    const req = new Request("http://localhost:3000/groups/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth}`,
      },
      body: JSON.stringify({
        name: "Test Group",
      }),
    });
    const res = await app.request(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    addGroupId = body.id;
    expect(body).toHaveProperty("id");
    expect(body).toHaveProperty("name");
    expect(body.name).toBe("Test Group");
  });
  test("Testing Add Member", async () => {
    const userRequest = await createUserFunction();
    const user = await userRequest.json();
    const auth = userRequest.headers.get("Authorization");
    const req = new Request("http://localhost:3000/groups/add-member", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth}`,
      },
      body: JSON.stringify({
        id: addGroupId,
        user: {
          userId: user.id,
          role: "admin",
        },
      }),
    });
    const res = await app.request(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toHaveProperty("message");
    expect(body.message).toBe("ok");
  });
});
