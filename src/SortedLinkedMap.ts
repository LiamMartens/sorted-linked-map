class ListItem<T> {
  constructor(
    public before: ListItem<T> | null,
    public after: ListItem<T> | null,
    public value: T
  ) {}
}

export class SortedLinkedMap<K, T> {
  public head: ListItem<T> | null = null;
  public tail: ListItem<T> | null = null;
  public map = new Map<K, ListItem<T>>();
  private keyAssignments = new Map<T, K>();

  constructor(
    private keyFn: (value: T) => K,
    private sortFn: (a: T, b: T) => -1 | 0 | 1
  ) {}

  public clear = () => {
    this.head = null;
    this.tail = null;
    this.map.clear();
    this.keyAssignments.clear();
  };

  public has = (key: K) => {
    return this.map.has(key);
  };

  public get = (key: K) => {
    return this.map.get(key);
  };

  public values = (
    reversed: boolean = false
  ): IterableIterator<ListItem<T>> => {
    let current = reversed ? this.tail : this.head;

    const iterator: Iterator<ListItem<T>> = {
      next: () => {
        if (current) {
          const result = {
            done: false,
            value: current,
          };
          current = reversed ? current.before : current.after;
          return result;
        }

        return {
          done: true,
          value: undefined,
        };
      },
    };

    const iterable = {
      next: iterator.next,
      [Symbol.iterator]: () => iterable,
    };

    return iterable;
  };

  public forEach = (
    fn: (value: T, item: ListItem<T>, index: number) => void,
    reversed = false
  ) => {
    let index = !reversed ? 0 : this.map.size - 1;
    let step = !reversed ? 1 : -1;
    for (const entry of this.values(reversed)) {
      fn(entry.value, entry, index);
      index += step;
    }
  };

  public filter = (
    fn: (value: T, item: ListItem<T>, index: number) => boolean
  ) => {
    const list: ListItem<T>[] = [];
    let index = 0;
    for (const entry of this.values()) {
      if (fn(entry.value, entry, index)) {
        list.push(entry);
      }
      index += 1;
    }
    return list;
  };

  public add = (value: T, keyArg?: K) => {
    const key = keyArg ?? this.keyFn(value);
    const item = new ListItem(null, null, value);
    // find preceeding element to update links
    let before: ListItem<T> | null = null;
    find_loop: for (const entry of this.values(true)) {
      const sortkey = this.sortFn(item.value, entry.value);
      if (sortkey === 1 || sortkey === 0) {
        before = entry;
        break find_loop;
      }
    }
    if (before) {
      // if before exists -> the item will be inserted after another item
      if (before.after) {
        before.after.before = item;
      }
      item.before = before;
      item.after = before.after;
      before.after = item;
    } else {
      // if not -> the item will be inserted at the start
      item.after = this.head;
      if (this.head) {
        this.head.before = item;
      }
    }

    // insert item
    this.map.set(key, item);
    this.keyAssignments.set(item.value, key);
    // check if this is a head or tail
    if (item.before === null) this.head = item;
    if (item.after === null) this.tail = item;

    return item;
  };

  public remove = (value: T) => {
    const key = this.keyAssignments.get(value);
    if (!key) return false;

    const item = this.map.get(key);
    if (!item) {
      this.keyAssignments.delete(value);
      return false;
    }

    if (item.before) {
      item.before.after = item.after;
      if (!item.after) this.tail = item.before;
    }
    if (item.after) {
      item.after.before = item.before;
      if (!item.before) this.head = item.after;
    }

    this.keyAssignments.delete(value);
    this.map.delete(key);
    return true;
  };

  public removeByKey = (key: K) => {
    const item = this.map.get(key);
    if (!item) return false;

    if (item.before) {
      item.before.after = item.after;
      if (!item.after) this.tail = item.before;
    }
    if (item.after) {
      item.after.before = item.before;
      if (!item.before) this.head = item.after;
    }

    this.keyAssignments.delete(item.value);
    this.map.delete(key);
    return true;
  };
}
