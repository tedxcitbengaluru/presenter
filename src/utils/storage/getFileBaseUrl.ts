import { appConstants } from "../appConstants";

export const GetFileBaseUrl = (bucketName: string, filepath: string) => {
  return (
    "https://zytxbvdpgtirmcnaehio.supabase.co" +
    "/storage/v1/object/public/" +
    bucketName +
    "/" +
    filepath
  );
};
