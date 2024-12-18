export type ChildrenGetter<T> = (node: T) => T[] | null | undefined;

export type IteratorResult = void | typeof Break;

export const Break = Symbol();

export function preorderTraversal<T>(
  root: T,
  params: {
    getChildren: ChildrenGetter<T>;
    onTraverse: (node: T) => IteratorResult;
  }
) {
  const { getChildren, onTraverse } = params;

  const stack = [root]; // 节点栈

  while (stack.length > 0) {
    const node = stack.pop();

    if (node) {
      const children = getChildren(node);

      const iteratorResult = onTraverse(node);

      if (iteratorResult === Break) return;

      if (children) {
        for (let i = children.length - 1; i > -1; i--) {
          const child = children[i];

          child && stack.push(child);
        }
      }
    }
  }
}

export function levelTraversal<T>(
  root: T,
  params: {
    getChildren: ChildrenGetter<T>;
    onTraverse?: (node: T, index: number, level: number) => IteratorResult;
    onWrap?: (nodes: T[], level: number) => IteratorResult;
  }
) {
  const { getChildren, onTraverse, onWrap } = params;

  const queue = [root]; // 待遍历队列
  let index = 0; // 节点下标
  let level = 0; // 节点层次
  let nextLevelNodeCount = queue.length; // 下一层节点数

  while (queue.length > 0) {
    // 当下一层节点数与队列节点数一致时，说明已遍历到下一层次
    if (nextLevelNodeCount === queue.length) {
      level++;
      nextLevelNodeCount = 0; // 重置下一层节点数

      const iteratorResult = onWrap?.([...queue], level);

      if (iteratorResult === Break) return;
    }

    const node = queue.shift();

    if (node) {
      const iteratorResult = onTraverse?.(node, index++, level);

      if (iteratorResult === Break) return;

      const children = getChildren(node);

      children && queue.push(...children);

      nextLevelNodeCount += children?.length || 0;
    }
  }
}

export function getLeafNodes<T>(
  root: T,
  params: { getChildren: ChildrenGetter<T> }
) {
  const { getChildren } = params;

  const leafNodes: T[] = [];

  preorderTraversal(root, {
    getChildren,
    onTraverse: (node) => {
      const children = getChildren(node);

      (!children || children.length === 0) && leafNodes.push(node);
    },
  });

  return leafNodes;
}

export function computeHeight<T>(
  root: T,
  params: { getChildren: ChildrenGetter<T> }
) {
  const { getChildren } = params;

  let height = 0;

  levelTraversal(root, {
    getChildren,
    onWrap: (nodes, level) => {
      height = level;
    },
  });

  return height;
}

export function computeDegree<T>(
  root: T,
  params: { getChildren: ChildrenGetter<T> }
) {
  const { getChildren } = params;

  let degree = 0;

  preorderTraversal(root, {
    getChildren,
    onTraverse: (node) => {
      degree = Math.max(degree, getChildren(node)?.length || 0);
    },
  });

  return degree;
}

export function getDescendantNodes<T>(
  root: T,
  params: { getChildren: ChildrenGetter<T> }
) {
  const { getChildren } = params;

  const descendantNodes: T[] = [];

  preorderTraversal(root, {
    getChildren,
    onTraverse: (node) => {
      descendantNodes.push(node);
    },
  });

  return descendantNodes;
}

export function explorPath<T>(
  root: T,
  params: {
    getChildren: ChildrenGetter<T>;
    onProgress: (path: T[]) => IteratorResult;
  }
) {
  const { getChildren, onProgress } = params;

  const pathStack = [[root]];

  preorderTraversal(root, {
    getChildren,
    onTraverse: (node) => {
      const path = pathStack.pop();

      if (!path) return;

      const children = getChildren(node);

      const iteratorResult = onProgress(path);

      if (iteratorResult === Break) return Break;

      if (children && children.length > 0) {
        for (let i = children.length - 1; i > -1; i--) {
          const child = children[i];

          child && pathStack.push([...path, child]);
        }
      }
    },
  });
}
