// disable pagination for rest requests (for calls made directly from SRD)
export async function disablePagination(ctx: any): Promise<void> {
  if (ctx.params.provider == 'rest') ctx.params.paginate = false
}
