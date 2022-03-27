import { Log } from "./log";

const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const sheets = google.sheets("v4");
const util = require("util");

// If modifying these scopes, delete token.json.
const SCOPES = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/spreadsheets",
];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "./token.json";

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials) {
  Log(0, "authorize credentials:", credentials);
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  return new Promise((resolve, reject) => {
    fs.readFile(TOKEN_PATH, (err, token) => {
      Log(0, "authorize readFile err:", err);
      Log(0, "authorize readFile token:", token);
      if (token) {
        oAuth2Client.setCredentials(JSON.parse(token));
        return resolve(oAuth2Client);
      } else if (err) {
        return resolve(getNewToken(oAuth2Client));
      }
      reject();
    });
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
async function getNewToken(oAuth2Client) {
  Log(0, "getNewToken");
  return oAuth2Client
    //.getToken("4/1AX4XfWj1zgomjeWZD9wjc88Rd7ofIb-R3KrjViBaMPj4Zuylc7Y8Dj_Iipo")  //server
    .getToken("4/1AY0e-g7YO7w9X9JNAgiRt8059sZxb8gUNqOaRJcu4aFKVv7VnPYpTlgs3M4") //home
    .then((token) => {
      Log(0, "getNewToken token:", token);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      return new Promise((resolve, reject) => {
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          Log(0, `writeFile err: ${err}`);
          if (err) reject();
          else resolve(oAuth2Client);
        });
      });
    })
    .catch((error) => {
      Log(0, "getNewToken error:", error);
      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
      });
      Log(0, "Authorize this app by visiting this url:", authUrl);
    });
}

class Spreadsheet {
  readFiles = async (googleDrive: any) => {
    Log(0, `readFiles`);
    return googleDrive.files.list({
      pageSize: 10,
      fields: "nextPageToken, files(id, name)",
    });
  };

  createFolder = async (googleDrive: any, name: string) => {
    Log(0, `createFolder`);
    return googleDrive.files.create({
      fields: "id",
      resource: {
        name: name,
        mimeType: "application/vnd.google-apps.folder",
      },
    });
  };

  copyFile = async (googleDrive: any, fileId: any, copyname: string) => {
    Log(0, "copyFile fileId:", fileId);
    return googleDrive.files.copy({
      fileId: fileId,
      requestBody: {
        name: copyname,
        //    , parents: ["idOfDestinationFolder"]
      },
    });
  };

  deleteFile = async (googleDrive: any, fileId: any) => {
    Log(0, "copyFile fileId:", fileId);
    return googleDrive.files.delete({
      fileId: fileId,
    });
  };

  permition = async (googleDrive: any, fileId: any) => {
    Log(0, `permition`);
    return googleDrive.permissions.create({
      fileId: fileId,
      resource: { role: "writer", type: "anyone" },
    });
  };

  connect = async () => {
    Log(0, `connect`);
    return new Promise((resolve, reject) => {
      fs.readFile("../client_secret_desktop.json", (err, content) => {
        Log(0, `connect readFile err: ${err}, content: ${content}`);
        if (content) resolve(content);
        else reject(err);
      });
    })
      .then((content: string) => {
        Log(0, `connect content: ${content}`);
        return authorize(JSON.parse(content));
      })
      .then((auth) => {
        Log(0, `connect auth: ${auth}`);
        google.options({ auth });
        const googleDrive = google.drive("v3");
        return googleDrive;
      });
  };

  sheets: any;

  connectSheets = async () => {
    Log(0, "WynikiSpreadsheet connectSheets");
    return new Promise((resolve, reject) => {
      //fs.readFile("./creds-from-google.json", (err, content) => {
      fs.readFile("../client_secret_desktop.json", (err, content) => {
        Log(0, "connectSheets readFile err:", err);
        Log(0, "connectSheets readFile content:", content);
        if (content) resolve(authorize(JSON.parse(content)));
        else if (err) reject(err);
      });
    }).then((auth) => {
      Log(0, "connectSheets auth:", auth);
      this.sheets = google.sheets({ version: "v4", auth });
      return this.sheets;
    });
  };

  sheets_map: any;

  loadSheets = async () => {
    Log(0, "loadSheets this.file_id:", this.file_id);
    const sheetsResponse = (
      await this.sheets.spreadsheets.get({
        spreadsheetId: this.file_id,
        includeGridData: false,
      })
    ).data.sheets;
    Log(0, "loadSheets sheetsResponse:", sheetsResponse);
    this.sheets_map = new Map();
    sheetsResponse.forEach((item, index) => {
      this.sheets_map[item.properties.title] = {
        id: item.properties.sheetId,
        index: index,
      };
      Log(0, `item[${index}]:`, item);
    });
    return;
  };

  loadValues = async (range) => {
    Log(0, "loadValues");
    let request = this.sheets.spreadsheets.values.get({
      spreadsheetId: this.file_id,
      range: range,
    });
    return request;
  };

  getSheet = (name: string) => {
    Log(0, "getSheet");
    return this.sheets_map[name];
  };

  request: any;

  getRequest = () => {
    return this.request;
  };

  createEmptyRequest = async () => {
    this.request = {
      //auth: ...,
      spreadsheetId: this.file_id,
      requestBody: {
        requests: [],
      },
    };
  };

  addRequestCopy = (
    sheet_name: string,
    xs: number,
    ys: number,
    xsr: number,
    ysr: number,
    xd: number,
    yd: number,
    xdr: number,
    ydr: number
  ) => {
    Log(0, "addRequestCopy sheet_name:", sheet_name);
    Log(0, "addRequestCopy sheet_id:", this.sheets_map[sheet_name].id);
    if (ydr >= 0 && ysr >= 0)
      this.request.requestBody.requests.push({
        copyPaste: {
          source: {
            sheetId: this.sheets_map[sheet_name].id,
            startRowIndex: ys,
            endRowIndex: ys + ysr,
            startColumnIndex: xs,
            endColumnIndex: xs + xsr,
          },
          destination: {
            sheetId: this.sheets_map[sheet_name].id,
            startRowIndex: yd,
            endRowIndex: yd + ydr,
            startColumnIndex: xd,
            endColumnIndex: xd + xdr,
          },
          pasteType: "PASTE_NORMAL",
        },
      });
  };

  addRequestMove = (
    sheet_name: string,
    xs: number,
    ys: number,
    xsr: number,
    ysr: number,
    xd: number,
    yd: number,
    xdr: number,
    ydr: number
  ) => {
    Log(0, "addRequestMove sheet_name:", sheet_name);
    this.request.requestBody.requests.push({
      cutPaste: {
        source: {
          sheetId: this.sheets_map[sheet_name].id,
          startRowIndex: ys,
          endRowIndex: ys + ysr,
          startColumnIndex: xs,
          endColumnIndex: xs + xsr,
        },
        destination: {
          sheetId: this.sheets_map[sheet_name].id,
          startRowIndex: yd,
          endRowIndex: yd + ydr,
          startColumnIndex: xd,
          endColumnIndex: xd + xdr,
        },
        pasteType: "PASTE_NORMAL",
      },
    });
  };

  addRequestValue = (
    sheet_name: string,
    col: number,
    row: number,
    value: any,
    type?: string
  ) => {
    //Log(0, "addRequestValue sheet_name:" + sheet_name + " value:", value);
    let userValue: object;
    if (type === "formula")
      userValue = {
        formulaValue: value,
      };
    else if (typeof value === "number")
      userValue = {
        numberValue: value,
      };
    else
      userValue = {
        stringValue: value,
      };

    this.request.requestBody.requests.push({
      updateCells: {
        range: {
          sheetId: this.sheets_map[sheet_name].id,
          startRowIndex: row,
          endRowIndex: row + 1,
          startColumnIndex: col,
          endColumnIndex: col + 1,
        },
        fields: "*",
        rows: [
          {
            values: [
              {
                userEnteredValue: userValue,
              },
            ],
          },
        ],
      },
    });
  };

  columnNames = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","AA","AB","AC","AD","AE","AF","AG","AH","AI","AJ","AK","AL","AM","AN","AO","AP","AQ","AR","AS","AT","AU","AV","AW","AX","AY","AZ"];

  addRequestSum = (
    sheet_name: string,
    x: number,
    y: number,
    sx: number,
    sxr: number,
    sy: number,
    syr: number
  ) => {
    Log(0, "addRequestSum sheet_name:", sheet_name);

    let formula = `=sum(${this.columnNames[sx]}${sy + 1}:${
      this.columnNames[sx + sxr]
    }${sy + syr + 1})`;
    Log(0, "addRequestSum formula:", formula);
    this.request.requestBody.requests.push({
      updateCells: {
        range: {
          sheetId: this.sheets_map[sheet_name].id,
          startRowIndex: y,
          endRowIndex: y + 1,
          startColumnIndex: x,
          endColumnIndex: x + 1,
        },
        fields: "*",
        rows: [
          {
            values: [
              {
                userEnteredValue: {
                  formulaValue: formula,
                },
              },
            ],
          },
        ],
      },
    });
  };

  addRequestClear = (
    sheet_name: string,
    x: number,
    y: number,
    xr: number,
    yr: number
  ) => {
    Log(0, "addRequestClear sheet_name:", sheet_name);
    this.request.requestBody.requests.push({
      updateCells: {
        range: {
          sheetId: this.sheets_map[sheet_name].id,
          startRowIndex: y,
          endRowIndex: y + yr,
          startColumnIndex: x,
          endColumnIndex: x + xr,
        },
        fields: "*",
      },
    });
  };

  addRequestMerge = (
    sheet_name: string,
    col: number,
    col_r: number,
    row: number,
    row_r: number
  ) => {
    Log(0, "addRequestMerge sheet_name:", sheet_name);
    this.request.requestBody.requests.push({
      mergeCells: {
        range: {
          sheetId: this.sheets_map[sheet_name].id,
          startColumnIndex: col,
          endColumnIndex: col + col_r + 1,
          startRowIndex: row,
          endRowIndex: row + row_r + 1, 
        },
        mergeType: "MERGE_ROWS",
      },
    });
  };

  addRequestBorderInner = (
    sheet_name: string,
    col: number,
    col_r: number,
    row: number,
    row_r: number
  ) => {
    Log(0, "addRequestMerge sheet_name:", sheet_name);
    this.request.requestBody.requests.push({
      updateBorders: {
        range: {
          sheetId: this.sheets_map[sheet_name].id,
          startRowIndex: row,
          endRowIndex: row + row_r,
          startColumnIndex: col,
          endColumnIndex: col + col_r,
        },
        top:   { style: "SOLID", color: {red: 0, blue: 0, green: 0, alpha:0 } },
        bottom:{ style: "SOLID", color: {red: 0, blue: 0, green: 0, alpha:0 } },
        left:  { style: "SOLID", color: {red: 0, blue: 0, green: 0, alpha:0 } },
        right: { style: "SOLID", color: {red: 0, blue: 0, green: 0, alpha:0 } },
        innerHorizontal: { style: "SOLID", color: {red: 0, blue: 0, green: 0, alpha:0 } },
        innerVertical: { style: "SOLID", color: {red: 0, blue: 0, green: 0, alpha:0 } },
      },
    });
  };

  addRequestBorder = (
    sheet_name: string,
    col: number,
    col_r: number,
    row: number,
    row_r: number
  ) => {
    Log(0, "addRequestMerge sheet_name:", sheet_name);
    this.request.requestBody.requests.push({
      updateBorders: {
        range: {
          sheetId: this.sheets_map[sheet_name].id,
          startRowIndex: row,
          endRowIndex: row + row_r,
          startColumnIndex: col,
          endColumnIndex: col + col_r,
        },
        top:   { style: "SOLID", color: {red: 0, blue: 0, green: 0, alpha:0 } },
        bottom:{ style: "SOLID", color: {red: 0, blue: 0, green: 0, alpha:0 } },
        left:  { style: "SOLID", color: {red: 0, blue: 0, green: 0, alpha:0 } },
        right: { style: "SOLID", color: {red: 0, blue: 0, green: 0, alpha:0 } },
        innerHorizontal: { style: "NONE", color: {red: 0, blue: 0, green: 0, alpha:0 } },
        innerVertical: { style: "NONE", color: {red: 0, blue: 0, green: 0, alpha:0 } },
      },
    });
  };

  addRequestDuplicateSheet = (sheet_name: string, new_sheet_name: string) => {
    Log(0, "addRequestDuplicateSheet sheet_name:", sheet_name);
    this.request.requestBody.requests.push({
      duplicateSheet: {
        sourceSheetId: this.sheets_map[sheet_name].id,
        insertSheetIndex: this.sheets_map[sheet_name].index + 1,
        //newSheetId: new_sheet_id,
        newSheetName: new_sheet_name,
      },
    });
  };

  addRequestRenameSheet = (sheet_name: string, new_sheet_name: string) => {
    Log(0, "addRequestRenameSheet sheet_name:", sheet_name);
    this.request.requestBody.requests.push({
      updateSheetProperties: {
        properties: {
          sheetId: this.sheets_map[sheet_name].id,
          title: new_sheet_name,
          // index: integer,
          // sheetType: enum (SheetType),
          // gridProperties: {
          //   object (GridProperties)
          // },
          // hidden: boolean,
          // tabColor: {
          //   object (Color)
          // },
          // tabColorStyle: {
          //   object (ColorStyle)
          // },
          // rightToLeft: boolean,
          // dataSourceSheetProperties: {
          //   object (DataSourceSheetProperties)
          // }
        },
      },
    });
  };

  addRequestEmptyRow = (
    sheet_name: string,
    x: number,
    xr: number,
    y: number
  ) => {
    Log(0, "addRequestEmptyRow sheet_name:", sheet_name);
    this.request.requestBody.requests.push({
      updateCells: {
        range: {
          sheetId: this.sheets_map[sheet_name].id,
          startRowIndex: y,
          endRowIndex: y + 1,
          startColumnIndex: x,
          endColumnIndex: x + xr,
        },
        fields: "*",
        rows: [
          {
            values: [],
          },
        ],
      },
    });
    Log(0, "addRequestEmptyRow this.request:", this.request);
    Log(
      0,
      "addRequestEmptyRow this.request.requestBody.requests:",
      this.request.requestBody.requests.slice(-1)[0]
    );
    Log(
      0,
      "addRequestEmptyRow this.request.requestBody.requests.updateCells:",
      this.request.requestBody.requests.slice(-1)[0].updateCells
    );
  };

  addRequestRowValue = (value: any) => {
    Log(0, "addRequestRowValue value:", value);
    if (typeof value === "number") {
      this.request.requestBody.requests
        .slice(-1)[0]
        .updateCells.rows[0].values.push({
          userEnteredValue: {
            numberValue: value,
          },
        });
    } else {
      this.request.requestBody.requests
        .slice(-1)[0]
        .updateCells.rows[0].values.push({
          userEnteredValue: {
            stringValue: value,
          },
        });
    }
  };

  file_id: string;
  public setFileId = async (id) => {
    Log(0, "setFileId file_id:", id);
    this.file_id = id;
  };
  public copyTemplate = async (template_id, name) => {
    Log(0, "copyTemplate enter");
    let googleDrive;
    return new Promise((resolve, reject) => {
      fs.readFile("../client_secret_desktop.json", (err, content) => {
        Log(0, `copyTemplate readFile err: ${err}, content: ${content}`);
        if (err) reject(err);
        else resolve(content);
      });
    })
      .then((content: string) => {
        Log(0, `copyTemplate content: ${content}`);
        return authorize(JSON.parse(content));
      })
      .then((auth) => {
        Log(0, `copyTemplate auth: ${auth}`);
        google.options({ auth });
        googleDrive = google.drive("v3");
        return this.copyFile(googleDrive, template_id, name);
      })
      .then((file_copy) => {
        Log(0, `copyTemplate generuj file_copy: ${file_copy}`);
        this.setFileId(file_copy.data.id);
        //this.readFiles(googleDrive);
        return this.permition(googleDrive, file_copy.data.id);
      });
  };
  batchUpdate = async () => {
    Log(0, "batchUpdate request:", util.inspect(this.request, { depth: null }));
    return this.sheets.spreadsheets.batchUpdate(this.request).data;
  };

  getWebLink = async () => {
    Log(0, "WynikiSpreadsheet getWebLink");
    return new Promise((resolve, reject) => {
      let googleDrive = google.drive("v3");
      googleDrive.files
        .get({
          fileId: this.file_id,
          fields: "webViewLink",
        })
        .then((response) => resolve(response.data.webViewLink + "&rm=minimal"))
        .catch((error) => reject(error));
    });
  };

  getLink = () => {
    return `https://docs.google.com/spreadsheets/d/${this.file_id}/edit?rm=minimal`;
  };
}

export { Spreadsheet };
