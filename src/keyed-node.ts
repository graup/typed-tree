/**
 * A keyed node is a tree node that has a key and (optional) data.
 */
import type { ToStringable } from './utils/types';
import { MaybeHasChildren } from './tree';

export type KeyedNode<Data = unknown, Key = string> = {
  key: Key;
  data?: Data;
} & MaybeHasChildren<KeyedNode<Data, Key>>;

/**
 * Pretty print a tree of keyed nodes (vertically).
 * @param tree root node
 * @param printNullNodes if false, null-valued children are skipped.
 */
export function prettyPrint<K extends ToStringable>(
  tree: KeyedNode<unknown, K>,
  printNullNodes = false,
  nullSymbol = '()',
): string {
  const formatKey = (key: ToStringable, depth: number) => `${'  '.repeat(depth)}↳ ${key}`;

  function* iterate(node: KeyedNode<unknown, K>, depth=0): Generator<string> {
    yield formatKey(node.key, depth);
    if (node.children) {
      for (const child of node.children) {
        if (!child) {
          if (printNullNodes) {
            yield formatKey(nullSymbol, depth + 1);
          }
        } else {
          yield* iterate(child, depth + 1);
        }
      }
    }
  }
  return [...iterate(tree)].join('\n');
}