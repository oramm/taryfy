import Axios from "axios";

class AxiosPost {
  private static _token: string = "";
  public static setToken(token: string) {
    console.log("setToken:", token);
    AxiosPost._token = token;
  }
  public static post(
    path: string,
    params: any,
    callback: (response: any) => void,
    callback_error?: (error: any) => void
  ) {
    console.log("post path:", path);
    console.log("post params:", params);
    console.log("post token:", AxiosPost._token);
    if (AxiosPost._token) {
      console.log("post token added");
      Axios.defaults.headers.common["Authorization"] = AxiosPost._token;
    }
    Axios.post(path, params)
      .then((response) => {
        console.log("post response:", response);
        callback(response);
      })
      .catch((error) => {
        console.log("post error:", error);
        callback_error && callback_error(error);
      })
      .then(() => {
        // always executed
      });
  }
}

let post = AxiosPost.post;
let setToken = AxiosPost.setToken;
export { post, setToken as setPostToken };
