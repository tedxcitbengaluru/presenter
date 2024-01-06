import { ZodTypeDef, z } from "zod";

export function parseEnv<
  TOutput,
  TDef extends ZodTypeDef = ZodTypeDef,
  TInput = TOutput,
>(
  envSchema: z.Schema<TOutput, TDef, TInput>,
  appName = "APP",
  envObject = process.env as any,
) {
  try {
    console.log(`${appName} ENV Validation Started!`);
    const parsedEnv = envSchema.parse(envObject);
    console.log(`${appName} ENV Validation Finished!`);
    if (process.env.NODE_ENV === "development")
      console.log(`ENV: ${JSON.stringify(parsedEnv, null, 4)}`);

    return parsedEnv;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
