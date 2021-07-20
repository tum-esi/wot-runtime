// eslint-disable-next-line @typescript-eslint/ban-types
export function safeJsonParse(data: string | object): Promise<object> {
  return typeof data === 'object' ? data : JSON.parse(data)
}
