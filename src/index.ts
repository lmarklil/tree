export type ChildrenGetter<T> = (node: T) => T[] | null | undefined;

/*
 * 先序遍历
 */
export function preorderTraversal<T>(
  root: T,
  params: {
    getChildren: ChildrenGetter<T>;
    onTraverse?: (node: T) => void | boolean;
  }
) {
  const { getChildren, onTraverse } = params;

  const stack = [root]; // 节点栈

  while (stack.length > 0) {
    const node = stack.pop();

    if (node) {
      const children = getChildren(node);

      const shouldReturn = onTraverse?.(node);

      if (shouldReturn) return;

      children && stack.push(...[...children].reverse()); // Array.reverse 会修改源数组，需要克隆后再reverse
    }
  }
}

/*
 * 层次遍历
 */
export function levelTraversal<T>(
  root: T,
  params: {
    getChildren: ChildrenGetter<T>;
    onTraverse?: (node: T, index: number, level: number) => boolean;
    /*
     * 换行回调
     *
     * nodes: 当前层次节点
     * level: 当前层次
     */
    onWrap?: (nodes: T[], level: number) => void;
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
      onWrap?.([...queue], level);
    }

    const node = queue.shift();

    if (node) {
      const shouldReturn = onTraverse?.(node, index++, level);

      if (shouldReturn) return;

      const children = getChildren(node);

      children && queue.push(...children);

      nextLevelNodeCount += children?.length || 0;
    }
  }
}

/*
 * 获取叶子节点
 */
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

/*
 * 计算高度
 */
export function computeHeight<T>(
  root: T,
  params: { getChildren: ChildrenGetter<T> }
) {
  const { getChildren } = params;

  let height = 0;

  levelTraversal(root, {
    getChildren,
    onWrap: (nodes, level) => (height = level),
  });

  return height;
}

/*
 * 计算度
 */
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

/*
 * 获取后代节点
 */
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

/*
 * 探索路径
 *
 * @description 基于先序遍历探索路径
 */
export function explorPath<T>(
  root: T,
  params: {
    getChildren: ChildrenGetter<T>;
    /*
     * 每次路径更新时触发，函数返回true时终止探索
     */
    onProgress: (path: T[]) => void | boolean;
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

      const shouldReturn = onProgress(path);

      if (shouldReturn) return true;

      if (children && children.length > 0) {
        for (let i = children.length - 1; i > -1; i--) {
          const child = children[i];

          child && pathStack.push([...path, child]);
        }
      }
    },
  });
}