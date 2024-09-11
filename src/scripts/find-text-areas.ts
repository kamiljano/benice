export default function findTextAreas(node: Node): HTMLTextAreaElement[] {
  if (node instanceof HTMLTextAreaElement) {
    return [node];
  }
  const result: HTMLTextAreaElement[] = [];
  for (const child of node.childNodes) {
    const textAreas = findTextAreas(child);
    result.push(...textAreas);
  }
  return result;
}
