interface Adapter<T> {
  /**
   * Get node type of the ast node.
   * @param node {T} ast node
   * @returns {string} node type
   */
  getNodeType(node: T): string;

  /**
   * Get source code of the ast node.
   * @param node {T} ast node
   * @returns {string} source code
   */
  getSource(node: T): string;

  /**
   * Get node children of the ast node.
   * @param node {T} ast node
   * @returns {T[]} node children
   */
  getChildren(node: T): T[];

  /**
   * Get node siblings of the ast node.
   * @param node {T} ast node
   * @returns {T[]} node siblings
   */
  getSiblings(node: T): T[];
}

export default Adapter;
