/**
 * Adapter interface
 */
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

  /**
   * Get named value for a property (e.g., convert operator number to name like "MinusToken").
   * Returns undefined if no conversion is needed.
   * @param key {string} property name
   * @param value {number} property value
   * @returns {string | undefined} named value or undefined
   */
  getNamedValue?(key: string, value: number): string | undefined;
}

export default Adapter;
