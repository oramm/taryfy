import axios from "axios";
import { ModalDialogs, ModalDialogsGetFake } from "./modal_dialogs";

class AxiosPost {
  private static _token: string = "";
  private static _counter: number = 0;
  private static _cancel: Array<any> = [];

  private static _modal_dialogs: ModalDialogs = ModalDialogsGetFake();
  public static setToken(token: string) {
    console.log("setToken:", token);
    AxiosPost._token = token;
  }
  public static cancel() {
    let cancel = AxiosPost._cancel.shift();
    while (cancel)
    {
      console.log("cancel:",cancel);
      cancel.cancel();
      cancel = AxiosPost._cancel.shift();
    }
  }
  public static post(
    path: string,
    params: any,
    callback: (response: any) => void,
    callback_error?: (error: any) => void
  ) {
    console.log("post counter:", AxiosPost._counter++);
    console.log("post path:", path);
    console.log("post params:", params);
    console.log("post token:", AxiosPost._token);
    if (AxiosPost._token) {
      console.log("post token added");
      axios.defaults.headers.common["Authorization"] = AxiosPost._token;
    }
    AxiosPost._modal_dialogs.wTokuOn();
    let cancel = axios.CancelToken.source();
    AxiosPost._cancel.push(cancel);
    axios
      .post(path, params, { cancelToken: cancel.token })
      .then((response) => {
        AxiosPost._modal_dialogs.wTokuOff();
        console.log("post response:", response);
        AxiosPost._cancel.splice(AxiosPost._cancel.indexOf(cancel), 1);
        callback(response);
      })
      .catch((error) => {
        AxiosPost._modal_dialogs.wTokuOff();
        if (axios.isCancel(error)) {
          console.log("request canceled error:", error);
        } else {
          console.log("post error:", error);
        }
        AxiosPost._cancel.splice(AxiosPost._cancel.indexOf(cancel), 1);
        callback_error && callback_error(error);
      });
    // .then(() => {
    //   AxiosPost._modal_dialogs.wTokuOff();
    // });
  }
  public static setModals(modals: ModalDialogs) {
    AxiosPost._modal_dialogs = modals;
  }
}

let post = AxiosPost.post;
let cancel = AxiosPost.cancel;
let setToken = AxiosPost.setToken;
let setModals = AxiosPost.setModals;
export { post, cancel, setToken as setPostToken, setModals as setPostModals };
