import {
  UnknownKeysParam,
  ZodObject,
  ZodRawShape,
  ZodTypeAny,
  objectInputType,
  objectOutputType,
  z,
} from "zod";

export function generateActionService<
  T extends ZodRawShape,
  UnknownKeys extends UnknownKeysParam = UnknownKeysParam,
  Catchall extends ZodTypeAny = ZodTypeAny,
  Output = objectOutputType<T, Catchall, UnknownKeys>,
  Input = objectInputType<T, Catchall, UnknownKeys>,
>(
  zodSchema: ZodObject<T, UnknownKeys, Catchall, Output, Input>,
  service: (inputAfterParse: Output) => Promise<void>,
) {
  return async function (inputBeforeParse: Input) {
    const parsedInput = zodSchema.parse(inputBeforeParse);
    await service(parsedInput);
  };
}
