export async function consume<T, R>({
  values,
  consumer,
  maxConsumer = 6,
}: {
  values: T[];
  consumer: (value: T) => Promise<R>;
  maxConsumer?: number;
}): Promise<PromiseSettledResult<R>[]> {
  values = Array.from(values);
  const results: PromiseSettledResult<R>[] = new Array(values.length);

  const tasks = new Array(maxConsumer).fill(undefined).map(async (_, i) => {
    let v: T | undefined;
    while ((v = values.pop())) {
      const i = values.length;

      try {
        const res = await consumer(v);
        results[i] = { status: "fulfilled", value: res };
      } catch (error) {
        results[i] = { status: "rejected", reason: error };
      }
    }
  });

  await Promise.all(tasks);

  return results;
}
