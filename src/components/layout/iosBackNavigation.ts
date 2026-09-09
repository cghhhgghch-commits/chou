export function resolveIOSBackTarget(
  currentPath: string,
  historyLength: number,
  previousPath?: string | null,
): "back" | string {
  if (!currentPath || currentPath === "/") {
    return "/";
  }

  const cleanPrevious = previousPath && previousPath !== currentPath ? previousPath : null;

  if (cleanPrevious && cleanPrevious !== "/login") {
    return cleanPrevious;
  }

  if (historyLength > 1) {
    return "back";
  }

  return "/";
}
