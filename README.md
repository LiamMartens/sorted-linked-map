# Sorted Linked Map

[![badge](https://img.shields.io/npm/v/sorted-linked-map)](https://www.npmjs.com/package/sorted-linked-map) [![badge](https://img.shields.io/bundlephobia/min/sorted-linked-map)](https://bundlephobia.com/package/sorted-linked-map) ![badge](https://img.shields.io/github/license/LiamMartens/sorted-linked-map)  

This is an ordered linked map (like a double linked list) with items reachable by key.  

### Usage
```js
import { SortedLinkedMap } from "sorted-linked-map";

type UserType = {
  id: string;
  name: string;
  age: number;
};

const list = new SortedLinkedMap<string, UserType>(
  (value) => value.id,
  (a, b) => (a.age < b.age ? -1 : 1)
);

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
```
