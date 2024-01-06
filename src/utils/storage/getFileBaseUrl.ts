import { appConstants } from "../appConstants";

export const GetFileBaseUrl = (orgBucketName: string, filepath: string) => {
  return (
    appConstants.NEXT_PUBLIC_SUPABASE_PROJECT_URL +
    "/storage/v1/object/public/" +
    orgBucketName +
    "/" +
    filepath
  );
};
