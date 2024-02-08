import { beforeEach, expect, it, vi } from "vitest";
import { SortedLinkedMap } from "../src/index.js";

type UserType = {
  id: string;
  name: string;
  age: number;
};

const list = new SortedLinkedMap<string, UserType>(
  (value) => value.id,
  (a, b) => (a.age < b.age ? -1 : 1)
);

function expectOrder(list: SortedLinkedMap<string, UserType>, ids: string[]) {
  let index = 0;
  for (const entry of list.values()) {
    expect(entry.value.id).toEqual(ids[index]);
    index++;
  }
}

beforeEach(() => {
  list.clear();
  list.add({
    id: "john.doe",
    age: 35,
    name: "John Doe",
  });
  list.add({
    id: "john.smith",
    age: 28,
    name: "John Smith",
  });
});

it("should work", () => {
  expectOrder(list, ["john.smith", "john.doe"]);
});

it("should be able to insert in the middle", () => {
  list.add({
    id: "elon.musk",
    age: 30,
    name: "Elon Musk",
  });
  expectOrder(list, ["john.smith", "elon.musk", "john.doe"]);
});

it("should be able to delete items", () => {
  list.add({
    id: "elon.musk",
    age: 30,
    name: "Elon Musk",
  });
  expectOrder(list, ["john.smith", "elon.musk", "john.doe"]);

  list.removeByKey("elon.musk");
  expectOrder(list, ["john.smith", "john.doe"]);

  list.removeByKey("john.smith");
  expectOrder(list, ["john.doe"]);

  list.removeByKey("john.doe");
  expect(list.map.size).toEqual(0);
});
